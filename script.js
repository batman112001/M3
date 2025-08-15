// Set working Google Drive direct download link
const fileId = "1QEzx35N30owKZHmMGGCvlQ4yDN1PahTf";
const directDownloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
document.getElementById("downloadBtn").href = directDownloadLink;
