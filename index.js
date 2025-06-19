const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('🔌 Client connected');
  ws.on('close', () => console.log('❌ Client disconnected'));
});

app.get('/', (req, res) => {
  res.send('Stake WebSocket server running.');
});

function sendCode(code) {
  console.log(`📤 Broadcasting code: ${code}`);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(code);
    }
  });
}

// Start server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on port ${PORT}`);
});

// ✅ TEMP TEST: Broadcast a code every 10 seconds
setInterval(() => {
  sendCode('TESTCODE123');
}, 10000);
