# Word Hunter (Kelime Avcısı) - Chrome Extension

A lightweight Chrome Extension designed to streamline language learning by capturing, translating, and archiving vocabulary directly from the browser's context menu.

Currently, this extension only supports English-to-Turkish translation, with plans to add multi-language support in future releases.

### Key Features & Technical Implementation
- **Asynchronous API Integration:** Utilizes Google Translate's API endpoints asynchronously to fetch word definitions and automatically retrieve contextual example sentences.
- **Data Mutation & Cleansing:** Sanitizes raw HTML tags from API responses using Regex and handles multi-stage translation chains for localized example execution.
- **Local State & Storage Management:** Manages persistence leveraging `chrome.storage.local`, prevents duplicate entries dynamically, and assigns secure unique identifiers using `crypto.randomUUID()`.
- **Inline DOM Manipulation:** Implements real-time text-to-input switching (`blur` / `keydown` listeners) for seamless inline editing of stored vocabulary data directly within the popup interface.
- **Data Export & Encoding Opts:** Features a robust CSV exporter that aggregates data structuralized by sources, maintaining encoding integrity via UTF-8 BOM (`\uFEFF`) injection to preserve regional characters.

### How to Install & Use

#### Installation
1. **Download the Project:** Clone this repository or download it as a ZIP file and extract it to a folder on your computer.
2. **Open Extensions Page:** Open Google Chrome and navigate to `chrome://extensions/`.
3. **Enable Developer Mode:** Toggle the **Developer mode** switch in the top-right corner of the page.
4. **Load the Extension:** Click the **Load unpacked** button in the top-left corner, select the project folder (the directory containing the `manifest.json` file), and hit open.

#### Usage
- **Save a Word:** Select any English word on a web page, right-click, and click **"Kelimeyi Kaydet"** from the context menu. The extension will automatically fetch the translation and an example sentence.
- **View Your Vocabulary:** Click on the Word Hunter extension icon in your toolbar to open your personal word list dashboard.
- **Search & Filter:** Use the top search bar to dynamically filter through your saved words, translations, or example sentences.
- **Inline Editing:** Click directly on any word, translation, or example text inside the popup to edit it inline. Press `Enter` or click outside to save changes.
- **Export Data:** Click the **"📥 CSV"** button to download your structuralized word archive with proper UTF-8 character encoding.

### Tech Stack
- **Core:** JavaScript (ES6+, Chrome Extensions API Architecture - Manifest V3)
- **Frontend:** HTML5, CSS3 (Flexbox layout, dynamic state styling)

### Development Methodology (AI-Assisted)
This project was built using an **AI-assisted development (Vibe-Coding)** approach. While AI was leveraged to generate code blocks, the entire project lifecycle—including system architecture design (Manifest V3), API orchestration, debugging edge cases (like UTF-8 BOM encoding for regional characters), and structural code reviews—was strictly managed and engineered by me.
