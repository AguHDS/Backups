import { Server } from 'socket.io';

/* export function initializeSocket(server) {
    const io = new Server(server, { connectionStateRecovery: {} });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
        });
    });

    return io;
} */