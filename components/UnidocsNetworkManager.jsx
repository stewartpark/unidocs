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

  static getFile(_path, cb, fail) {
    var absPath = path.join('/', _path);
    $.get('/api/v1/files', {
      path: absPath
    }, cb).fail(fail);
  }

  static putFile(_path, content, cb, fail) {
    var absPath = path.join('/', _path);
    $.put('/api/v1/files', {
      path: absPath,
      content: content
    }, cb).fail(fail);
  }
}
