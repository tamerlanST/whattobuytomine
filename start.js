var express = require('express');
var proxy = require('http-proxy-middleware');

var app = express();

app.use(function(req, res, next) {
  if (req.method !== 'OPTIONS') {
    next();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '');

  res.end();
});

app.use('/', proxy({
  target: 'https://api.nicehash.com',
  changeOrigin: true,
  onProxyRes: function(proxyRes, req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '');
  }
}));
app.listen(3000);
