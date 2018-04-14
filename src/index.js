import { google } from 'googleapis';
import debug from 'debug';
import fs from 'fs';
import path from 'path';
import lib from './lib';

// Setup DEBUG=gDS
const gDSDebug = debug('gDS');

// get config and auth files
const cwd = process.cwd();
gDSDebug('cwd', cwd);

const findFile = (name) => {
  const filePath = path.resolve(cwd, name);
  gDSDebug('filePath', filePath);
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile() ? filePath : name;
};

const config = JSON.parse(fs.readFileSync(findFile('gds-config.json'), 'utf8'));
if (!config || !config.outputRoot || !Array.isArray(config.folders)) {
  console.warn('Config invalid, check "outputRoot" and "folders" array in gds-config.json, exiting');
  process.exit();
}

const auth = JSON.parse(fs.readFileSync(findFile('gds-auth.json'), 'utf8'));
if (!auth.client_email || !auth.client_id) {
  console.warn('Auth invalid, exiting');
  process.exit();
}

gDSDebug(config);
gDSDebug(auth);

process.on('unhandledRejection', (error) => {
  // Will print "unhandledRejection err is not defined"
  gDSDebug('unhandledRejection\n', error.message);
});

// configure a JWT auth client
const jwtClient = new google.auth.JWT(
  auth.client_email,
  null,
  auth.private_key,
  [
    'https://www.googleapis.com/auth/drive',
  ],
);

// configure drive
const drive = google.drive({
  version: 'v3',
  auth: jwtClient,
});

// test auth
jwtClient.authorize((err, tokens) => {
  if (err) {
    gDSDebug(err);
    return;
  }
  gDSDebug(`Successfully connected! \n> access_token: ${tokens.access_token.substr(0, 15)}...`);
});

const createFoldersAndFiles = () => {
  config.folders.forEach(folder => lib.makeDirs(config.outputRoot + folder.localFolder));
  config.folders.forEach(folder => lib.getFolder({ ...folder, outputRoot: config.outputRoot }, drive));
};

createFoldersAndFiles();

export default gDSDebug;
