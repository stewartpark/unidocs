/* jslint esnext: true */
global.__SERVER__ = false;

import React from 'react';
import UnidocsApp from '../components/UnidocsApp';
import ReactTapEventPlugin from 'react-tap-event-plugin';
ReactTapEventPlugin();

import jQuery from 'jquery';

// Extend jQuery to support PUT/DELETE.
function _ajax_request(url, data, callback, type, method) {
    if (jQuery.isFunction(data)) {
        callback = data;
        data = {};
    }
    return jQuery.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        dataType: type
        });
}

jQuery.extend({
    put: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'PUT');
    },
    delete_: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'DELETE');
    }
});

// Render the app.
React.render(<UnidocsApp initialPath={location.pathname} />, document.getElementById('content'));
