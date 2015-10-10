/* jshint esnext: true */

import React from 'react';
import Markdown from 'react-remarkable';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import RaisedButton from 'material-ui/lib/raised-button';

import UnidocsNetworkManager from './UnidocsNetworkManager';
import UnidocsFileParser from './UnidocsFileParser';
import UnidocsCellView from './UnidocsCellView';

export default class UnidocsDocumentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastModified: undefined,
      cells: []
    };
  }

  componentDidMount() {
    UnidocsNetworkManager.getFile(this.props.path, function(data) {
      const parser = new UnidocsFileParser(data);
      const doc = parser.parse();

      var elements = [];

      for(var i in doc.cells) {
        var cell = doc.cells[i];
        elements.push(<UnidocsCellView data={cell} />);
      }

      this.state.cells = elements;
      this.setState(this.state.cells);
    }.bind(this));
  }

  render() {
    return (<div>
      <Toolbar>
        <ToolbarGroup key={0} float="right">
          <RaisedButton label="Edit" primary={true} />
        </ToolbarGroup>
      </Toolbar>
      {this.state.cells}
    </div>);
  }
}
