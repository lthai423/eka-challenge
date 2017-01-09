import React, { Component } from 'react';
import Helmet from 'react-helmet';
import {ValidateTable} from 'components';

export default class About extends Component {

  render() {
    // const styles = require('./About.scss');
    return (
      <div>
        <Helmet title="About"/>
        <div>
          <ValidateTable />
        </div>
      </div>
    );
  }
}
