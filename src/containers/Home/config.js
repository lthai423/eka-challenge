import request from 'request';
import { parseString } from 'xml2js';
import {browserHistory} from 'react-router';

export function getChanges(xml) {
  console.log(xml);
  if (xml['soapenv:Envelope']['soapenv:Body'][0]['soapenv:Fault']) {
    return {
      xml: xml,
      error: true
    };
  }

  const xmlResultData = xml['soapenv:Envelope']['soapenv:Body'][0]['tfm:lookupCarrierResponse'][0]['tfm:lookupCarrierResult'][0];
  if (xmlResultData['tcor:serviceError']) {
    return {
      xml: xml,
      error: true,
      detailedMessage: xmlResultData['tcor:serviceError'][0]['tcor:detailedMessage'][0]
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

export function search(stuff) {
  // const self = this;

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
      const changed = getChanges(result);
      if (changed.error) {
        // self.on();
      } else {
        // self.off();
        this.props.resultAction(changed, result);
        browserHistory.push('/about');
      }
    });
  });
}

export function handleSubmit(stuff) {
  const cookieObj = {};
  document.cookie.split('; ').forEach((item) => {
    cookieObj[item.split('=')[0]] = item.split('=')[1];
  });
  const isExpired = (Math.abs(new Date(cookieObj.expiry).valueOf() - new Date().getTime()) / 36e5) - 12;

  if (!document.cookie || isExpired) { // create new auth token if old one expired already
    const options = {
      uri: 'https://young-wildwood-90521.herokuapp.com/login',
      method: 'GET'
    };

    request(options, (err, res) => {
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
