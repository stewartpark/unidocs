/* jshint esnext: true */

import React from 'react';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import Dialog from 'material-ui/lib/dialog';
import Toggle from 'material-ui/lib/toggle';
import TextField from 'material-ui/lib/text-field';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import RaisedButton from 'material-ui/lib/raised-button';
import AddFileIcon from 'material-ui/lib/svg-icons/action/note-add';
import AddFolderIcon from 'material-ui/lib/svg-icons/content/add';
import BackIcon from 'material-ui/lib/svg-icons/navigation/close';
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu';
import EditIcon from 'material-ui/lib/svg-icons/image/edit.js';

import UnidocsTheme from './UnidocsTheme';
import UnidocsTreeView from './UnidocsTreeView';
import UnidocsDocumentView from './UnidocsDocumentView';
import UnidocsNetworkManager from './UnidocsNetworkManager';

import path from 'path';

//ThemeDecorator doesn't support props, the mainstream fixed it but wasn't released yet.
//TODO Update material-ui and uncomment the below.
//@ThemeDecorator(ThemeManager.getMuiTheme(UnidocsTheme))
export default class UnidocsApp extends React.Component {
  constructor(props) {
    super(props);
    console.dir(this, props);
    this.state = {
      path: undefined,
      title: undefined,
      leftMenu: undefined,
      rightMenu: undefined,
      view: undefined
    };
    this.openTreeView(props.initialPath || '/');
  }

  setURL(_path) {
    if(!global.__SERVER__) {
      window.history.pushState({url: _path}, 'Unidocs', _path);
    }
  }

  refresh() {
    this.setState(this.state);
  }

  openDocument(_path, readonly) {
    function goBack() {
      this.openTreeView(path.dirname(_path));
    }
    function toggleMode(event, toggled) {
      this.openDocument(_path, toggled);
    }
    this.state = {
      path: _path,
      title: path.basename(_path),
      leftMenu: <IconButton onTouchTap={goBack.bind(this)}><BackIcon /></IconButton>,
      rightMenu: <div style={{width: '80px'}}><Toggle label={<EditIcon />} onToggle={toggleMode.bind(this)}/></div>,
      view: <UnidocsDocumentView path={_path} disableToggle={!readonly} onBack={this.openTreeView.bind(this)} />
    };
    this.refresh();
    this.setURL(_path);
  }

  openTreeView(_path) {
    function openMenu() {
      this.refs.leftNav.toggle();
    }
    function openAddFolder () {
      this.refs.addNewFolderDialog.show();
    }
    function openAddFile() {
      this.refs.addNewFileDialog.show();
    }

    this.state = {
      path: _path,
      title: _path,
      leftMenu: <IconButton onTouchTap={openMenu.bind(this)}><MenuIcon /></IconButton>,
      rightMenu:
        <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
          <MenuItem primaryText="Add a new folder" leftIcon={<AddFolderIcon />} onTouchTap={openAddFolder.bind(this)} />
          <MenuItem primaryText="Add a new document" leftIcon={<AddFileIcon />} onTouchTap={openAddFile.bind(this)} />
        </IconMenu>,
      view: <UnidocsTreeView path={_path} onChangePath={this.openTreeView.bind(this)} onDocumentOpen={this.openDocument.bind(this)} />
    };
    this.refresh();
    this.setURL(_path);
  }

  onMenuClick(event, selectedIndex, menuItem) {
    console.log(selectedIndex, menuItem);
  }

  onAddFolder() {
    UnidocsNetworkManager.postFolder(this.state.path, this.refs.newFolderName.getValue(), function(){
      this.refs.addNewFolderDialog.dismiss();
      this.refs.newFolderName.clearValue();
      location.reload(); //this.openTreeView(this.state.path); // This will refresh the tree view.
    }.bind(this), function(){
      alert('Error occurred.');
    }.bind(this));
  }

  onAddFile() {
    UnidocsNetworkManager.postFile(this.state.path, this.refs.newFileName.getValue(), function(){
      this.refs.addNewFileDialog.dismiss();
      this.refs.newFileName.clearValue();
      location.reload(); //this.openTreeView(this.state.path); // This will refresh the tree view.
    }.bind(this), function(){
      alert('Error occurred.');
    }.bind(this));
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <LeftNav ref="leftNav" menuItems={[
          {route: 'test', text: 'Test menu!'}
        ]} docked={false} onChange={this.onMenuClick.bind(this)} />
        <Dialog title="Add a new folder" actions={[
          { text: 'Cancel' },
          { text: 'Add', onTouchTap: this.onAddFolder.bind(this), ref: 'add' }
        ]} ref="addNewFolderDialog">
          Add a new folder under the current folder!<br />
          Name: <TextField hintText="Name of the new folder" ref="newFolderName" />
        </Dialog>
        <Dialog title="Add a new folder" actions={[
          { text: 'Cancel' },
          { text: 'Add', onTouchTap: this.onAddFile.bind(this), ref: 'add' }
        ]} ref="addNewFileDialog">
          Add a new file under the current folder!<br />
          Name: <TextField hintText="Name of the new folder" ref="newFileName" />
        </Dialog>
        <AppBar
          title={this.state.title}
          iconElementLeft={this.state.leftMenu}
          iconElementRight={this.state.rightMenu}
        />
        {this.state.view}
      </div>
    );
  }
}
