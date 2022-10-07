const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');

const app = express();
const PORT = 8000;

require('express-ws')(app);

app.use(cors());

const activeConnections = {};

app.ws("/drawer", (ws, req) => {
    const id = nanoid();

    console.log("Client connected! id = " + id);
    activeConnections[id] = ws;

    ws.on("message", msg => {

    });
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port!`);
});