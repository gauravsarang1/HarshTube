import dotenv from 'dotenv'
import connectDB from "./src/db/index.js";
import { app } from './src/app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config({path: '.env'})

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});

connectDB()
.then( () => {
    httpServer.listen(process.env.PORT || 5050, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    })
    app.get('/test', (req, res) =>{
        res.send('Hello')
    })
})
.catch( err => {
    console.log('Mongodb connection failed', err)
})