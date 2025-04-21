const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const mediaLibrary = require('./data');

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    // Handle GET request for /movies, /series, /songs
    if (req.method === 'GET') {
      switch (path) {
        case '/movies':
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.movies, null, 2));
          break;

        case '/series':
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.series, null, 2));
          break;

        case '/songs':
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.songs, null, 2));
          break;

        default:
          res.writeHead(404);
          res.end('404 - Not Found');
      }
    }

    // Handle POST request to add an item
    else if (req.method === 'POST') {
      switch (path) {
        case '/movies':
          const newMovie = JSON.parse(buffer);
          mediaLibrary.movies.push(newMovie);
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.movies, null, 2));
          break;

        case '/series':
          const newSeries = JSON.parse(buffer);
          mediaLibrary.series.push(newSeries);
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.series, null, 2));
          break;

        case '/songs':
          const newSong = JSON.parse(buffer);
          mediaLibrary.songs.push(newSong);
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.songs, null, 2));
          break;

        default:
          res.writeHead(404);
          res.end('404 - Not Found');
      }
    }

    // Handle DELETE request to remove an item
    else if (req.method === 'DELETE') {
      const query = parsedUrl.query;
      const title = query.title;

      if (!title) {
        res.writeHead(400);
        res.end('Missing title in query');
        return;
      }

      switch (path) {
        case '/movies':
          mediaLibrary.movies = mediaLibrary.movies.filter(movie => movie.title !== title);
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.movies, null, 2));
          break;

        case '/series':
          mediaLibrary.series = mediaLibrary.series.filter(serie => serie.title !== title);
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.series, null, 2));
          break;

        case '/songs':
          mediaLibrary.songs = mediaLibrary.songs.filter(song => song.title !== title);
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.songs, null, 2));
          break;

        default:
          res.writeHead(404);
          res.end('404 - Not Found');
      }
    }

    // Handle PUT request to update an item
    else if (req.method === 'PUT') {
      const updatedItem = JSON.parse(buffer);
      const title = updatedItem.title;

      if (!title) {
        res.writeHead(400);
        res.end('Missing title in data');
        return;
      }

      switch (path) {
        case '/movies':
          mediaLibrary.movies = mediaLibrary.movies.map(movie =>
            movie.title === title ? { ...movie, ...updatedItem } : movie
          );
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.movies, null, 2));
          break;

        case '/series':
          mediaLibrary.series = mediaLibrary.series.map(serie =>
            serie.title === title ? { ...serie, ...updatedItem } : serie
          );
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.series, null, 2));
          break;

        case '/songs':
          mediaLibrary.songs = mediaLibrary.songs.map(song =>
            song.title === title ? { ...song, ...updatedItem } : song
          );
          res.writeHead(200);
          res.end(JSON.stringify(mediaLibrary.songs, null, 2));
          break;

        default:
          res.writeHead(404);
          res.end('404 - Not Found');
      }
    }

    // Return 404 for any unsupported routes or methods
    else {
      res.writeHead(404);
      res.end('404 - Not Found');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
