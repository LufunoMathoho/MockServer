const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const { ensureDataFileExists, readLibrary, writeLibrary } = require('./fileHandler');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (chunk) => {
    buffer += decoder.write(chunk);
  });

  req.on('end', async () => {
    buffer += decoder.end();
    res.setHeader('Content-Type', 'application/json');

    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const query = parsedUrl.query;

    // 📄 Serve API documentation at "/"
    if (req.method === 'GET' && parsedUrl.pathname === '/') {
      const docPath = path.join(__dirname, 'api-doc.html');
      fs.readFile(docPath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Error loading API documentation');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(data);
      });
      return;
    }

    const validPaths = ['movies', 'series', 'songs'];
    if (!validPaths.includes(pathName)) {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: 'Not Found' }));
    }

    let library;
    try {
      library = await readLibrary();
    } catch (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ error: 'Failed to read data' }));
    }

    try {
      if (req.method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify(library[pathName], null, 2));
      }

      if (req.method === 'POST') {
        const newItem = JSON.parse(buffer);
        library[pathName].push(newItem);
        await writeLibrary(library);
        res.writeHead(201);
        return res.end(JSON.stringify(library[pathName], null, 2));
      }

      if (req.method === 'DELETE') {
        const { title } = query;
        if (!title) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: 'Missing title in query' }));
        }

        const originalLength = library[pathName].length;
        library[pathName] = library[pathName].filter(item => item.title !== title);

        if (library[pathName].length === originalLength) {
          res.writeHead(404);
          return res.end(JSON.stringify({ error: 'Item not found' }));
        }

        await writeLibrary(library);
        res.writeHead(200);
        return res.end(JSON.stringify(library[pathName], null, 2));
      }

      if (req.method === 'PUT') {
        const updatedItem = JSON.parse(buffer);
        const { title } = updatedItem;

        if (!title) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: 'Missing title in data' }));
        }

        let found = false;
        library[pathName] = library[pathName].map(item => {
          if (item.title === title) {
            found = true;
            return { ...item, ...updatedItem };
          }
          return item;
        });

        if (!found) {
          res.writeHead(404);
          return res.end(JSON.stringify({ error: 'Item not found' }));
        }

        await writeLibrary(library);
        res.writeHead(200);
        return res.end(JSON.stringify(library[pathName], null, 2));
      }

      res.writeHead(405);
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Server Error', details: err.message }));
    }
  });
});

ensureDataFileExists().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
