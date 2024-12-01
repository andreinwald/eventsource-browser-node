const http = require('node:http');
const url = require('url');

http.createServer(
    (request, response) => {
        let parsedUrl = url.parse(request.url)
        if (parsedUrl.pathname === '/events') {
            response.statusCode = 200;
            eventsRoute(request, response, parsedUrl);
        } else {
            response.statusCode = 404;
            response.end();
        }
    }).listen(3000, '127.0.0.1', () => console.log('Listening 127.0.0.1:3000'));

function eventsRoute(request, response, parsedUrl) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("connection", "keep-alive");
    response.setHeader("Content-Type", "text/event-stream");

    let query = new URLSearchParams(parsedUrl.search);
    console.log('Connected user ' + query.get('user_id'));

    setInterval(() => {
        const data = JSON.stringify({date: new Date()});
        response.write(`id: ${(new Date()).toLocaleTimeString()}\ndata: ${data}\n\n`);
    }, 1000);
}
