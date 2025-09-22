console.log("FocusWave started (with Options Page)");

const backendUrl = "http://localhost:5000/log";

let userId = "anonymous";
let blocklist = [];

// Load settings on startup
chrome.storage.sync.get(["userId", "blocklist"], (res) => {
  userId = res.userId || "anonymous";
  blocklist = res.blocklist || ["instagram.com", "youtube.com", "facebook.com"];
  updateRules();
});

// Listen for changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    if (changes.userId) userId = changes.userId.newValue;
    if (changes.blocklist) {
      blocklist = changes.blocklist.newValue;
      updateRules();
    }
  }
});

// Function to update blocking rules dynamically
function updateRules() {
  const rules = blocklist.map((site, i) => ({
    id: i + 1,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: `*${site}*`, resourceTypes: ["main_frame"] }

  }));

  chrome.declarativeNetRequest.updateDynamicRules(
    { removeRuleIds: rules.map(r => r.id), addRules: rules },
    () => console.log("Updated blocklist:", blocklist)
  );
}

// Log blocked attempts
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  console.log("Blocked site:", info.request.url);

  fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      site: new URL(info.request.url).hostname,
      url: info.request.url,
      timestamp: new Date().toISOString()
    })
  }).catch(err => console.error("Failed to log:", err));
});
