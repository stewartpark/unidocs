/* jshint esnext: true */

import $ from 'jquery';
import path from 'path';

export default class UnidocsNetworkManager {
  static getFolder(_path, cb, fail) {
    var absPath = path.join('/', _path);
    $.get('/api/v1/folders', {
      path: absPath
    }, cb).fail(fail);
  }

  static postFolder(_path, _name, cb, fail) {
    var absPath = path.join('/', _path);
    $.post('/api/v1/folders', {
      path: absPath,
      name: _name
    }, cb).fail(fail);
  }

  static getFile(_path, cb, fail) {
    var absPath = path.join('/', _path);
    $.get('/api/v1/files', {
      path: absPath
    }, cb).fail(fail);
  }

  static postFile(_path, _name, cb, fail) {
    var absPath = path.join('/', _path);
    $.post('/api/v1/files', {
      path: absPath,
      name: _name
    }, cb).fail(fail);
  }

  static putFile(_path, content, cb, fail) {
    var absPath = path.join('/', _path);
    $.put('/api/v1/files', {
      path: absPath,
      content: content
    }, cb).fail(fail);
  }

  static actionRunSQL(db_name, sql, cb, fail) {
    $.post('/api/v1/actions/run/sql', {
      query: $.trim(sql),
      database: $.trim(db_name)
    }, cb).fail(fail);
  }
}
