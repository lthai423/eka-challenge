import React, { Component, PropTypes } from 'react';
import {browserHistory} from 'react-router';
import config from '../../config';
import Helmet from 'react-helmet';
import { ValidateForm } from 'components';
import request from 'request';
import Panel from 'react-bootstrap/lib/Panel';
import { parseString } from 'xml2js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getChanges } from './config';

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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(stuff) {
    console.log(stuff);
    const search = () => {
      const searchOptions = {
        uri: 'http://localhost:3000/search',
        method: 'GET',
        headers: {
          'Content-Type': 'plain/text',
        },
        qs: stuff
      };

      request(searchOptions, (err, response, body) => {
        const xml = JSON.parse(body).body;
        parseString(xml, (error, result) => {
          const changed = getChanges(result);
          if (changed.error) {
            // display error;
          } else {
            this.props.resultAction(changed, result);
            browserHistory.push('/about');
          }
        });
      });
    };

    const cookieObj = {};
    document.cookie.split('; ').forEach((item) => {
      cookieObj[item.split('=')[0]] = item.split('=')[1];
    });
    const isExpired = (Math.abs(new Date(cookieObj.expiry).valueOf() - new Date().getTime()) / 36e5) - 12;

    if (!document.cookie || isExpired) { // create new auth token if old one expired already
      const options = {
        uri: 'http://localhost:3000/login',
        method: 'GET'
      };

      request(options, (err, res) => {
        const body = JSON.parse(res.body);
        document.cookie = 'primary=' + body.primary + ';';
        document.cookie = 'secondary=' + body.secondary + ';';
        document.cookie = 'expiry=' + body.expiration + ';';
        search();
      });
    } else {
      search();
    }
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
