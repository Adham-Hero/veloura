// Entry point for running the API as a normal, always-on Node process
// (local development, Render, a VPS, etc). Vercel does NOT use this file -
// it uses api/index.js instead, since Vercel runs the app as serverless functions.
const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Veloura backend running on http://localhost:${PORT}`);
});
