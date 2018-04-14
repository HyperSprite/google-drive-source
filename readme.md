# Google Drive Source

Write your articles and store images in google drive and then download them to a specified folder.
I am using this to keep my Gatsby blog up to date by writing Markdown and saving images in Google drive and then syncing that to my blog.

## Install
```npm install --save google-drive-source```

## Configuration

In your package.json file add the following to the "scripts" key

```json
    "gds": "google-drive-source",
    "gds:debug": "DEBUG=gDS google-drive-source"
```

If you have a build script, you could combine them so you download your latest pages just prior to building.

```json
  "build:gds: "npm run gds && npm run build"
```

### Config files

You need to create two files in the root of your project.
gds-auth.json
gds-config.json

**Add these files to your .gitignore now!**

**gds-auth.json is your Google API Service Account Key file.**

Your Service Account Key downloaded from the Google API Dashboard, e.g. (subject to change at Googles whim):

From the [Google API Console](https://console.cloud.google.com/apis)

* Make a new project
  * Credentials tab
   * Create Credentials
   * Service Account Keys
   * Select Service Account "New Service Account"
   * Key Type: JSON
   * Assign local part of email address. You will use this email address to share folders and files. Make this something you will recognize when reviewing your Drive shares later.
   * This only needs "read" access
   * Download.



In your Google drive, create or find a folder with some docs for your blog-posts and share it with the email address from your token above. **This folder should contain all of the same kind of docs.** Make note of the folder id (everything after the "/" in the folders URL).

Repeat for as many folders as you want for source. One option might be if you had multiple team members working independently but contributing to the same project, you could have each manage their own blog post folder and share it with the same email address and add it to the config.folders array.

**gds-config.json is your config file**

Options:

* **Global options:**
 * outputRoot: Required - path from root of project to first level of folders. Minimum entry is "./"
 * folders: Required - an array. At least one folder is required.

* **Folder options:**
 * localFolder: Required - sub-folder of outputRoot. Minimum entry is "/"
 * folderId: Required - Google Drive folder id from folders URL that was shared with the service account email
 * docType: defaults to "md" downloads Google docs as text and adds ".md" file extension, other options are:
  * "csv download the first page of a Google sheet as csv
  * "drawingImg: download Google drawings as png
  * "drawingSvg: download Google drawings as svg
  * "html" download a Google doc as html
  * "media" download images and video
  *  "text" download Google doc as txt
 * defaultSize: number of files to download in folder, defaults to 100


### Usage

At the command line:

`npm run gds` normal mode

`npm run gds:debug` debug mode with extra logging


### Example files

gds-auth.json

```json

{
  "type": "service_account",
  "project_id": "some-crazy-name",
  "private_key_id": "some-uri-blahblahblah",
  "private_key": "-----BEGIN PRIVATE KEY-----\nsomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthingheresomelongthinghere\n-----END PRIVATE KEY-----\n",
  "client_email": "THE_EMAIL_ADDRESS_YOU_SHARE_YOUR_FOLDERS_WITH",
  "client_id": "1234567890987654321",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/blahblahblahblahinhere.iam.gserviceaccount.com"
}

```

gds-config.json
```json
{
  "outputRoot": "./src/pages/",
  "folders": [
    {
      "localFolder": "blog-posts/",
      "folderId": "1XXXXXXXXXXXXXXXXXXXXXXXXXX"
    },
    {
      "localFolder": "blog-posts/images/",
      "folderId": "2XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "docType": "media"
    },
    {
      "localFolder": "blog-posts/text/",
      "folderId": "3XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "docType": "text"
    },
    {
      "localFolder": "blog-posts/html/",
      "folderId": "4XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "docType": "html"
    }
  ]
}
```

### Todo

* Concurrent downloads (right now runs serially on purpose, see note below)
* Check existing files for dates and only download new files.
* Run in watch mode and update files in real time
* Add tests

### Code notes:

#### asyncForEach
Intentionally serially calling each item to keep from overwhelming the google api with too many request which results in empty files and errors. May come back
to this implementation later but at least this is easy to read and understand.

Need to investigate the maximum concurrent connections to the api and work back from there. The folders still run in parallel so if a lot of different folders are added, there may still be some connection issues.

```js
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
  }
};
```
