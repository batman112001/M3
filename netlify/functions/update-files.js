const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, url } = JSON.parse(event.body);
  if (!name || !url) {
    return { statusCode: 400, body: 'Missing name or url' };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // secret in Netlify
  const REPO_OWNER = "batman112001"; // your GitHub username
  const REPO_NAME = "M3";            // repo name
  const FILE_PATH = "files.json";    // file to update

  try {
    // 1. Get the existing files.json from GitHub
    const getRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" }
    });

    const fileData = await getRes.json();
    const sha = fileData.sha;
    const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));

    // 2. Add new entry
    content[name] = url;

    // 3. Push updated files.json back to GitHub
    const updateRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
      body: JSON.stringify({
        message: `Add ${name}`,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
        sha: sha
      })
    });

    return { statusCode: 200, body: JSON.stringify(await updateRes.json()) };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};

