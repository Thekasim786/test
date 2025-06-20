const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  const ip = ws._socket.remoteAddress;
  console.log(`🔌 Client connected from ${ip}`);

  ws.on('message', message => {
    const code = message.toString().trim();
    const time = new Date().toLocaleTimeString();

    console.log(`📥 [${time}] Code received: ${code}`);

    const payload = JSON.stringify({
      type: 'message',
      message: code
    });

    // Broadcast to all other clients in the correct format
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(payload);
        console.log(`📤 [${time}] Forwarded to client: ${payload}`);
      }
    });
  });

  ws.on('close', () => {
    console.log(`❌ Client disconnected: ${ip}`);
  });
});

app.get('/', (req, res) => {
  res.send('✅ Stake WebSocket server is live.');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});
