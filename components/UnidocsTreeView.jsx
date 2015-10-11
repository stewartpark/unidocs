/* jshint esnext: true */

import React from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ListDivider from 'material-ui/lib/lists/list-divider';
import FolderIcon from 'material-ui/lib/svg-icons/file/folder';
import FileIcon from 'material-ui/lib/svg-icons/file/attachment';
import UnidocsFolderListItem from './UnidocsFolderListItem';
import UnidocsFileListItem from './UnidocsFileListItem';
import UnidocsNetworkManager from './UnidocsNetworkManager';
import path from 'path';

export default class UnidocsTreeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {folders: {}, files: {}};
  }

  refresh() {
    UnidocsNetworkManager.getFolder(this.props.path, function(data) {
      this.setState(data);
    }.bind(this),
    function() {
      this.onFileOpen('');
    }.bind(this));
  }

  componentDidMount() {
    this.refresh();
  }

  onFileOpen(name) {
    this.props.onDocumentOpen(path.join(this.props.path, name));
  }

  onFolderOpen(name) {
    var newPath = path.join(this.props.path, name);

    this.props.path = newPath;
    this.props.onChangePath(newPath);
    this.refresh();
  }

  render() {
    var foldersElement = [];
    var filesElement = [];

    for(var i in this.state.folders) {
      foldersElement.push(
        <UnidocsFolderListItem path={this.props.path} name={i} lastModified={this.state.folders[i].lastModified} onOpen={this.onFolderOpen.bind(this)} />
      );
    }

    for(var j in this.state.files) {
      filesElement.push(
        <UnidocsFileListItem path={this.props.path} name={j} lastModified={this.state.files[j].lastModified} onOpen={this.onFileOpen.bind(this)} />
      );
    }

    return (<div>
      <List>
        {foldersElement}
      </List>
      <ListDivider />
      <List>
        {filesElement}
      </List>
    </div>);
  }
}
