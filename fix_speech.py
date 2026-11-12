with open("app.js", "r", encoding="utf-8") as f:
    code = f.read()

old_speech_block = '''function speakText(text, audioUrl) {
  if (!text) return;
  const clean = text.trim().replace(/^[^a-zA-Z\\s'-]+|[^a-zA-Z\\s'-]+$/g, "");
  if (!clean) return;

  // 1. Nếu có audioUrl trực tiếp
  if (audioUrl) {
    try {
      const snd = new Audio(audioUrl);
      snd.play().catch(() => playNativeDictAudio(clean));
      return;
    } catch (e) {}
  }

  // 2. Phát âm bằng Audio Stream chuẩn US từ hệ thống Từ Điển
  playNativeDictAudio(clean);
}

function playNativeDictAudio(word) {
  const firstWord = word.trim().split(/\\s+/)[0] || word;
  const usAudioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(firstWord)}&type=2`;
  const audio = new Audio(usAudioUrl);
  audio.play().catch(() => {
    // 3. Fallback mượt mà sang Web Speech Synthesis
    speakWithSynthesis(word);
  });
}

function speakWithSynthesis(text) {
  if (!("speechSynthesis" in window)) return;
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    const voices = window.speechSynthesis.getVoices() || [];
    const usVoice = voices.find(v => v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("US") || v.name.includes("David") || v.name.includes("Zira")));
    if (usVoice) u.voice = usVoice;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.warn("Speech synthesis error:", e);
  }
}'''

new_speech_block = '''window._activeAudioEl = null;
window._activeUtterance = null;

function cleanSpeechText(rawText) {
  if (!rawText) return "";
  let s = String(rawText).trim();
  // Đọc đầy đủ cả 2 vế nếu có dấu "/" (VD: "huge / enormous")
  s = s.replace(/\\s*\\/\\s*/g, ", ");
  // Mở rộng ký hiệu viết tắt trong cụm từ flashcard
  s = s.replace(/\\(\\s*sb\\s*\\)/gi, "someone")
       .replace(/\\(\\s*sth\\s*\\)/gi, "something")
       .replace(/[()[\\]{}]/g, " ");
  // Chỉ loại bỏ ký tự đặc biệt ở 2 đầu, giữ nguyên toàn bộ từ và cụm từ
  s = s.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9.!?]+$/g, "").replace(/\\s+/g, " ").trim();
  return s;
}

function speakText(text, audioUrl) {
  const clean = cleanSpeechText(text);
  if (!clean) return;

  // Dừng âm thanh cũ trước khi đọc thẻ mới để không bị chồng tiếng hoặc ngắt quãng
  try {
    if (window._activeAudioEl) {
      window._activeAudioEl.pause();
      window._activeAudioEl = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch (e) {}

  // 1. Nếu có audioUrl trực tiếp
  if (audioUrl) {
    try {
      const snd = new Audio(audioUrl);
      window._activeAudioEl = snd;
      snd.play().catch(() => playNativeDictAudio(clean));
      return;
    } catch (e) {}
  }

  // 2. Từ đơn -> Audio chuẩn US từ điển (fallback SpeechSynthesis); Cụm từ / Collocation / Thành ngữ -> Đọc trọn vẹn toàn cụm
  const isSingleWord = !/\\s/.test(clean) && !clean.includes(",");
  if (isSingleWord) {
    playNativeDictAudio(clean);
  } else {
    speakWithSynthesis(clean);
  }
}

function playNativeDictAudio(word) {
  const fullClean = cleanSpeechText(word);
  if (!fullClean) return;

  // Nếu là cụm nhiều từ, luôn dùng Speech Synthesis để đọc hết 100% các từ (không bị cắt mất chữ)
  if (/\\s/.test(fullClean) || fullClean.includes(",")) {
    speakWithSynthesis(fullClean);
    return;
  }

  const usAudioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(fullClean)}&type=2`;
  const audio = new Audio(usAudioUrl);
  window._activeAudioEl = audio;
  audio.onerror = () => speakWithSynthesis(fullClean);
  audio.play().catch(() => {
    speakWithSynthesis(fullClean);
  });
}

function speakWithSynthesis(text) {
  if (!("speechSynthesis" in window)) return;
  const fullClean = cleanSpeechText(text);
  if (!fullClean) return;

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    const u = new SpeechSynthesisUtterance(fullClean);
    u.lang = "en-US";
    const voices = window.speechSynthesis.getVoices() || [];
    const usVoice =
      voices.find(v => v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Natural"))) ||
      voices.find(v => v.lang === "en-US" && (v.name.includes("Samantha") || v.name.includes("David") || v.name.includes("Zira") || v.name.includes("US"))) ||
      voices.find(v => v.lang && v.lang.startsWith("en"));
    if (usVoice) u.voice = usVoice;
    u.rate = 0.88;
    u.pitch = 1.0;

    // Giữ tham chiếu toàn cục để trình duyệt không thu hồi bộ nhớ giữa chừng khi đọc cụm dài
    window._activeUtterance = u;
    u.onend = () => {
      if (window._activeUtterance === u) window._activeUtterance = null;
    };
    u.onerror = () => {
      if (window._activeUtterance === u) window._activeUtterance = null;
    };

    setTimeout(() => {
      window.speechSynthesis.speak(u);
    }, 30);
  } catch (e) {
    console.warn("Speech synthesis error:", e);
  }
}'''

if old_speech_block in code:
    code = code.replace(old_speech_block, new_speech_block, 1)
    with open("app.js", "w", encoding="utf-8") as f:
        f.write(code)
    print("Successfully fixed full-phrase flashcard speech synthesis in app.js!")
else:
    print("Error: old_speech_block not found!")
