const app = require('./index');

const PORT = process.env.API_PORT || 3002;

app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`║   Musharaka API Service              ║`);
  console.log(`║   http://localhost:${PORT}              ║`);
  console.log(`╚══════════════════════════════════════╝\n`);
});
