document.addEventListener('DOMContentLoaded', async function() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const apiUrlInput = document.getElementById('apiUrl');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const error = document.getElementById('error');

  // Load saved API URL
  const settings = await chrome.storage.local.get(['apiUrl']);
  apiUrlInput.value = settings.apiUrl || 'http://localhost:3000';

  // Save settings
  saveSettingsBtn.addEventListener('click', async () => {
    const apiUrl = apiUrlInput.value.trim();
    await chrome.storage.local.set({ apiUrl });
    showError('Settings saved!', false);
  });

  // Analyze button click
  analyzeBtn.addEventListener('click', async () => {
    try {
      hideAll();
      loading.classList.remove('hidden');

      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Inject content script and get page content
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: extractPageContent
      });

      const pageData = result.result;

      if (!pageData.text || pageData.text.length < 50) {
        throw new Error('Not enough content to analyze. Please visit a news article page.');
      }

      // Get API URL
      const settings = await chrome.storage.local.get(['apiUrl']);
      const apiUrl = settings.apiUrl || 'http://localhost:3000';

      // Send to backend for AI analysis
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pageData.title,
          text: pageData.text,
          url: tab.url
        })
      });

      if (!response.ok) {
        throw new Error('Backend API not available. Please start the backend server.');
      }

      const analysisResult = await response.json();

      // Display results
      displayResults(analysisResult);

    } catch (err) {
      showError(err.message);
    }
  });
});

// Extract page content (runs in page context)
function extractPageContent() {
  const title = document.title;
  
  // Get main content
  const article = document.querySelector('article') || document.querySelector('main') || document.body;
  
  // Remove script, style, nav, footer, etc.
  const clone = article.cloneNode(true);
  const unwanted = clone.querySelectorAll('script, style, nav, footer, iframe, .ad, .advertisement');
  unwanted.forEach(el => el.remove());
  
  const text = clone.innerText || clone.textContent;
  
  return {
    title: title,
    text: text.trim().substring(0, 3000), // Limit to 3000 chars
    url: window.location.href
  };
}

function displayResults(data) {
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  
  loading.classList.add('hidden');
  results.classList.remove('hidden');

  // Score
  const scoreValue = document.getElementById('scoreValue');
  const scoreLabel = document.getElementById('scoreLabel');
  scoreValue.textContent = data.credibilityScore;
  
  if (data.credibilityScore >= 70) {
    scoreLabel.textContent = '✅ Highly Credible';
    scoreLabel.className = 'score-label high';
  } else if (data.credibilityScore >= 40) {
    scoreLabel.textContent = '⚠️ Moderately Credible';
    scoreLabel.className = 'score-label medium';
  } else {
    scoreLabel.textContent = '❌ Low Credibility';
    scoreLabel.className = 'score-label low';
  }

  // Clickbait
  const clickbaitBar = document.getElementById('clickbaitBar');
  const clickbaitText = document.getElementById('clickbaitText');
  clickbaitBar.style.width = data.clickbaitProbability + '%';
  clickbaitText.textContent = `${data.clickbaitProbability}% - ${data.clickbaitProbability > 70 ? 'High' : data.clickbaitProbability > 40 ? 'Medium' : 'Low'}`;

  // Warning signs
  const warningsList = document.getElementById('warningsList');
  warningsList.innerHTML = '';
  if (data.warnings && data.warnings.length > 0) {
    data.warnings.forEach(warning => {
      const li = document.createElement('li');
      li.textContent = warning;
      warningsList.appendChild(li);
    });
  } else {
    warningsList.innerHTML = '<li>No major warning signs detected</li>';
  }

  // Positive indicators
  const positivesList = document.getElementById('positivesList');
  positivesList.innerHTML = '';
  if (data.positives && data.positives.length > 0) {
    data.positives.forEach(positive => {
      const li = document.createElement('li');
      li.textContent = positive;
      positivesList.appendChild(li);
    });
  } else {
    positivesList.innerHTML = '<li>No strong positive indicators found</li>';
  }

  // AI Explanation
  const aiExplanation = document.getElementById('aiExplanation');
  aiExplanation.textContent = data.aiExplanation || 'AI analysis completed successfully.';

  // Summary
  const summary = document.getElementById('summary');
  summary.textContent = data.summary || 'Content analyzed using hybrid AI + rule-based system.';
}

function showError(message, isError = true) {
  const errorDiv = document.getElementById('error');
  const errorMessage = document.getElementById('errorMessage');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');

  loading.classList.add('hidden');
  results.classList.add('hidden');
  
  errorDiv.classList.remove('hidden');
  errorDiv.style.background = isError ? '#ffebee' : '#e8f5e9';
  errorDiv.style.color = isError ? '#c62828' : '#2e7d32';
  errorMessage.textContent = message;

  if (!isError) {
    setTimeout(() => {
      errorDiv.classList.add('hidden');
    }, 2000);
  }
}

function hideAll() {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('results').classList.add('hidden');
  document.getElementById('error').classList.add('hidden');
}
