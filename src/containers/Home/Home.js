import React, { Component, PropTypes } from 'react';
import config from '../../config';
import Helmet from 'react-helmet';
import { ValidateForm } from 'components';
import Panel from 'react-bootstrap/lib/Panel';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { handleSubmit } from './config';

const resultAction = (stuff) => {
  return {
    ...stuff,
    type: 'LOAD'
  };
};

@connect(
  () => ({}),
  dispatch => bindActionCreators({ resultAction }, dispatch)
)
export default class Home extends Component {
  static propTypes = {
    resultAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.handleSubmit = handleSubmit.bind(this);
  }

  render() {
    const styles = require('./Home.scss');

    return (
      <div>
        <Helmet title="Home"/>
        <div>
          <div className={'container ' + styles.description}>
            <h1>{config.app.title}</h1>
            <h2>{config.app.description}</h2>
          </div>
        </div>
        <div className={styles.center}>
          <Panel className={styles.myPanel}>
            <ValidateForm onSubmit={this.handleSubmit}/>
          </Panel>
        </div>
      </div>
    );
  }
}
