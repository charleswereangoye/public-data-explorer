// lb.js
const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
const servers = ['http://localhost:3000', 'http://localhost:3001'];
let idx = 0;

http.createServer((req, res) => {
    const target = servers[idx];
    idx = (idx + 1) % servers.length;
    console.log('Forwarding to', target);
    proxy.web(req, res, { target });
}).listen(4000, () => console.log('LB running on 4000'));
