/* jshint esnext: true */

import React from 'react';
import Markdown from 'react-remarkable';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ListDivider from 'material-ui/lib/lists/list-divider';
import FolderIcon from 'material-ui/lib/svg-icons/file/folder';
import FileIcon from 'material-ui/lib/svg-icons/file/attachment';
import UnidocsFolderListItem from './UnidocsFolderListItem';
import UnidocsFileListItem from './UnidocsFileListItem';
import UnidocsNetworkManager from './UnidocsNetworkManager';
import path from 'path';

export default class UnidocsCellView extends React.Component {
  render() {
    var view;
    switch(this.props.data.type) {
      case 'markdown':
        view = <Markdown>{this.props.data.body}</Markdown>;
        break;
      default:
        view = <b>Unsupported cell type</b>;
        break;
    }
    return view;
  }
}
