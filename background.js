// background.js

// API'den veri çeken ana fonksiyon
async function getTranslationData(text, sourceLang = 'en', targetLang = 'tr') {
  try {
    // 1. ADIM: Kelime Çevirisi ve Örnek Cümle İsteği (dt=t ve dt=ex)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&dt=ex&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    let result = {
      translation: "Çeviri yok",
      example: "",
      example_tr: ""
    };

    // Kelime Çevirisini Al (Genelde index 0)
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      result.translation = data[0][0][0];
    }

    // Örnek Cümleyi Al (Genelde index 13'te durur)
    if (data && data[13] && data[13][0] && data[13][0][0] && data[13][0][0][0]) {
      // HTML taglerini temizle (Google bazen <b> tagi ekler)
      result.example = data[13][0][0][0].replace(/<\/?[^>]+(>|$)/g, ""); 
    }

    // 2. ADIM: Eğer örnek cümle bulunduysa, onun çevirisini al
    if (result.example) {
      try {
        const exUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(result.example)}`;
        const exRes = await fetch(exUrl);
        const exData = await exRes.json();
        
        if (exData && exData[0] && exData[0][0] && exData[0][0][0]) {
          result.example_tr = exData[0][0][0];
        }
      } catch (exErr) {
        console.error("Örnek cümle çevrilemedi:", exErr);
      }
    }

    return result;

  } catch (error) {
    console.error("Bağlantı hatası:", error);
    return { translation: "Hata oluştu", example: "", example_tr: "" };
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveWord",
    title: "Kelimeyi Kaydet", 
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "saveWord") {
    const selectedText = info.selectionText.trim();
    const sourceTitle = tab.title || "Bilinmeyen Kaynak"; 
    
    if (selectedText) {
      // Verileri çek
      const data = await getTranslationData(selectedText);

      chrome.storage.local.get({ savedWords: [] }, (result) => {
        let words = result.savedWords;
        
        // Aynı kelime var mı kontrol et
        const isDuplicate = words.some(wordObj => wordObj.text.toLowerCase() === selectedText.toLowerCase());
        
        if (!isDuplicate) {
          const newWord = {
            id: crypto.randomUUID(),
            text: selectedText,
            translation: data.translation,
            example: data.example,       // Otomatik gelen İngilizce örnek
            example_tr: data.example_tr, // Otomatik gelen Türkçe çeviri
            timestamp: new Date().toISOString(),
            source: sourceTitle
          };
          
          words.push(newWord);
          chrome.storage.local.set({ savedWords: words }, () => {
            console.log(`Kaydedildi: ${selectedText}`);
          });
        }
      });
    }
  }
});