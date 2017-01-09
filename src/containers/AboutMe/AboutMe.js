import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Panel from 'react-bootstrap/lib/Panel';

export default class AboutMe extends Component {

  render() {
    const styles = require('./AboutMe.scss');
    return (
      <div>
        <Helmet title="AboutMe"/>
        <div className={styles.center}>
          <Panel className={styles.myPanel}>
            <p> Hello, this page is here to demonstrate React-Router. </p>
          </Panel>
        </div>
      </div>
    );
  }
}
