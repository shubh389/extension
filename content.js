// Content script - runs on every webpage
// Currently minimal, but can be extended for auto-detection

console.log('AI Fake News Detector content script loaded');

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    const content = extractContent();
    sendResponse(content);
  }
  return true;
});

function extractContent() {
  const title = document.title;
  const article = document.querySelector('article') || document.querySelector('main') || document.body;
  
  const clone = article.cloneNode(true);
  const unwanted = clone.querySelectorAll('script, style, nav, footer, iframe, .ad, .advertisement');
  unwanted.forEach(el => el.remove());
  
  const text = clone.innerText || clone.textContent;
  
  return {
    title: title,
    text: text.trim(),
    url: window.location.href
  };
}
