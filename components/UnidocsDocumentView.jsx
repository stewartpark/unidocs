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

  componentWillReceiveProps(newProps) {
    console.log(newProps);
    this.props = newProps;
  }

  updateServer() {
    var data = {};
    data.metadata = this.state.metadata;
    data.cells = [];

    for(var i in this.state.cells) {
      var cell = this.state.cells[i];
      data.cells.push({
        type: cell.data.type,
        body: cell.data.body
      });
    }

    var fileContent = JSON.stringify(data);
    UnidocsNetworkManager.putFile(this.props.path, fileContent);
  }

  onCellMoveUp(index, data) {
    if(+index > 0) {
      var t = this.state.cells[+index-1].data;
      this.state.cells[+index-1].data = this.state.cells[+index].data;
      this.state.cells[+index].data = t;

      this.setState(this.state);
      this.forceUpdate();
      this.updateServer();
    }
  }

  onCellMoveDown(index, data) {
    if(+index < this.state.cells.length-1) {
      var t = this.state.cells[+index+1].data;
      this.state.cells[+index+1].data = this.state.cells[+index].data;
      this.state.cells[+index].data = t;

      this.setState(this.state);
      this.forceUpdate();
      this.updateServer();
    }
  }

  onCellChange(index, data) {
    this.state.cells[+index] = {data: data};
    this.setState(this.state);
    this.forceUpdate();
    this.updateServer();
  }

  onCellAddAbove(index, data) {

  }

  onCellAddBelow(index, data) {
    this.state.cells.push({
      data: data
    });

    this.setState(this.state);
    this.updateServer();
  }

  onCellDelete(index, data) {
    if(this.state.cells.length > 1) {
      this.state.cells.splice(index, 1);
    }
    this.setState(this.state);
    this.updateServer();
  }

  generateCell(index, data) {
    return <UnidocsCellView
      data={data}
      index={index}
      onCellMoveUp={this.onCellMoveUp.bind(this)}
      onCellMoveDown={this.onCellMoveDown.bind(this)}
      onCellChange={this.onCellChange.bind(this)}
      onCellAddAbove={this.onCellAddAbove.bind(this)}
      onCellAddBelow={this.onCellAddBelow.bind(this)}
      onCellDelete={this.onCellDelete.bind(this)}
      disableToggle={this.props.disableToggle} />;
  }

  componentDidMount() {
    UnidocsNetworkManager.getFile(this.props.path, function(data) {
      const parser = new UnidocsFileParser(data);
      const doc = parser.parse();

      var elements = [];

      for(var i in doc.cells) {
        elements.push({data: doc.cells[i]});
      }

      this.state.metadata = doc.metadata;
      this.state.cells = elements;
      this.setState(this.state);
    }.bind(this));
  }

  render() {
    var cells = [];
    for(var i in this.state.cells) {
      cells.push(this.generateCell(i, this.state.cells[i].data));
    }

    return (<div>
      {cells}
    </div>);
  }
}
