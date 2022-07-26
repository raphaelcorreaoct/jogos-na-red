import express, { Request, Response } from 'express';
import { createServer } from 'http';
import * as SocketIO from 'socket.io';

const app = express();
const server = createServer(app);
const io = new SocketIO.Server(server);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket: any) => {
  socket.on('join-message', (roomId: string) => {
    socket.join(roomId);
    console.log('User joined in a room : ' + roomId);
  });

  socket.on('screen-data', function (data: string) {
    console.log(data);
    const newData = JSON.parse(data);
    const room = newData.room;
    const imgStr = newData.image;
    socket.broadcast.to(room).emit('screen-data', imgStr);
  });
});

const serverPort = process.env.YOUR_PORT || 3001;

server.listen(serverPort, () => {
  console.log('Estou ligado...');
});
