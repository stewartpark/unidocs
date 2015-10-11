/* jshint esnext: true */

import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import React from 'react';

import mysql from 'mysql';
import path from 'path';
import fs from 'fs.extra';

import UnidocsApp from '../components/UnidocsApp';
import { types } from '../components/UnidocsCellView';

global.__SERVER__ = true;

const app = express();
const port = process.env.PORT || 3000;
const config = {
  documentPath: process.env.DOCUMENT_ROOT || '/tmp/docs',
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD
  }
};
var mysql_conn = mysql.createPool({
  connectionLimit: 10,
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.username,
  password: config.mysql.password
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Endpoints

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
  if(!req.body.path || !req.body.name) {
    res.status(500).end("`path` and `name` are required.");
    return;
  }

  var relPath = path.join('/', req.body.path, req.body.name);
  var absPath = path.join(config.documentPath, relPath);

  fs.mkdirp(absPath, function(err) {
    if(err) {
      res.status(500).end();
      return;
    }

    res.status(200).end();
  });
});

/**
  @endpoint DELETE /api/v1/folders
  @description Delete a folder
  @param path
*/
app.delete('/api/v1/folders', function(req, res) {
  var relPath = path.join('/', req.body.path || '/');
  var absPath = path.join(config.documentPath, relPath);
  fs.rmrf(absPath, function(err) {
    if(err) {
      res.status(500).end();
      return;
    }

    res.status(200).end();
  });
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
  if(!req.body.path || !req.body.name) {
    res.status(500).end("`path` and `name` are required.");
    return;
  }

  var relPath = path.join('/', req.body.path, req.body.name);
  var absPath = path.join(config.documentPath, relPath);
  var content = JSON.stringify({
    metadata: {},
    cells: [
      {'type': types[0].text, 'body': 'A new document!'}
    ]
  });
  
  fs.writeFile(absPath, content, function(err) {
    if(err) {
      res.status(500).end();
      return;
    }

    res.status(200).end();
  });
});

/**
  @endpoint PUT /api/v1/files
  @description Modify the content of a file.
  @param path
  @param content
*/
app.put('/api/v1/files', function(req, res) {
  var relPath = path.join('/', req.body.path || '/');
  var absPath = path.join(config.documentPath, relPath);
  var content = req.body.content;
  if(content) {
    fs.writeFile(absPath, content, function(err) {
      if(err) {
        res.status(500).end();
        return;
      }

      res.status(200).end();
    });
  } else {
    res.status(500).end("`content` is empty.");
  }
});

/**
  @endpoint DELETE /api/v1/files
  @description Delete a file
  @param path
*/
app.delete('/api/v1/files', function(req, res) {
  var relPath = path.join('/', req.body.path || '/');
  var absPath = path.join(config.documentPath, relPath);
  fs.rmrf(absPath, function(err) {
    if(err) {
      res.status(500).end();
      return;
    }

    res.status(200).end();
  });
});

/**
  @endpoint POST /api/v1/actions/run/sql
  @description Export a folder/file
  @param path
*/
app.post('/api/v1/actions/run/sql', function(req, res) {
  var query = req.body.query;
  var database = req.body.database;

  if(query && database) {
    mysql_conn.getConnection(function(err, conn){
      if(err) {
        res.status(500).json(err);
        return;
      }

      conn.query("USE " + mysql.escapeId(database), function(err) {
        if(err) {
          res.status(500).json(err);
          return;
        }

        conn.query({
          sql: query,
          timeout: 60000
        }, function(err, results, fields) {
          if(err) {
            res.status(500).json(err);
            return;
          }

          res.status(200).json({
            rows: results,
            fields: fields
          });
          conn.release();
        });
      });
    });
  } else {
    res.status(500).end("`query` and `database` are required.");
  }
});

/**
  @endpoint POST /api/v1/actions/rename
  @description Rename a folder/file
  @param old_path
  @param new_path
*/
app.post('/api/v1/actions/rename', function(req, res) {
  //TODO
});

/**
  @endpoint POST /api/v1/actions/export
  @description Export a folder/file
  @param path
*/
app.post('/api/v1/actions/export', function(req, res) {
  //TODO
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
  var reactHtml = React.renderToString(<UnidocsApp initialPath={unescape(req.url)} />);
  var head = "<html><head><title>Unidocs</title><link href='https://fonts.googleapis.com/css?family=Roboto:100' rel='stylesheet' type='text/css'></head><body style=\"margin: 0; font-face: Roboto;\"><div id=\"content\">";
  var tail = "</div><script src=\"/client.js\" type=\"text/javascript\"></script></body></html>";
  res.end(head + reactHtml + tail);
});

app.listen(port, '0.0.0.0', function(err) {
  // Create the document root if it doesn't exist.
  fs.mkdirp(config.documentPath);

  console.info('==> 🌎 Listening on http://0.0.0.0:%s/', port);
});
