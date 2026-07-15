# Cortexa - AI Assistant for Students

Cortexa is a multi-modal AI chatbot built to help students with their daily academic tasks. It combines conversational AI, document understanding, voice input, and image generation into a single tool.

## Features

- **AI Chat** — Powered by Google's Gemini API, with full conversation memory for natural, context-aware discussions
- **Document Q&A** — Upload a PDF (notes, assignments, research papers) and ask questions directly about its content
- **Voice Input** — Speak your questions instead of typing, using the browser's built-in speech recognition
- **Image Generation** — Generate images from text prompts using Stable Diffusion / FLUX models via Hugging Face

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **AI:** Google Gemini API (chat), Hugging Face Inference API (image generation)
- **PDF Processing:** unpdf
- **Voice:** Web Speech API (browser-native)

## Getting Started

1. Clone the repository
2. Install dependencies
3. Create a `.env.local` file in the root directory and add your API keys:
GEMINI_API_KEY=your_gemini_api_key
HF_API_TOKEN=your_huggingface_token
4. Run the development server

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Why I Built This

As a student, I wanted a single AI tool that could handle multiple everyday needs — chatting, summarizing documents, taking voice input, and generating visuals — all without cost, using free-tier APIs and serverless-friendly architecture.

## Author

**Adan Mudassar**
AI Automation Engineer | Applied AI Developer