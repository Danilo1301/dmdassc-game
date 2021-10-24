import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';

const isDevelopment = (process.env.NODE_ENV || "development").trim() === 'development';
const port = 3000;

const io: socketio.Server = new socketio.Server();

console.log("server.ts | (ignoring)isDevelopment=", isDevelopment);

const app: express.Application = express();
const server: http.Server = http.createServer(app);


io.attach(server, {
    //path: '/socket',
    cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, "dist")));

server.listen(port, () => console.log(`Express web server started: http://localhost:${port}`));



const sockets = new Map<string, socketio.Socket>();

import puppeteer from 'puppeteer';

async function setupGame() {
    console.log("launching...");

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('http://localhost:3000#server');

    page.on('console', message => {
        console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`);
    });

    console.log("At page");

    await page.exposeFunction('sendClientData', (id, data) => {
        //console.log(`[Server] sendClientData: ${id}, ${data}`);

        const socket = sockets.get(id);

        if(!socket) {
            console.log(`[Server] Socket ${id} not found`);
            return;
        }

        socket.emit('_data', data);
    });

    /*
    await page.evaluate(() => {
        window['sendClientPacket']('id', 'detail');
    })
    */

    io.of("/game").on("connection", async (socket) => {
        const id = socket.id;

        sockets.set(id, socket);

        await page.evaluate((id) => { window['onSocketConnect'](id); }, id)

        socket.on('disconnect', async (reason) => {
            await page.evaluate((id, reason) => { window['onSocketDisconnect'](id, reason); }, id, reason)
        })

        socket.on('_data', async (data) => {
            const str = typeof data == 'string' ? data : JSON.stringify(data);
            await page.evaluate((id, data) => { window['onReceiveSocketData'](id, data); }, id, str)
        })
    });
}

setupGame();


//.on('pageerror', ({ message }) => console.log(message))
//.on('response', response => console.log(`${response.status()} ${response.url()}`))
//.on('requestfailed', request => console.log(`${request.failure().errorText} ${request.url()}`))


