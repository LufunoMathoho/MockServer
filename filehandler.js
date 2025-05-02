const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'mediaLibrary.json');

const defaultLibrary = {
  movies: [],
  series: [],
  songs: []
};

async function ensureDataFileExists() {
  try {
    if (!fsSync.existsSync(dataPath)) {
      await fs.mkdir(path.dirname(dataPath), { recursive: true });
      await fs.writeFile(dataPath, JSON.stringify(defaultLibrary, null, 2), 'utf-8');
      console.log('Created mediaLibrary.json with default structure.');
    } else {
      console.log('mediaLibrary.json already exists.');
    }
  } catch (err) {
    console.error('Error initializing media library file:', err);
  }
}

async function readLibrary() {
  const data = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(data);
}

async function writeLibrary(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  ensureDataFileExists,
  readLibrary,
  writeLibrary
};
