// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const wordListElement = document.getElementById('wordList');
  const clearButton = document.getElementById('clearButton');
  const exportButton = document.getElementById('exportBtn');
  const searchBox = document.getElementById('searchBox');

  let allSavedWords = [];

  // --- 1. Listeyi Ekrana Çizme ---
  function renderWords(wordsArray) {
    wordListElement.innerHTML = '';
    const isSearching = searchBox.value.trim() !== '';

    if (wordsArray.length === 0) {
      const message = isSearching ? 'Kelime bulunamadı.' : 'Henüz kelime kaydetmediniz.';
      wordListElement.innerHTML = `<li class="empty-message">${message}</li>`;
      return;
    }

    wordsArray.forEach(wordObj => {
      const li = document.createElement('li');
      li.dataset.id = wordObj.id;

      const wordContent = document.createElement('div');
      wordContent.className = 'word-content';

      // A. Kelime
      const wordLine = document.createElement('div');
      wordLine.className = 'word-line';
      const wordText = document.createElement('span');
      wordText.className = 'word-text';
      wordText.textContent = wordObj.text;
      const copyWordBtn = createCopyButton();
      wordLine.appendChild(wordText);
      wordLine.appendChild(copyWordBtn);

      // B. Çeviri
      const transLine = document.createElement('div');
      transLine.className = 'word-line';
      const wordTranslation = document.createElement('span');
      wordTranslation.className = 'word-translation';
      wordTranslation.textContent = wordObj.translation;
      const copyTransBtn = createCopyButton();
      transLine.appendChild(wordTranslation);
      transLine.appendChild(copyTransBtn);

      // C. Örnek Cümleler (EN/TR)
      const exampleBox = document.createElement('div');
      exampleBox.className = 'example-box';
      
      const exContent = document.createElement('div');
      exContent.style.flexGrow = '1';

      // İngilizce
      const enLine = document.createElement('div');
      enLine.className = 'example-line';
      const exEn = document.createElement('span');
      exEn.className = 'word-example';
      exEn.textContent = wordObj.example ? wordObj.example : "Örnek cümle yok";
      if (!wordObj.example) exEn.classList.add('placeholder');
      enLine.appendChild(exEn);
      if (wordObj.example) enLine.appendChild(createCopyButton());
      exContent.appendChild(enLine);

      // Türkçe
      if (wordObj.example) {
        const trLine = document.createElement('div');
        trLine.className = 'example-line tr-line';
        const exTr = document.createElement('span');
        exTr.className = 'word-example-tr';
        exTr.textContent = wordObj.example_tr ? wordObj.example_tr : "(Çevirisi yok)";
        trLine.appendChild(exTr);
        if (wordObj.example_tr) trLine.appendChild(createCopyButton());
        exContent.appendChild(trLine);
      }
      exampleBox.appendChild(exContent);

      // D. Tarih ve Kaynak (Arayüzde görünür, CSV'de yok)
      const wordMeta = document.createElement('span');
      wordMeta.className = 'word-meta';
      const dateStr = new Date(wordObj.timestamp).toLocaleString('tr-TR');
      wordMeta.textContent = `${dateStr} - ${wordObj.source}`;

      wordContent.append(wordLine, transLine, exampleBox, wordMeta);

      // E. Silme Butonu
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-btn';
      deleteButton.innerHTML = '🗑️'; 
      deleteButton.title = 'Sil';

      li.append(wordContent, deleteButton);
      wordListElement.appendChild(li);
    });
  }

  function createCopyButton() {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = '📋';
    return btn;
  }

  // --- 2. CSV İndirme Fonksiyonu ---
  function exportToCSV() {
    if (allSavedWords.length === 0) {
      alert("Dışa aktarılacak kelime yok.");
      return;
    }

    const sortedWords = [...allSavedWords].sort((a, b) => {
      const sourceA = (a.source || "").toLowerCase();
      const sourceB = (b.source || "").toLowerCase();
      if (sourceA < sourceB) return -1;
      if (sourceA > sourceB) return 1;
      return 0;
    });

    let csvContent = "\uFEFF"; 

    sortedWords.forEach(word => {
      const escapeCsv = (text) => {
        if (!text) return '""';
        return `"${text.replace(/"/g, '""')}"`; 
      };

      const row = [
        escapeCsv(word.text),
        escapeCsv(word.translation),
        escapeCsv(word.example),
        escapeCsv(word.example_tr)
      ];
      
      csvContent += row.join(";") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const todayStr = new Date().toISOString().slice(0,10);
    link.setAttribute("download", `kelime_listem_export_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- 3. Veri Yönetimi ve Arama ---
  function runSearch(term) {
    term = term.toLowerCase().trim();
    if (!term) {
      renderWords(allSavedWords);
      return;
    }
    const filtered = allSavedWords.filter(w => 
      w.text.toLowerCase().includes(term) || 
      w.translation.toLowerCase().includes(term) ||
      (w.example && w.example.toLowerCase().includes(term)) ||
      (w.example_tr && w.example_tr.toLowerCase().includes(term))
    );
    renderWords(filtered);
  }

  function loadWords() {
    chrome.storage.local.get({ savedWords: [] }, (result) => {
      // Hafızadaki düz sırayı popup gösterimi için ters çeviriyoruz
      allSavedWords = result.savedWords.slice().reverse();
      runSearch(searchBox.value);
    });
  }

  // --- Event Listeners ---
  searchBox.addEventListener('input', (e) => runSearch(e.target.value));
  exportButton.addEventListener('click', exportToCSV);

  clearButton.addEventListener('click', () => {
    if(confirm("Tüm liste silinecek. Emin misiniz?")) {
      chrome.storage.local.set({ savedWords: [] }, () => {
        allSavedWords = [];
        renderWords([]);
      });
    }
  });

  // Tıklama olayları
  wordListElement.addEventListener('click', (e) => {
    const el = e.target.closest('button') || e.target; 
    const li = el.closest('li');
    if (!li) return;
    const id = li.dataset.id;

    if (el.closest('.delete-btn')) {
      chrome.storage.local.get({savedWords:[]}, res => {
        // Silme işleminde id eşleşmesine göre filtrele ve düz sırada kaydet
        const newWords = res.savedWords.filter(w => w.id !== id);
        chrome.storage.local.set({savedWords: newWords}, () => {
          allSavedWords = allSavedWords.filter(w => w.id !== id);
          runSearch(searchBox.value);
        });
      });
    }
    else if (el.classList.contains('copy-btn')) {
      const parent = el.parentElement;
      // Nokta atışı class'lar aranarak kopyalama doğruluğu sağlandı
      const span = parent.querySelector('.word-text, .word-translation, .word-example, .word-example-tr'); 
      if (span) {
        navigator.clipboard.writeText(span.textContent).then(() => {
          const old = el.innerHTML;
          el.innerHTML = '✅';
          setTimeout(()=> el.innerHTML = old, 1000);
        });
      }
    }
    else if (el.classList.contains('word-text') || el.classList.contains('word-translation') || 
             el.classList.contains('word-example') || el.classList.contains('word-example-tr')) {
      if(document.querySelector('.edit-input')) return;
      
      let field = 'text';
      if(el.classList.contains('word-translation')) field = 'translation';
      if(el.classList.contains('word-example')) field = 'example';
      if(el.classList.contains('word-example-tr')) field = 'example_tr';

      const input = document.createElement('input');
      input.className = 'edit-input';
      input.value = el.classList.contains('placeholder') ? "" : el.textContent;
      
      el.style.display = 'none';
      el.parentNode.insertBefore(input, el);
      input.focus();

      const save = () => {
        const val = input.value.trim();
        const idx = allSavedWords.findIndex(w => w.id === id);
        if(idx > -1) {
          allSavedWords[idx][field] = val;
          // Hafızadaki güncel listeyi (allSavedWords) tekrar tersine çevirerek (reverse) orijinal sıralamasında storage'a yazıyoruz
          const originalOrderWords = allSavedWords.slice().reverse();
          chrome.storage.local.set({savedWords: originalOrderWords}, () => {
            runSearch(searchBox.value);
          });
        }
      };
      input.addEventListener('blur', save);
      input.addEventListener('keydown', k => { if(k.key === 'Enter') input.blur(); });
    }
  });

  loadWords();
});
