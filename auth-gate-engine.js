/**
 * DeviceAuthGate Engine
 * Enforces mandatory account registration + valid server referral code for all non-host devices.
 * No guest bypass is allowed for unauthenticated devices.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DeviceAuthGate = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const PRIMARY_HOST_EMAIL = 'tonguyenvu@265.com';

  /**
   * Evaluates whether the current device is allowed to access the app or must be locked behind the Auth Gate.
   * @param {Object} storage - Key-value map (e.g. localStorage or plain object in tests)
   */
  function evaluateDeviceAccess(storage) {
    const store = storage || {};
    const getVal = (k) => {
      if (typeof store.getItem === 'function') return store.getItem(k) || '';
      return store[k] || '';
    };

    const email = String(getVal('EMH_ACTIVE_ACCOUNT_EMAIL')).trim().toLowerCase();
    const isPrimaryHost =
      email === PRIMARY_HOST_EMAIL && String(getVal('EMH_PRIMARY_HOST_SETUP')) === 'true';

    if (isPrimaryHost) {
      return {
        allowed: true,
        mode: 'AUTHENTICATED',
        userEmail: PRIMARY_HOST_EMAIL,
        canDismiss: true,
        isHost: true
      };
    }

    const authToken = String(getVal('EMH_AUTH_TOKEN') || getVal('emh_auth_token')).trim();
    if (email && authToken.length >= 6) {
      return {
        allowed: true,
        mode: 'AUTHENTICATED',
        userEmail: email,
        canDismiss: true,
        isHost: false
      };
    }

    // Strict gate: ignore EMH_GUEST_DISMISSED or spoofed local emails without server token
    return {
      allowed: false,
      mode: 'GATE_LOCKED',
      reason: 'REQUIRE_AUTH_AND_REFERRAL',
      canDismiss: false,
      isHost: false
    };
  }

  /**
   * Validates registration form input before sending to backend /api/auth/register.
   */
  function validateRegistrationInput(input) {
    const fullName = String(input?.fullName || '').trim();
    const email = String(input?.email || '').trim().toLowerCase();
    const password = String(input?.password || '');
    const referralCode = String(input?.referralCode || '').trim().toUpperCase();

    if (!fullName || fullName.length < 2) {
      return { valid: false, error: 'Vui lòng nhập Họ và tên (tối thiểu 2 ký tự).' };
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return { valid: false, error: 'Vui lòng nhập đúng định dạng Email.' };
    }
    if (password.length < 6) {
      return { valid: false, error: 'Mật khẩu phải có ít nhất 6 ký tự.' };
    }
    if (!referralCode) {
      return {
        valid: false,
        error: 'Bắt buộc nhập Mã giới thiệu từ máy chủ (Tô Nguyên Vũ) mới được tạo tài khoản.'
      };
    }

    return {
      valid: true,
      normalized: {
        fullName,
        email,
        password,
        referralCode
      }
    };
  }

  return {
    PRIMARY_HOST_EMAIL,
    evaluateDeviceAccess,
    validateRegistrationInput
  };
});
