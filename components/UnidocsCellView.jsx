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
import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';
import EditIcon from 'material-ui/lib/svg-icons/image/edit.js';

import UnidocsSQLView from './UnidocsSQLView';
import UnidocsFolderListItem from './UnidocsFolderListItem';
import UnidocsFileListItem from './UnidocsFileListItem';
import UnidocsNetworkManager from './UnidocsNetworkManager';

import path from 'path';

export const types = [
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
    console.log(this.refs.type);
    if(index !== undefined) {
      newType = data.text;
    }
    newType = newType || this.props.data.type;
    this.props.data.type = newType;
    this.props.data.body = newBody;
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    try {
      this.refs.body.setValue(this.props.data.body);
    }catch(e){
      console.log(e);
    }
    this.forceUpdate();
  }

  onMoveUp () {
    this.props.onCellChange(this.props.index, this.props.data);
    this.props.onCellMoveUp(this.props.index, this.props.data);
  }

  onMoveDown () {
    this.props.onCellChange(this.props.index, this.props.data);
    this.props.onCellMoveDown(this.props.index, this.props.data);
  }

  onDelete() {
    this.props.onCellDelete(this.props.index, this.props.data);
    this.forceUpdate();
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

    if(!this.props.disableToggle && this.state.isEditing) {
      view = (<div>
        <hr />
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
        <IconButton tooltip="Delete this cell" tooltipPosition="bottom-right" onTouchTap={this.onDelete.bind(this)}>
          <DeleteIcon />
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
          view = <UnidocsSQLView sql={this.props.data.body} />;
          break;
        default:
          view = <b>Unsupported cell type</b>;
          break;
      }
    }
    if(!this.props.disableToggle) {
      toggle = <div style={{float: 'right', width: '80px'}}>
        <Toggle ref="toggle" value={this.state.isEditing} onToggle={this.onToggle.bind(this)} label={<EditIcon />} />
      </div>;
    }
    return (<div style={{minHeight: '38px'}}>
      {toggle}
      {view}
    </div>);
  }
}
