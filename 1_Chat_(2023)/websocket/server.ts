import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const port = 1234;
const server = createServer();
const wss = new WebSocketServer({ noServer: true });

interface TextMessage {
  type: 'text';
  nick: string;
  message: string;
}

interface ImageMessage {
  type: 'image';
  nick: string;
  data: string;
}

const messages: (TextMessage | ImageMessage)[] = [];

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(messages));
  ws.on('message', (data) => {
    try {
      const parsedData: TextMessage | ImageMessage = JSON.parse(data.toString());
      messages.push(parsedData);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messages));
        }
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(port, () => {
  console.log(`Сервер запущен на порте ${port}`);
});
