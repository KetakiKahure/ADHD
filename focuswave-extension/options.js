document.addEventListener("DOMContentLoaded", () => {
  const userIdInput = document.getElementById("userId");
  const blocklistArea = document.getElementById("blocklist");
  const saveBtn = document.getElementById("save");
  const status = document.getElementById("status");

  // Load saved settings
  chrome.storage.sync.get(["userId", "blocklist"], (res) => {
    if (res.userId) userIdInput.value = res.userId;
    if (res.blocklist) blocklistArea.value = res.blocklist.join("\n");
  });

  // Save settings
  saveBtn.addEventListener("click", () => {
    const userId = userIdInput.value || "anonymous";
    const blocklist = blocklistArea.value.split("\n").map(s => s.trim()).filter(Boolean);

    chrome.storage.sync.set({ userId, blocklist }, () => {
      status.textContent = "✅ Saved!";
      setTimeout(() => status.textContent = "", 2000);
    });
  });
});
