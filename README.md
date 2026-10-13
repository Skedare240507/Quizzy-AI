# Quizzy AI 🧠

Turn your notes into quizzes and flashcards in seconds. Paste text or upload a PDF, DOCX or TXT file, pick how many questions you want, and Quizzy AI generates a study set using Llama 3.3 on Groq.

## Features

- **Two study modes:** multiple-choice quizzes (4 options per question) and flashcards
- **Flexible input:** paste notes directly or drag and drop a `.pdf`, `.docx` or `.txt` file
- **Custom size:** choose how many questions or cards to generate
- **Instant results:** score summary after each quiz
- **Session history:** every quiz and flashcard set is saved and reopenable from the sidebar
- **Profile and contact form:** edit your profile and send support messages by email
- **Light and dark theme**

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Actions), React 19, TypeScript
- **UI:** Tailwind CSS 4, shadcn/ui, Radix UI, Framer Motion, Lucide icons
- **AI:** Groq SDK with `llama-3.3-70b-versatile`
- **File parsing:** `pdf-parse` for PDFs, `mammoth` for DOCX
- **Email:** Nodemailer
- **Storage:** local JSON file (`data/db.json`)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A free [Groq API key](https://console.groq.com/keys)

### Installation

```bash
git clone https://github.com/Skedare240507/Quizzy-AI.git
cd Quizzy-AI
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and add your key:

```env
GROQ_API_KEY=your_groq_api_key_here

# Optional: only needed for the contact form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email
SMTP_PASS=your_app_password
CONTACT_EMAIL=where_messages_should_arrive
```

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. You paste notes or upload a file, and the text is extracted on the server.
2. The text (up to 30,000 characters) is sent to Groq with a prompt asking for strict JSON.
3. The response is parsed and saved to local history.
4. You're redirected to the quiz or flashcard page.

## Project Structure

```
app/          pages (home, quiz, flashcard, results) and server actions
components/   UI components (Sidebar, Flashcard, QuizQuestion, ScoreCircle...)
lib/          AI generation (ai.ts) and local database (db.ts)
data/         db.json for profile and history
```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run the TypeScript check |

## Limitations

- PDFs must contain selectable text. Scanned images aren't supported.
- History is stored in a local JSON file, so it won't persist on serverless hosts like Vercel. A hosted database would be needed for that.

## Author

**Sahil Kedare**
[GitHub](https://github.com/Skedare240507)
