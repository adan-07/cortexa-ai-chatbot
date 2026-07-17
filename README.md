<div align="center">

# 🧠 Cortexa

### AI-Powered Assistant for Students

Cortexa combines conversational AI, document understanding, voice input, and image generation into one seamless tool — built to make student life easier.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)
![Gemini API](https://img.shields.io/badge/Gemini-API-4285F4?style=flat-square&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 **AI Chat** | Natural, context-aware conversations powered by Google's Gemini API with full memory |
| 📄 **Document Q&A** | Upload a PDF (notes, assignments, research papers) and ask questions about its content |
| 🎙️ **Voice Input** | Speak instead of type, using the browser's native speech recognition |
| 🎨 **Image Generation** | Generate images from text prompts using Stable Diffusion / FLUX via Hugging Face |

---

## 🛠️ Tech Stack

**Frontend**
`Next.js` · `React` · `Tailwind CSS`

**Backend**
`Next.js API Routes`

**AI & ML**
`Google Gemini API` (chat) · `Hugging Face Inference API` (image generation)

**Utilities**
`unpdf` (PDF text extraction) · `Web Speech API` (voice, browser-native)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/adan-07/cortexa-ai-chatbot.git
cd cortexa-ai-chatbot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key
HF_API_TOKEN=your_huggingface_token
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Open the app
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📌 Roadmap

- [x] Core AI chat with memory
- [x] PDF upload & document Q&A
- [x] Voice input
- [x] Image generation
- [ ] Text-to-speech replies
- [ ] Multi-language support (Urdu)
- [ ] Chat history persistence

---

## 💡 Why I Built This

As a student, I wanted a single AI tool that could handle multiple everyday needs — chatting, summarizing documents, taking voice input, and generating visuals — all without cost, using free-tier APIs and a serverless-friendly architecture.

---

## 👤 Author

**Adan Mudassar**
AI Automation Engineer · Applied AI Developer

[LinkedIn](#) · [GitHub](https://github.com/adan-07)

---

<div align="center">
<sub>Built with ❤️ for students, by a student.</sub>
</div>