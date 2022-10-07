const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');

const app = express();
const PORT = 8000;

require('express-ws')(app);

app.use(cors());

const activeConnections = {};
let pixels = [];

app.ws("/drawer", ws => {
    const id = nanoid();

    console.log("Client connected! id = " + id);
    activeConnections[id] = ws;

    ws.on("message", msg => {
        const decodedMessage = JSON.parse(msg);

        switch (decodedMessage.type) {
            case "GET_ALL_PIXELS":
                ws.send(JSON.stringify({type: "ALL_PIXELS", pixels}));
                break;
            case "CREATE_PIXELS":
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];

                    pixels = pixels.concat(decodedMessage.newPixels)

                    conn.send(JSON.stringify({
                        type: "NEW_PIXEL",
                        newPixels: decodedMessage.newPixels
                    }));
                });
                break;
            default:
                console.log("Unknown message type: ", decodedMessage.type);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port!`);
});