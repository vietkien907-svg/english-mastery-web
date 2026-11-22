/**
 * OCR Vocabulary Engine (AI Vision Extractor)
 * - Uses Groq Vision (llama-3.2-11b-vision-preview)
 * - Extracts words, IPA, POS, meanings, and examples from textbook/notes photos
 * - Robust JSON fence parsing and normalization
 * - Seamless batch import into Custom Notebook or Daily Flashcards
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OcrVocabEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const STORAGE_KEY_NOTEBOOK = 'EMH_CUSTOM_NOTEBOOK_V1';
  const STORAGE_KEY_GROQ = 'user_groq_api_key';

  const state = {
    selectedImageBase64: null,
    selectedImageMime: 'image/jpeg',
    extractedWords: [],
    isScanning: false
  };

  /**
   * Parse raw response from Vision LLM into structured array of word objects
   */
  function parseVocabFromVisionResponse(rawText) {
    if (!rawText || typeof rawText !== 'string') return [];

    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/i, '').replace(/\s*```$/i, '').trim();

    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    let jsonArray = null;

    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const candidate = cleaned.substring(firstBracket, lastBracket + 1);
      try {
        jsonArray = JSON.parse(candidate);
      } catch (e) {}
    }

    if (!jsonArray && firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        const obj = JSON.parse(candidate);
        if (Array.isArray(obj.words)) jsonArray = obj.words;
        else if (Array.isArray(obj.vocabulary)) jsonArray = obj.vocabulary;
        else if (Array.isArray(obj.data)) jsonArray = obj.data;
      } catch (e) {}
    }

    if (!Array.isArray(jsonArray)) {
      try {
        const direct = JSON.parse(cleaned);
        if (Array.isArray(direct)) jsonArray = direct;
      } catch (e) {
        return [];
      }
    }

    if (!Array.isArray(jsonArray)) return [];

    return jsonArray.map((item, idx) => {
      const word = String(item.word || item.term || item.english || '').trim();
      if (!word) return null;

      const ipa = String(item.ipa || item.pronunciation || '').trim();
      const pos = String(item.pos || item.type || item.part_of_speech || 'Vocabulary').trim();
      const meaning_vi = String(item.meaning_vi || item.meaning || item.vietnamese || item.definition_vi || '').trim();
      const meaning_en = String(item.meaning_en || item.definition || item.definition_en || '').trim();
      const example = String(item.example || item.sentence || '').trim();
      const example_vi = String(item.example_vi || item.translation || item.example_translation || '').trim();

      return {
        id: 'ocr_' + Date.now() + '_' + idx,
        word,
        ipa: ipa.startsWith('/') ? ipa : (ipa ? `/${ipa}/` : ''),
        pos: pos || 'Vocabulary',
        meaning_vi: meaning_vi || 'Đang cập nhật nghĩa',
        meaning_en: meaning_en || '',
        example: example || '',
        example_vi: example_vi || '',
        selected: true
      };
    }).filter(Boolean);
  }

  /**
   * Call Groq Vision API to scan and extract vocabulary
   */
  async function scanImageWithGroqVision(base64Data, mimeType, customApiKey) {
    const key = customApiKey || (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_GROQ) : '');
    if (!key) {
      throw new Error('Chưa cấu hình Groq API Key! Vui lòng nhập API Key để dùng tính năng nhận diện ảnh AI.');
    }

    const payload = {
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'You are an expert English language teacher and lexicographer. Extract all English vocabulary words, terms, idioms, and phrases from this image. For each, output a JSON array of objects with keys: "word", "ipa", "pos", "meaning_vi", "example", "example_vi". Provide accurate IPA phonetics and clear natural Vietnamese translations. Output ONLY the raw JSON array.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType || 'image/jpeg'};base64,${base64Data}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 2048
    };

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key.trim()}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Lỗi máy chủ Groq (${res.status})`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    return parseVocabFromVisionResponse(text);
  }

  /**
   * Import extracted words into notebook or daily flashcards
   */
  function importExtractedWords(words, options = {}) {
    if (!Array.isArray(words) || words.length === 0) {
      return { success: false, importedCount: 0, duplicatesSkipped: 0 };
    }

    const dest = options.destination || 'notebook';
    let storageKey = STORAGE_KEY_NOTEBOOK;
    let existing = [];

    try {
      existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {
      existing = [];
    }

    const existingWordsSet = new Set(existing.map(w => (w.word || '').toLowerCase()));
    let importedCount = 0;
    let duplicatesSkipped = 0;
    const newItems = [];

    words.forEach(w => {
      const wClean = (w.word || '').toLowerCase();
      if (!wClean) return;

      if (existingWordsSet.has(wClean)) {
        duplicatesSkipped++;
        return;
      }

      newItems.push({
        id: w.id || ('custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
        word: w.word,
        ipa: w.ipa || '',
        pos: w.pos || 'Vocabulary',
        meaning_vi: w.meaning_vi || '',
        meaning_en: w.meaning_en || '',
        example: w.example || '',
        example_vi: w.example_vi || '',
        createdAt: new Date().toISOString()
      });
      existingWordsSet.add(wClean);
      importedCount++;
    });

    const combined = [...newItems, ...existing];

    try {
      localStorage.setItem(storageKey, JSON.stringify(combined));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    return {
      success: true,
      importedCount,
      duplicatesSkipped,
      totalNow: combined.length
    };
  }

  return {
    parseVocabFromVisionResponse,
    scanImageWithGroqVision,
    importExtractedWords,
    state
  };
}));
