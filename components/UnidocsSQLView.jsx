/* jshint esnext: true */

import React from 'react';
import Table from 'material-ui/lib/table/table';
import TableHeader from 'material-ui/lib/table/table-header';
import TableBody from 'material-ui/lib/table/table-body';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableFooter from 'material-ui/lib/table/table-footer';

import UnidocsNetworkManager from './UnidocsNetworkManager';


export default class UnidocsSQLView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      type: 'table',
      error: null
    };
    this.process();
  }

  process() {
    var sql = this.props.sql;
    var db_name;

    var DBParser = /^%db (.+?)$/m;

    var _db = DBParser.exec(sql);
    if(_db){ db_name = _db[1]; sql = sql.replace(DBParser, ''); }

    if(db_name) {
      UnidocsNetworkManager.actionRunSQL(db_name, sql, function(data) {
        this.state.error = null;
        this.state.result = data;
        console.log(data);
        this.setState(this.state);
      }.bind(this), function(error) {
        var err = JSON.parse(error.responseText);
        this.state.error = <div>
          <b>Error({err.code})</b><br />
          <code>{sql}</code>
        </div>;
        this.setState(this.state);
      }.bind(this));
    } else {
      this.state.error = <div>
        <b>Error!</b> Database name is required!<br />
        Insert <code>%db [dbname]</code> in the beginning of the query.
      </div>;
      this.setState(this.state);
    }
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;
    this.process();
  }

  buildTable(data) {
    var columns = data.fields;
    var colEl = [];
    var rowEl = [];

    for(var i in columns) {
      colEl.push(<TableHeaderColumn>{columns[i].name}</TableHeaderColumn>);
    }

    for(var j in data.rows) {
      var _rowColEl = [];
      for(var k in data.rows[j]) {
        _rowColEl.push(<TableRowColumn>{data.rows[j][k]}</TableRowColumn>);
      }
      rowEl.push(<TableRow>{_rowColEl}</TableRow>);
    }

    return (<Table>
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow>
          {colEl}
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {rowEl}
      </TableBody>
    </Table>);
  }

  render() {
    if(this.state.error) {
      return this.state.error;
    } else {
      switch(this.state.type) {
        case 'table':
          return <b>{this.buildTable(this.state.result)}</b>;
        default:
          return <b>Internal error</b>;
      }
    }
  }
}
