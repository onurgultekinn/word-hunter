# Word Hunter (Kelime Avcısı) - Chrome Extension

A lightweight Chrome Extension designed to streamline language learning by capturing, translating, and archiving vocabulary directly from the browser's context menu[cite: 2].

### Key Features & Technical Implementation
- **Asynchronous API Integration:** Utilizes Google Translate's API endpoints asynchronously to fetch word definitions and automatically retrieve contextual example sentences[cite: 2].
- **Data Mutation & Cleansing:** Sanitizes raw HTML tags from API responses using Regex and handles multi-stage translation chains for localized example execution[cite: 2].
- **Local State & Storage Management:** Manages persistence leveraging `chrome.storage.local`, prevents duplicate entries dynamically, and assigns secure unique identifiers using `crypto.randomUUID()`[cite: 2].
- **Inline DOM Manipulation:** Implements real-time text-to-input switching (`blur` / `keydown` listeners) for seamless inline editing of stored vocabulary data directly within the popup interface[cite: 2].
- **Data Export & Encoding Opts:** Features a robust CSV exporter that aggregates data structuralized by sources, maintaining encoding integrity via UTF-8 BOM (`\uFEFF`) injection to preserve regional characters[cite: 2].

### Tech Stack
- **Core:** JavaScript (ES6+, Chrome Extensions API Architecture - Manifest V3)[cite: 2]
- **Frontend:** HTML5, CSS3 (Flexbox layout, dynamic state styling)[cite: 2]

### 🤖 Development Methodology (AI-Assisted)
This project was built using an **AI-assisted development (Vibe-Coding)** approach. While AI was leveraged to generate code blocks, the entire project lifecycle—including system architecture design (Manifest V3), API orchestration, debugging edge cases (like UTF-8 BOM encoding for regional characters), and structural code reviews—was strictly managed and engineered by me[cite: 2].
