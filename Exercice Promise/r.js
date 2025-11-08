const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = '';

  if (req.url === '/' || req.url === '/home') {
    filePath = path.join(__dirname, 'home.html');
  } else if (req.url === '/about') {
    filePath = path.join(__dirname, 'about.html');
  } else if (req.url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      firstName: 'Amal',
      lastName: 'Ourdou'
    }));
    return;
  } else {
    filePath = path.join(__dirname, '404.html');
  }

  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
