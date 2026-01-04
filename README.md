# 🎯 AI-Powered Fake News Detector Chrome Extension

**Hybrid AI + Rule-based System** for credibility analysis

## ✨ Features

✅ AI credibility analysis (headline + content)  
✅ Confidence score + detailed explanation  
✅ Rule-based + AI hybrid (best practice)  
✅ Real fact-check style output  
✅ Clickbait detection  
✅ Warning signs & positive indicators  

## 🚀 Installation

### Step 1: Install Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select this folder: `c:\Users\subha\OneDrive\Desktop\Extension\fake`
5. Extension icon will appear in toolbar! 🎉

### Step 2: Start Backend API

```bash
cd backend
npm install
npm start
```

Backend will run on `http://localhost:3000`

### Step 3: Configure Extension

1. Click extension icon
2. Enter API URL: `http://localhost:3000`
3. Click "Save Settings"

## 🎮 How to Use

1. Visit any news website or article
2. Click the extension icon
3. Click **"Analyze Current Page"**
4. Get instant credibility analysis!

## 🧠 How It Works

### Frontend (Chrome Extension)
- Extracts webpage content
- Sends to backend API
- Displays beautiful analysis results

### Backend (Node.js API)
1. **Rule-Based Analysis** (40% weight)
   - Clickbait patterns detection
   - Sensational language check
   - Source citations verification
   - Content quality metrics

2. **AI Analysis** (60% weight)
   - Semantic understanding
   - Context evaluation
   - Credibility scoring

3. **Hybrid Score** = Combined analysis

## 📁 Project Structure

```
fake/
├── manifest.json       # Extension config
├── popup.html          # UI interface
├── popup.css           # Styling
├── popup.js            # Frontend logic
├── content.js          # Page content extraction
├── background.js       # Background tasks
└── backend/
    ├── server.js       # API server
    ├── package.json    # Dependencies
    └── .env.example    # Config template
```

## 🔑 Optional: Real AI Integration

Currently uses **simulated AI** for demo. To use **real OpenAI GPT**:

1. Get API key: https://platform.openai.com/api-keys
2. Create `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Uncomment OpenAI code in `backend/server.js`
4. Install: `npm install openai`

## 🎨 What Makes This Special

🔥 **Interview-Ready Features:**
- Hybrid AI + rule-based system (industry best practice)
- Secure API design (no exposed keys)
- Real-world credibility metrics
- Professional UI/UX
- Scalable architecture

## 🛠️ Tech Stack

**Frontend:**
- Chrome Extension Manifest V3
- Vanilla JavaScript
- Modern CSS (gradients, animations)

**Backend:**
- Node.js + Express
- RESTful API
- Optional: OpenAI GPT integration

## 📊 Analysis Output

- **Credibility Score** (0-100%)
- **Clickbait Probability**
- **Warning Signs** (red flags)
- **Positive Indicators** (trust signals)
- **AI Explanation** (detailed reasoning)
- **Summary** (final verdict)

## 🔒 Security

✅ Backend API (no frontend key exposure)  
✅ CORS protection  
✅ Environment variables for secrets  
✅ Localhost-first approach  

## 🎓 Perfect For

- Portfolio projects
- Job interviews
- Learning AI integration
- Understanding hybrid systems
- Chrome extension development

---

**Made with 💜 - Hybrid AI + Rule-based Detection System**
