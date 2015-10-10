/* jshint esnext: true */

import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ListDivider from 'material-ui/lib/lists/list-divider';
import FolderIcon from 'material-ui/lib/svg-icons/file/folder';
import FileIcon from 'material-ui/lib/svg-icons/file/attachment';

export default class UnidocsFileListItem extends React.Component {
  onTouchTap() {
    this.props.onOpen(this.props.name);
  }

  render() {
    return (
      <ListItem leftIcon={<FileIcon />} primaryText={this.props.name} secondaryText={this.props.lastModified} onTouchTap={this.onTouchTap.bind(this)} />
    );
  }
}
