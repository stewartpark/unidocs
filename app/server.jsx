/* jshint esnext: true */

import http from 'http';
import express from 'express';
import React from 'react';
import UnidocsApp from '../components/UnidocsApp';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';

global.__SERVER__ = true;

const app = express();
const port = process.env.PORT || 3000;
const config = {
  documentPath: '/tmp/docs'
};

/**
  @endpoint GET /api/v1/folders
  @description Return the list of files in a folder.
  @param path
*/
app.get('/api/v1/folders', function(req, res){
  var relPath = path.join('/', req.query.path || '/');
  var absPath = path.join(config.documentPath, relPath);
  fs.readdir(absPath, function(err, list) {
    if(err) {
      res.status(404).end("Folder not found");
      return;
    }

    var folders = {'..': {}};
    var files = {};
    for(var i in list) {
      var filePath = path.resolve(absPath, list[i]);
      var stat = fs.statSync(filePath);

      if(fs.lstatSync(filePath).isDirectory()) {
        folders[list[i]] = {
          lastModified: stat.mtime
        };
      } else {
        files[list[i]] = {
          lastModified: stat.mtime
        };
      }
    }

    res.status(200).json({
      folders: folders,
      files: files
    });
  });
});

/**
  @endpoint POST /api/v1/folders
  @description Create a new folder under the specified path.
  @param path
  @param name
*/
app.post('/api/v1/folders', function(req, res) {

});

/**
  @endpoint DELETE /api/v1/files
  @description Delete a folder
  @param path
*/
app.delete('/api/v1/folders', function(req, res) {

});

/**
  @endpoint GET /api/v1/files
  @description Return the content of a file.
  @param path
*/
app.get('/api/v1/files', function(req, res) {
  var relPath = path.join('/', req.query.path || '/');
  var absPath = path.join(config.documentPath, relPath);

  fs.readFile(absPath, 'utf-8', function(err, data) {
    if(err) {
      res.status(404).end('File not found');
      return;
    }

    res.status(200).end(data);
  });
});

/**
  @endpoint POST /api/v1/files
  @description Create a new file under the specified path.
  @param path
  @param name
*/
app.post('/api/v1/files', function(req, res) {

});

/**
  @endpoint PUT /api/v1/files
  @description Modify the content of a file.
  @param path
  @param content
*/
app.put('/api/v1/files', function(req, res) {

});

/**
  @endpoint DELETE /api/v1/files
  @description Delete a file
  @param path
*/
app.delete('/api/v1/files', function(req, res) {

});

/**
  @endpoint POST /api/v1/actions/rename
  @description Rename a folder/file
  @param old_path
  @param new_path
*/
app.post('/api/v1/actions/rename', function(req, res) {

});

/**
  @endpoint POST /api/v1/actions/export
  @description Export a folder/file
  @param path
*/
app.post('/api/v1/actions/export', function(req, res) {

});

/**
  @endpoint GET /client.js
  @description Send the client side runtime.
*/
app.get('/client.js', function(req, res) {
  res.sendFile("/client.js", {
    root: './dist'
  });
});

/**
  @endpoint GET *
  @description Render the view of the application to the client.
*/
app.get('*', function(req, res) {
  var reactHtml = React.renderToString(<UnidocsApp initialPath={req.url} />);
  var head = "<html><head><title>Unidocs</title></head><body style=\"margin: 0\"><div id=\"content\">";
  var tail = "</div><script src=\"/client.js\" type=\"text/javascript\"></script></body></html>";
  res.end(head + reactHtml + tail);
});

app.listen(port, 'localhost', function(err) {
  // Create the document root if it doesn't exist.
  mkdirp(config.documentPath);

  console.info('==> 🌎 Listening on http://127.0.0.1:%s/', port);
});
