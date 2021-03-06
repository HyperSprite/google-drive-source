import fs from 'fs';
import path from 'path';
import { mkdir, test } from 'shelljs';
import { isAfter } from 'date-fns';
import kebabCase from 'lodash.kebabcase';
import gDSDebug from './index';

const defaultFields = 'version, properties, id, kind, name, modifiedTime, trashed, fullFileExtension, fileExtension';
const defaultSize = 100;
const lib = {};

// see readme
lib.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
  }
};

lib.folderDefaults = {
  localFolder: '', // does not need to match Google folder name.
  folderId: '',
  folderOpts: '', // e.g. 'and trashed = false'
  pageSize: defaultSize, // how many to download, Google defaults to 100
  fields: defaultFields,
  docType: 'md',
  files: 'export',
  opt: { mimeType: 'text/plain' },
  fileExtension: 'md', // downloading plain text that was already written as Markdown
};

lib.docType = {
  // md is the default
  csv: {
    opt: { mimeType: 'text/csv' },
    fileExtension: 'csv',
  },
  drwaingImg: {
    opt: { mimeType: 'image/png' },
    fileExtension: 'png',
  },
  drawingSvg: {
    opt: { mimeType: 'image/svg+xml' },
    fileExtension: 'svg',
  },
  html: {
    opt: { mimeType: 'text/html' },
    fileExtension: 'html',
  },
  js: {
    fileExtension: 'js',
  },
  json: {
    fileExtension: 'json',
  },
  media: {
    files: 'get',
    opt: { alt: 'media' },
    fileExtension: '', // already part of the file name
  },
  text: {
    fileExtension: 'txt',
  },
};

// make dirs in case they don't exist
lib.makeDirs = (fullPath) => {
  if (!test('-d', fullPath)) {
    mkdir('-p', fullPath);
  }
};

// get file stat
const getLocalFileStat = fileName =>
  new Promise((response) => {
    fs.stat(fileName, (err, fStat) => {
      if (err) response({ mtime: null });
      else if (fStat.size <= 1) response({ mtime: null });
      else response(fStat);
    });
  });

// GET https://www.googleapis.com/drive/v2/files/folderId/children
lib.getFilesFromDrive = (folder, files, drive) => {
  gDSDebug(folder);

  lib.asyncForEach(files, async file => new Promise(async (resolve, reject) => {
    const fName = kebabCase(file.name.split('.')[0]);
    const fExt = file.name.split('.')[1];
    const fileName = path.join(folder.outputRoot, folder.localFolder, `${fName}.${fExt || folder.fileExtension}`);
    gDSDebug(`||| ${fileName}`);
    const localFileStat = await getLocalFileStat(fileName);

    if (isAfter(localFileStat.mtime, file.modifiedTime)) {
      gDSDebug(`||| no change: ${folder.docType} ${fileName}`);
      resolve();
    } else {
      const dest = fs.createWriteStream(fileName);
      try {
        const result = await drive.files[folder.files](
          { fileId: file.id, ...folder.opt },
          { responseType: 'stream' },
        );
        result.data
          .on('end', () => {
            console.log(`>>> downloaded: ${folder.docType} ${fileName}`);
            resolve();
          })
          .on('error', (error) => {
            console.warn(`Error ${folder.docType} downloading > ${fileName}\n`, error);
            reject(error);
          })
          .pipe(dest);
      } catch (error) {
        const mssg = `${error.response.status} ${error.response.statusText}`;
        console.warn(`File Get and Write returned an error: ${mssg}`);
      }
    }
  }));
};

lib.getFolder = async (userFolder, drive) => {
  // Get a list of files from a google folder
  const folder = { ...lib.folderDefaults, ...lib.docType[userFolder.docType], ...userFolder };
  if (!folder.folderId) {
    console.warn('folderId is required, check gds-config.json');
  }
  try {
    const response = await drive.files.list({
      q: `'${folder.folderId}' in parents ${folder.folderOpts}`,
      pageSize: folder.pageSize,
      fields: `nextPageToken, files(${folder.fields})`,
    });
    const { files } = response.data;
    if (files.length === 0) {
      console.warn(`No files found for ${folder.localFolder}:`);
    } else {
      console.log(`${folder.outputRoot}${folder.localFolder}`);
      lib.getFilesFromDrive(folder, files, drive);
    }
  } catch (error) {
    console.warn(`Folder List API returned an error: ${error}`);
  }
};

export default lib;
