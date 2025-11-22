// In generateImage function:
const res = await fetch('/api/generate', {  // Internal route
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt }),
});
