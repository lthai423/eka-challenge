import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';
import request from 'request';
// import $ from 'jquery';

import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from './routes';

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});
const parseString = require('xml2js').parseString;

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(Express.static(path.join(__dirname, '..', 'static')));

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, {target: targetUrl});
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'});
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

app.get('/login', function (req, res, next) {
  const loginXml = '<?xml version="1.0" encoding="utf-8"?> <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tfmi="http://www.tcore.com/TfmiFreightMatching.xsd" xmlns:headers="http://www.tcore.com/TcoreHeaders.xsd" xmlns:message="http://www.tcore.com/TcoreMessage.xsd" xmlns:types="http://www.tcore.com/TcoreTypes.xsd" xmlns:cwtypes="http://www.tcore.com/TcoreCarrierWatchTypes.xsd" xmlns:dobtypes="http://www.tcore.com/TcoreDobTypes.xsd" xmlns:tfmiwsdl="http://www.tcore.com/TfmiFreightMatching.wsdl" xmlns:tfmirates="http://www.tcore.com/TfmiRates.xsd"> <soap:Body> <tfmi:loginRequest xmlns:tfmi="http://www.tcore.com/TfmiFreightMatching.xsd" xmlns="http://www.tcore.com/TfmiFreightMatching.xsd"> <tfmi:loginOperation> <tfmi:loginId>peak_cxn1</tfmi:loginId> <tfmi:password>logistics</tfmi:password> <tfmi:thirdPartyId>Lawrence</tfmi:thirdPartyId> </tfmi:loginOperation> </tfmi:loginRequest> </soap:Body> </soap:Envelope>';
  request.post(
    { url:'http://208.64.206.159:9280/TfmiRequest',
      body : loginXml,
      headers: {'Content-Type': 'text/xml'}
    },
    function (error, response, body) {  
        if (!error) {
          parseString(body, function (err, result) {
              res.send({
                primary: result['soapenv:Envelope']['soapenv:Body'][0]['tfm:loginResponse'][0]['tfm:loginResult'][0]['tfm:loginSuccessData'][0]['tfm:token'][0]['tcor:primary'][0]['_'],
                secondary: result['soapenv:Envelope']['soapenv:Body'][0]['tfm:loginResponse'][0]['tfm:loginResult'][0]['tfm:loginSuccessData'][0]['tfm:token'][0]['tcor:secondary'][0]['_'],
                expiration: result['soapenv:Envelope']['soapenv:Body'][0]['tfm:loginResponse'][0]['tfm:loginResult'][0]['tfm:loginSuccessData'][0]['tfm:expiration'][0]
              });
          });
        } else {
          res.send(error);
        }
    }
  );
});

app.get('/search', function (req, res, next) {
  let cookieObj = {};
  req.headers.cookie.split('; ').forEach((item) => {
    cookieObj[item.split('=')[0]] = item.split('=')[1];
  });

  const searchXml = {
    1: '<?xml version="1.0" encoding="UTF-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cwtypes="http://www.tcore.com/TcoreCarrierWatchTypes.xsd" xmlns:dobtypes="http://www.tcore.com/TcoreDobTypes.xsd" xmlns:headers="http://www.tcore.com/TcoreHeaders.xsd" xmlns:message="http://www.tcore.com/TcoreMessage.xsd" xmlns:tfmi="http://www.tcore.com/TfmiFreightMatching.xsd" xmlns:tfmirates="http://www.tcore.com/TfmiRates.xsd" xmlns:tfmiwsdl="http://www.tcore.com/TfmiFreightMatching.wsdl" xmlns:types="http://www.tcore.com/TcoreTypes.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soap:Header><headers:sessionHeader soap:mustUnderstand="0"><headers:sessionToken><types:primary>',
    2: '</types:primary><types:secondary>',
    mc: '</types:secondary></headers:sessionToken></headers:sessionHeader></soap:Header><soap:Body><tfmi:lookupCarrierRequest xmlns="http://www.tcore.com/TfmiFreightMatching.xsd"><tfmi:lookupCarrierOperation><tfmi:mcNumber>',
    mc2: '</tfmi:mcNumber><tfmi:includeDotAuthority>true</tfmi:includeDotAuthority><tfmi:includeDotInsurance>true</tfmi:includeDotInsurance><tfmi:includeFmcsaSafetyRating>true</tfmi:includeFmcsaSafetyRating></tfmi:lookupCarrierOperation></tfmi:lookupCarrierRequest></soap:Body></soap:Envelope>',
    dot: '</types:secondary></headers:sessionToken></headers:sessionHeader></soap:Header><soap:Body><tfmi:lookupCarrierRequest xmlns="http://www.tcore.com/TfmiFreightMatching.xsd"><tfmi:lookupCarrierOperation><tfmi:dotNumber>',
    dot2: '</tfmi:dotNumber><tfmi:includeDotAuthority>true</tfmi:includeDotAuthority><tfmi:includeDotInsurance>true</tfmi:includeDotInsurance><tfmi:includeInsuranceCertificates>true</tfmi:includeInsuranceCertificates><tfmi:includeFmcsaSafetyRating>true</tfmi:includeFmcsaSafetyRating></tfmi:lookupCarrierOperation></tfmi:lookupCarrierRequest></soap:Body></soap:Envelope>'
  };

  let {mc_num, dot_num} = req.query;
  let body;
  if (mc_num) {
    body = searchXml[1] + cookieObj.primary + '=' + searchXml[2] + cookieObj.secondary + '=' + searchXml['mc'] + mc_num + searchXml['mc2'];
  } else if (dot_num) {
    body = searchXml[1] + cookieObj.primary + '=' + searchXml[2] + cookieObj.secondary + '=' + searchXml['dot'] + dot_num + searchXml['dot2'];
  } else {
    body = 'MC and DOT number were unable to be found';
  }

  request.post(
    { url:'http://208.64.206.159:9280/TfmiRequest',
      body : body,
      headers: {'Content-Type': 'text/xml'}
    },
    function (error, response) {        
      if (!error) {
        res.send(response);
      } else {
        res.send(error)
      }
    }
  );
});

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const client = new ApiClient(req);
  const memoryHistory = createHistory(req.originalUrl);
  const store = createStore(memoryHistory, client);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);

        global.navigator = {userAgent: req.headers['user-agent']};

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
