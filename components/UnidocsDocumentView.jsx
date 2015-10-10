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
      metadata: {},
      cells: []
    };
  }

  updateServer() {
    var data = {};
    data.metadata = this.state.metadata;
    data.cells = [];
    for(var i in this.state.cells) {
      var cell = this.state.cells[i];
      console.log(cell);
      data.cells.push({
        type: cell.props.data.type,
        body: cell.props.data.body
      });
    }

    var fileContent = JSON.stringify(data);
    console.log(fileContent);
    UnidocsNetworkManager.putFile(this.props.path, fileContent);
  }

  onCellMoveUp(index, data) {

  }

  onCellMoveDown(index, data) {

  }

  onCellChange(index, data) {
    this.state.cells[index] = this.generateCell(index, data);
    this.setState(this.state);
    this.updateServer();
  }

  onCellAddAbove(index, data) {

  }

  onCellAddBelow(index, data) {

  }

  generateCell(index, data) {
    return <UnidocsCellView
      data={data}
      index={index}
      onCellMoveUp={this.onCellMoveUp.bind(this)}
      onCellMoveDown={this.onCellMoveDown.bind(this)}
      onCellChange={this.onCellChange.bind(this)}
      onCellAddAbove={this.onCellAddAbove.bind(this)}
      onCellAddBelow={this.onCellAddBelow.bind(this)} />;
  }

  componentDidMount() {
    UnidocsNetworkManager.getFile(this.props.path, function(data) {
      const parser = new UnidocsFileParser(data);
      const doc = parser.parse();

      var elements = [];

      for(var i in doc.cells) {
        elements.push(this.generateCell(i, doc.cells[i]));
      }

      this.state.metadata = doc.metadata;
      this.state.cells = elements;
      this.setState(this.state);
    }.bind(this));
  }

  render() {
    return (<div>
      {this.state.cells}
    </div>);
  }
}
