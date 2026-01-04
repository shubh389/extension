const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rule-based analysis functions
function analyzeRuleBased(title, text) {
  const analysis = {
    warnings: [],
    positives: [],
    clickbaitScore: 0,
    credibilityFactors: []
  };

  // Clickbait detection
  const clickbaitPatterns = [
    /you won't believe/i,
    /shocking/i,
    /unbelievable/i,
    /amazing/i,
    /number \d+ will/i,
    /doctors hate/i,
    /this one trick/i,
    /what happened next/i,
    /[\!\?]{2,}/,
    /click here/i,
    /^(\d+) (ways|reasons|things)/i
  ];

  let clickbaitMatches = 0;
  clickbaitPatterns.forEach(pattern => {
    if (pattern.test(title)) {
      clickbaitMatches++;
    }
  });

  analysis.clickbaitScore = Math.min((clickbaitMatches / clickbaitPatterns.length) * 100, 100);
  if (analysis.clickbaitScore > 30) {
    analysis.warnings.push('Title contains clickbait patterns');
  }

  // ALL CAPS detection
  const capsWords = title.split(' ').filter(word => 
    word.length > 3 && word === word.toUpperCase()
  );
  if (capsWords.length > 2) {
    analysis.warnings.push('Excessive use of CAPITAL LETTERS in title');
    analysis.clickbaitScore += 15;
  }

  // Sensational words
  const sensationalWords = /breaking|urgent|alert|warning|danger|crisis|bombshell|exclusive/i;
  if (sensationalWords.test(title)) {
    analysis.warnings.push('Contains sensational language');
  }

  // Emotional manipulation
  const emotionalWords = /shocking|outrageous|disgusting|horrifying|terrifying|amazing|incredible/i;
  const emotionalCount = (text.match(emotionalWords) || []).length;
  if (emotionalCount > 5) {
    analysis.warnings.push('High use of emotional/manipulative language');
  }

  // Fact-checking indicators (positive)
  const factCheckWords = /according to|research shows|study finds|data indicates|statistics show|expert says|source:|reported by/i;
  const factCheckCount = (text.match(factCheckWords) || []).length;
  if (factCheckCount >= 3) {
    analysis.positives.push('Contains citations and sources');
    analysis.credibilityFactors.push(10);
  }

  // Balanced language (positive)
  const balancedWords = /however|although|while|despite|on the other hand|alternatively/i;
  if (balancedWords.test(text)) {
    analysis.positives.push('Shows balanced perspective');
    analysis.credibilityFactors.push(5);
  }

  // Question marks in title (clickbait)
  if ((title.match(/\?/g) || []).length >= 2) {
    analysis.warnings.push('Multiple questions in title (clickbait indicator)');
    analysis.clickbaitScore += 10;
  }

  // Content length (positive if substantial)
  if (text.length > 1000) {
    analysis.positives.push('Substantial content length');
    analysis.credibilityFactors.push(5);
  } else if (text.length < 300) {
    analysis.warnings.push('Very short article (low effort content)');
  }

  return analysis;
}

// Simulated AI Analysis (Replace with actual OpenAI API call)
async function analyzeWithAI(title, text) {
  // This is where you'd call OpenAI API
  // For now, returning simulated response
  
  // To use real OpenAI:
  /*
  const { Configuration, OpenAIApi } = require('openai');
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
  const prompt = `Analyze this news article for credibility. Title: "${title}"\n\nContent: ${text.substring(0, 1500)}\n\nProvide:
1. Credibility assessment (0-100)
2. Key concerns
3. Brief explanation`;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a fact-checking expert analyzing news credibility." },
      { role: "user", content: prompt }
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  return completion.data.choices[0].message.content;
  */

  // Simulated AI response for demo
  return {
    aiCredibilityScore: Math.floor(Math.random() * 40) + 40, // 40-80
    aiExplanation: "The article shows moderate credibility. While it presents information clearly, it lacks strong source citations and contains some emotionally charged language. The writing style suggests professional journalism, but independent verification of claims is recommended.",
    aiConcerns: [
      "Limited source attribution",
      "Some emotional language detected",
      "Claims require independent verification"
    ]
  };
}

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { title, text, url } = req.body;

    if (!title || !text) {
      return res.status(400).json({ error: 'Title and text are required' });
    }

    console.log(`Analyzing: ${title.substring(0, 50)}...`);

    // Rule-based analysis
    const ruleBasedResults = analyzeRuleBased(title, text);

    // AI analysis (simulated or real)
    const aiResults = await analyzeWithAI(title, text);

    // Hybrid score calculation
    const ruleBasedScore = Math.max(
      0,
      70 - ruleBasedResults.warnings.length * 10 + 
      ruleBasedResults.credibilityFactors.reduce((a, b) => a + b, 0)
    );

    const finalScore = Math.round(
      (ruleBasedScore * 0.4) + (aiResults.aiCredibilityScore * 0.6)
    );

    const response = {
      credibilityScore: Math.min(Math.max(finalScore, 0), 100),
      clickbaitProbability: Math.round(Math.min(ruleBasedResults.clickbaitScore, 100)),
      warnings: ruleBasedResults.warnings,
      positives: ruleBasedResults.positives,
      aiExplanation: aiResults.aiExplanation,
      summary: `This content received a ${finalScore}% credibility score using hybrid analysis (rule-based + AI). ${
        finalScore >= 70 ? 'The content appears credible with proper sourcing.' : 
        finalScore >= 40 ? 'The content shows mixed signals - verify claims independently.' :
        'The content shows multiple warning signs - approach with caution.'
      }`,
      analyzedUrl: url,
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Fake News Detector API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Hybrid Analysis: Rule-based + AI`);
  console.log(`✅ Ready to analyze news content`);
});
