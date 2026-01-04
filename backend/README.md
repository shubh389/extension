# AI Fake News Detector - Backend API

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create .env file

```bash
copy .env.example .env
```

### 3. Run the Server

```bash
npm start
```

Or with auto-reload for development:

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## 🔑 Adding Real AI (Optional)

Currently using **simulated AI responses** for demo purposes.

To use **real OpenAI GPT**:

1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env` file:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Uncomment the OpenAI code in `server.js` (lines marked with comments)
4. Install OpenAI package:
   ```bash
   npm install openai
   ```

## 📡 API Endpoints

### POST /api/analyze

Analyzes news content for credibility

**Request:**

```json
{
  "title": "Article title",
  "text": "Article content...",
  "url": "https://example.com/article"
}
```

**Response:**

```json
{
  "credibilityScore": 75,
  "clickbaitProbability": 20,
  "warnings": ["Warning 1", "Warning 2"],
  "positives": ["Positive 1", "Positive 2"],
  "aiExplanation": "AI analysis explanation...",
  "summary": "Overall summary..."
}
```

### GET /health

Health check endpoint

## 🧠 How It Works

**Hybrid Analysis System:**

1. **Rule-Based Detection** (40% weight)

   - Clickbait patterns
   - Sensational language
   - Source citations
   - Content quality indicators

2. **AI Analysis** (60% weight)

   - Semantic understanding
   - Context evaluation
   - Credibility assessment

3. **Final Score** = Combined weighted analysis

## 🛡️ Security

- API runs locally (no cloud needed for basic version)
- OpenAI key stored in .env (never in frontend)
- CORS enabled for extension communication
