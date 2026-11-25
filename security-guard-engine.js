/**
 * SecurityGuardEngine
 * 1. URL Guard: Blocks and strips any unauthorized query parameters or malicious hash payloads
 *    so external links can NEVER alter website structure, API endpoints, auth state, or DOM.
 *    Only whitelisted Keycloak OIDC callback params (`code`, `state`, `session_state`, `iss`)
 *    are permitted temporarily during OIDC handshakes.
 * 2. DOM Integrity Guard: Uses MutationObserver to prevent deleting or hiding the mandatory
 *    #authModal gate while the device is unauthenticated.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SecurityGuardEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const ALLOWED_OIDC_PARAMS = new Set(['code', 'state', 'session_state', 'iss']);
  const ALLOWED_HASH_TABS = new Set([
    '#speaking',
    '#today',
    '#flashcard',
    '#video',
    '#conversation',
    '#review',
    '#profile'
  ]);
  const DANGEROUS_PATTERNS = [
    /javascript:/i,
    /<script/i,
    /onerror=/i,
    /onload=/i,
    /\.\.\//,
    /%2e%2e/i,
    /__proto__/i,
    /constructor/i,
    /prototype/i
  ];

  /**
   * Inspects a URL (search + hash) and returns sanitization instructions.
   * Strips any query parameter outside the Keycloak OIDC callback whitelist,
   * and strips any hash outside safe navigation tabs or containing XSS/traversal payloads.
   */
  function inspectAndSanitizeUrl(urlInfo) {
    const pathname = String(urlInfo?.pathname || '/');
    const rawSearch = String(urlInfo?.search || '');
    const rawHash = String(urlInfo?.hash || '');

    let tampered = false;
    const blockedParams = [];
    const oidcParams = {};

    // Check raw strings for obvious injection/traversal payloads
    const combinedRaw = `${pathname}${rawSearch}${rawHash}`;
    const hasDangerousPayload = DANGEROUS_PATTERNS.some((rx) => rx.test(combinedRaw));
    if (hasDangerousPayload) {
      tampered = true;
    }

    // Parse query params strictly
    const params = new URLSearchParams(rawSearch.startsWith('?') ? rawSearch.slice(1) : rawSearch);
    const hasCodeAndState = params.has('code') && params.has('state');

    for (const [key, value] of params.entries()) {
      const valDangerous = DANGEROUS_PATTERNS.some((rx) => rx.test(key) || rx.test(value));
      if (hasCodeAndState && ALLOWED_OIDC_PARAMS.has(key) && !valDangerous && value.length <= 1024) {
        oidcParams[key] = value;
      } else {
        tampered = true;
        blockedParams.push(key);
      }
    }

    // Validate hash strictly
    let cleanHash = '';
    if (rawHash) {
      const lowerHash = rawHash.trim().toLowerCase();
      if (ALLOWED_HASH_TABS.has(lowerHash) && !hasDangerousPayload) {
        cleanHash = lowerHash;
      } else {
        tampered = true;
      }
    }

    const cleanUrl = pathname + cleanHash;

    return {
      safe: !tampered,
      tampered,
      hasDangerousPayload,
      blockedParams,
      isOidcCallback: hasCodeAndState && !hasDangerousPayload && Boolean(oidcParams.code && oidcParams.state),
      oidcParams,
      cleanUrl
    };
  }

  /**
   * Enforces URL sanitization in the browser immediately using history.replaceState.
   */
  function enforceBrowserUrlGuard() {
    if (typeof window === 'undefined' || !window.location) return null;
    const result = inspectAndSanitizeUrl({
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    });

    if (result.tampered && window.history && typeof window.history.replaceState === 'function') {
      try {
        window.history.replaceState(null, document.title, result.cleanUrl);
      } catch (e) {}
    }
    return result;
  }

  /**
   * Watches #authModal with MutationObserver so unauthenticated users cannot remove or hide it via DevTools.
   */
  function startAuthGateDomGuard(isDeviceAllowedFn, restoreGateFn) {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return null;

    const enforce = () => {
      try {
        if (typeof isDeviceAllowedFn === 'function' && isDeviceAllowedFn()) return;
        const modal = document.getElementById('authModal');
        if (!modal) {
          if (typeof restoreGateFn === 'function') restoreGateFn();
          return;
        }
        if (modal.classList.contains('hidden') || modal.style.display === 'none' || modal.style.visibility === 'hidden' || modal.style.opacity === '0') {
          modal.classList.remove('hidden');
          modal.style.display = 'flex';
          modal.style.visibility = 'visible';
          modal.style.opacity = '1';
        }
      } catch (e) {}
    };

    const observer = new MutationObserver(() => {
      enforce();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden']
    });

    return observer;
  }

  return {
    ALLOWED_OIDC_PARAMS: Array.from(ALLOWED_OIDC_PARAMS),
    inspectAndSanitizeUrl,
    enforceBrowserUrlGuard,
    startAuthGateDomGuard
  };
});
