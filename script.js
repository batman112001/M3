const downloadBtn = document.getElementById("downloadBtn");
const uploadBtn = document.getElementById("uploadBtn");
const fileUrlInput = document.getElementById("file-url");

// start with download disabled
downloadBtn.removeAttribute("href");
downloadBtn.style.pointerEvents = "none";
downloadBtn.style.opacity = "0.6";

// Handle upload button click
uploadBtn.addEventListener("click", () => {
  const url = fileUrlInput.value.trim();
  if (!url) {
    alert("Please paste a link first!");
    return;
  }

  try {
    new URL(url); // validate URL
    downloadBtn.href = url;
    downloadBtn.style.pointerEvents = "auto";
    downloadBtn.style.opacity = "1";
    alert("Link uploaded successfully! Now click Download.");
  } catch {
    alert("Invalid URL. Please enter a valid link.");
  }
});
