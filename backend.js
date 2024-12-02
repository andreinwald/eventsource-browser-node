const http = require('node:http');
const url = require('url');

let usersConnected = {};

function handleRequest(request, response) {
    let parsedUrl = url.parse(request.url)
    if (parsedUrl.pathname === '/events') {
        response.statusCode = 200;
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("connection", "keep-alive");
        response.setHeader("Content-Type", "text/event-stream");
        let query = new URLSearchParams(parsedUrl.search);
        let userId = query.get('user_id');
        console.log('Connected user ' + userId);
        usersConnected[userId] = response;
    } else {
        response.statusCode = 404;
        response.end();
    }
}

function sendEvents() {
    if (usersConnected.length === 0) {
        return;
    }
    for (let userId in usersConnected) {
        let response = usersConnected[userId];
        let data = JSON.stringify({date: new Date()});
        response.write(`id: ${(new Date()).toLocaleTimeString()}\ndata: ${data}\n\n`);
    }
}

http.createServer(handleRequest)
    .listen(3000, '127.0.0.1', () => console.log('Listening 127.0.0.1:3000'));

setInterval(sendEvents, 1000);
