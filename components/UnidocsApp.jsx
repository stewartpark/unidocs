/* jshint esnext: true */

import React from 'react';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import Dialog from 'material-ui/lib/dialog';
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

  openDocument(_path) {
    function goBack() {
      console.log(_path, path.dirname(_path));
      this.openTreeView(path.dirname(_path));
    }
    this.state = {
      path: _path,
      title: path.basename(_path),
      leftMenu: <IconButton onTouchTap={goBack.bind(this)}><BackIcon /></IconButton>,
      rightMenu: undefined,
      view: <UnidocsDocumentView path={_path} onBack={this.openTreeView.bind(this)} />
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

    this.state = {
      path: _path,
      title: _path,
      leftMenu: <IconButton onTouchTap={openMenu.bind(this)}><MenuIcon /></IconButton>,
      rightMenu:
        <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
          <MenuItem primaryText="Add a new folder" leftIcon={<AddFolderIcon />} onTouchTap={openAddFolder.bind(this)} />
          <MenuItem primaryText="Add a new document" leftIcon={<AddFileIcon />} />
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
    //TODO Create a new folder in the server
    console.log(this.refs.newFolderName.getValue());
    this.refs.addNewFolderDialog.dismiss();
    this.openTreeView(this.state.path); // This will refresh the tree view.
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
