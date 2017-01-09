import request from 'request';
import { parseString } from 'xml2js';
import {browserHistory} from 'react-router';
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';
import React from 'react';

export function getChanges(xml) {
  console.log(xml);
  if (xml['soapenv:Envelope']['soapenv:Body'][0]['soapenv:Fault']) {
    return {
      xml: xml,
      error: true,
      reason: 'Invalid MC or DOT number.'
    };
  }

  const xmlResultData = xml['soapenv:Envelope']['soapenv:Body'][0]['tfm:lookupCarrierResponse'][0]['tfm:lookupCarrierResult'][0];
  if (xmlResultData['tcor:serviceError']) {
    return {
      xml: xml,
      error: true,
      reason: xmlResultData['tcor:serviceError'][0]['tcor:detailedMessage'][0]
    };
  }

  const result = {};
  const xmlSuccessData = xmlResultData['tfm:lookupCarrierSuccessData'][0];

  if (xmlSuccessData['tfm:dotAuthority']) {
    result.commonAuthority = xmlSuccessData['tfm:dotAuthority'][0]['tcor:commonAuthority'][0]._;
    result.contractAuthority = xmlSuccessData['tfm:dotAuthority'][0]['tcor:contractAuthority'][0]._;
    result.brokerAuthority = xmlSuccessData['tfm:dotAuthority'][0]['tcor:brokerAuthority'][0]._;
  }

  if (xmlSuccessData['tfm:insuranceCertificates']) {
    const coverageType = xmlSuccessData['tfm:insuranceCertificates'][0]['tcor:coverage'][0]['tcor:coverageCategory'][0];
    result.cargo = coverageType.indexOf('CARGO') !== -1 ? 'CARGO' : 'Not Qualified';
    result.auto = coverageType.indexOf('AUTO') !== -1 ? 'AUTO' : 'Not Qualified';
    result.general = coverageType.indexOf('GENERAL') !== -1 ? 'GENERAL' : 'Not Qualified';

    result.expirationDate = xmlSuccessData['tfm:insuranceCertificates'][0]['tcor:coverage'][0]['tcor:expirationDate'][0];
  }

  if (xmlSuccessData['tfm:safetyRating']) {
    result.safetyRating = xmlSuccessData['tfm:safetyRating'][0]['tfm:rating']._;
  }

  return result;
}

export function setAlertMessages(stuff, result) {
  const changed = getChanges(result);
  if (changed.error) {
    this.setState({alertVisible: true, errorMessage: changed.reason});
  } else {
    this.setState({alertVisible: false, errorMessage: ''});
    this.props.resultAction(changed, result);
    browserHistory.push('/about');
  }

  console.log(changed.error, 'jdsalkfja;lkdsajfads;lk');
}

export function search(stuff) {
  const searchOptions = {
    uri: 'https://young-wildwood-90521.herokuapp.com/search',
    method: 'GET',
    headers: {
      'Content-Type': 'plain/text',
    },
    qs: stuff
  };

  request(searchOptions, (err, response, body) => {
    const xml = JSON.parse(body).body;
    parseString(xml, (error, result) => {
      setAlertMessages.apply(this, [stuff, result]);
    });
  });
}

export function handleSubmit(stuff) {
  let willNotSubmit = true;

  if (!stuff.name) {
    this.setState({alertVisible: true, errorMessage: 'Please Input Name.  '});
  } else if (!stuff.email) {
    this.setState({alertVisible: true, errorMessage: 'Please Input Email.  '});
  } else if (!stuff.password || !stuff.password2) {
    this.setState({alertVisible: true, errorMessage: 'Please Input Password.  '});
  } else if (stuff.password !== stuff.password2) {
    this.setState({alertVisible: true, errorMessage: 'Please double check passwords.  '});
  } else if (!stuff.hint) {
    this.setState({alertVisible: true, errorMessage: 'Please Input Password Hint.  '});
  } else if (!stuff.email) {
    this.setState({alertVisible: true, errorMessage: 'Please Input Email.  '});
  } else if (!stuff.broker) {
    this.setState({alertVisible: true, errorMessage: 'Please Select Broker.  '});
  } else if (!stuff.mc_num && !stuff.dot_num) {
    this.setState({alertVisible: true, errorMessage: 'Please Input Either MC or DOT Number.  '});
  } else if (!stuff.email) {
    this.setState({alertVisible: true, errorMessage: 'Please Select Single Owner/Operator Status.  '});
  } else {
    willNotSubmit = false;
  }

  if (!willNotSubmit) {
    const cookieObj = {};
    document.cookie.split('; ').forEach((item) => {
      cookieObj[item.split('=')[0]] = item.split('=')[1];
    });
    const isExpired = (Math.abs(new Date(cookieObj.expiry).valueOf() - new Date().getTime()) / 36e5) - 12 < 0;

    if (!document.cookie || isExpired) { // create new auth token if old one expired already
      const options = {
        uri: 'https://young-wildwood-90521.herokuapp.com/login',
        method: 'GET'
      };

      request(options, (err, res) => {
        console.log(err);
        const body = JSON.parse(res.body);
        document.cookie = 'primary=' + body.primary + ';';
        document.cookie = 'secondary=' + body.secondary + ';';
        document.cookie = 'expiry=' + body.expiration + ';';
        search.call(this, stuff);
      });
    } else {
      search.call(this, stuff);
    }
  }
}

export function renderAlert() {
  if (this.state.alertVisible) {
    return (
      <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
        <h4>Oh no! You got an error!</h4>
        <p>{this.state.errorMessage}</p>
        <p>
          <Button onClick={this.handleAlertDismiss}>Hide Alert</Button>
        </p>
      </Alert>
    );
  }
}

export function resultAction(stuff) {
  return {
    ...stuff,
    type: 'LOAD'
  };
}

export function handleAlertDismiss() {
  this.setState({alertVisible: false});
}
