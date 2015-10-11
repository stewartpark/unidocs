/* jshint esnext: true */

import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ListDivider from 'material-ui/lib/lists/list-divider';
import FolderIcon from 'material-ui/lib/svg-icons/file/folder';
import FileIcon from 'material-ui/lib/svg-icons/file/attachment';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';

import moment from 'moment';
import path from 'path';
import UnidocsNetworkManager from './UnidocsNetworkManager';

export default class UnidocsFolderListItem extends React.Component {
  onTouchTap() {
    this.props.onOpen(this.props.name);
  }

  onDelete() {
    this.refs.deleteFolderDialog.show();
  }

  onDeleteOk () {
    UnidocsNetworkManager.deleteFolder(path.join(this.props.path, this.props.name), function() {
      location.reload();
    }.bind(this), function(){
      alert('Error occured!');
    }.bind(this));
    this.refs.deleteFolderDialog.dismiss();
  }

  canonicalize(name) {
    if(name === '..') {
      return '(Up)';
    }
    return name;
  }

  formatDate(d) {
    if(d) {
      var nd = new Date(d);
      return moment(nd).calendar();
    } else {
      return "";
    }
  }

  render() {
    return (<div>
      <Dialog title="Delete folder" actions={[
        { text: 'Cancel' },
        { text: 'Delete', onTouchTap: this.onDeleteOk.bind(this), ref: 'delete' }
      ]} ref="deleteFolderDialog">
        Are you sure?
      </Dialog>
      <ListItem
        leftIcon={<FolderIcon />}
        primaryText={this.canonicalize(this.props.name)}
        secondaryText={this.formatDate(this.props.lastModified)}
        rightIconButton={this.props.name == '..' ? undefined : (<IconButton tooltip="Delete this folder" tooltipPosition="bottom-left" onTouchTap={this.onDelete.bind(this)}>
          <DeleteIcon />
        </IconButton>)}
        onTouchTap={this.onTouchTap.bind(this)} />
    </div>);
  }
}
