# LearnMate-AI

LearnMate-AI is a web-based educational application that generates study notes, key points, summaries, and quizzes on any topic using AI — powered by Google's Gemini API.

## Features

- 🌙 Light/Dark theme (saved across sessions)
- 📝 Topic + difficulty-based note generation
- ⚡ Real-time AI integration (Gemini API)
- 💀 Loading skeleton states
- ⚠️ Graceful error handling
- 📱 Fully responsive design

## Setup Instructions

This project uses the Gemini API, which requires a **free** API key (no credit card needed, takes under 2 minutes).

1. Clone this repository:
git clone https://github.com/S-NithinAaronSmile/LearnMate-AI.git

2. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) — sign in with Google, click "Create API Key," and copy it.

3. In the project folder, rename `config.example.js` to `config.js`.

4. Open `config.js` and paste your key:
```js
   const GEMINI_API_KEY = "your_key_here";
```

5. Open `index.html` using a local server (e.g., VS Code's "Live Server" extension).

## Note on API Limits

This project uses the Gemini **free tier**, which has request-rate limits. If you see a "Too many requests" error, please wait 30–60 seconds and try again.

## Tech Stack

- HTML5, CSS3 (custom properties, Flexbox, media queries)
- Vanilla JavaScript (Fetch API, async/await, Local Storage)
- Google Gemini API