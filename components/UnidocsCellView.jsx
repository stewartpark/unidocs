/* jshint esnext: true */

import React from 'react';
import Markdown from 'react-remarkable';
import List from 'material-ui/lib/lists/list';
import Toggle from 'material-ui/lib/toggle';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import ListItem from 'material-ui/lib/lists/list-item';
import ListDivider from 'material-ui/lib/lists/list-divider';

import FolderIcon from 'material-ui/lib/svg-icons/file/folder';
import FileIcon from 'material-ui/lib/svg-icons/file/attachment';
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu';
import ArrowUpIcon from 'material-ui/lib/svg-icons/navigation/arrow-drop-up';
import ArrowDownIcon from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import AddIcon from 'material-ui/lib/svg-icons/content/add-box';

import UnidocsFolderListItem from './UnidocsFolderListItem';
import UnidocsFileListItem from './UnidocsFileListItem';
import UnidocsNetworkManager from './UnidocsNetworkManager';

import path from 'path';

const types = [
  {'text': 'Markdown'},
  {'text': 'SQL'}
];

export default class UnidocsCellView extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        isEditing: false
      };
  }

  getTypeIndexByValue(text) {
    for(var i in types) {
      if(types[i].text == text) {
        return i;
      }
    }
    return 0;
  }

  onToggle(event, toggled) {
    this.state.isEditing = toggled;
    this.setState(this.state);
    if(!this.state.isEditing) {
      this.props.onCellChange(this.props.index, this.props.data);
    }
  }

  onChange(event, index, data) {
    var newBody = this.refs.body.getValue();
    var newType;
    if(index !== undefined) {
      newType = data.text;
    }
    newType = newType || this.props.data.type;
    this.props.data.type = newType;
    this.props.data.body = newBody;
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    this.props = nextProps;
    this.forceUpdate();
  }

  onMoveUp () {
    this.refs.toggle.setToggled(false);
    this.state.isEditing = false;
    this.props.onCellChange(this.props.index, this.props.data);
    this.props.onCellMoveUp(this.props.index, this.props.data);
  }

  onMoveDown () {
    this.refs.toggle.setToggled(false);
    this.state.isEditing = false;
    this.props.onCellChange(this.props.index, this.props.data);
    this.props.onCellMoveDown(this.props.index, this.props.data);
  }

  onAdd() {
    this.props.onCellAddBelow(this.props.index, {
      type: types[0].text,
      body: ''
    });
  }

  render() {
    var view;
    var toggle;

    if(this.state.isEditing) {
      view = (<div>
        <SelectField ref="type" style={{float:'right'}} selectedIndex={this.getTypeIndexByValue(this.props.data.type)} valueMember="text" menuItems={types} onChange={this.onChange.bind(this)} />
        <IconButton tooltip="Move Up" tooltipPosition="bottom-right" onTouchTap={this.onMoveUp.bind(this)}>
          <ArrowUpIcon />
        </IconButton>
        <IconButton tooltip="Move Down" tooltipPosition="bottom-right" onTouchTap={this.onMoveDown.bind(this)}>
          <ArrowDownIcon />
        </IconButton>
        <IconButton tooltip="Add a new cell" tooltipPosition="bottom-right" onTouchTap={this.onAdd.bind(this)}>
          <AddIcon />
        </IconButton>
        <br />
        <TextField ref="body" style={{width: '100%'}} multiLine={true} defaultValue={this.props.data.body} onChange={this.onChange.bind(this)} />
      </div>);
    } else {
      switch(this.props.data.type) {
        case 'Markdown':
          view = <Markdown>{this.props.data.body}</Markdown>;
          break;
        case 'SQL':
          view = <b>{this.props.data.body}</b>;
          break;
        default:
          view = <b>Unsupported cell type</b>;
          break;
      }
    }
    if(!this.props.disableToggle) {
      toggle = <div style={{float: 'right', width: '100px'}}>
        <Toggle ref="toggle" value={this.state.isEditing} onToggle={this.onToggle.bind(this)} label="Edit?" />
      </div>;
    }
    return (<div style={{minHeight: '38px'}}>
      {toggle}
      {view}
    </div>);
  }
}
