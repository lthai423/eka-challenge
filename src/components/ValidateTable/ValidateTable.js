/* eslint react/prop-types: 0 */
/* turn off eslint for react proptyopes due to sometimes falsy props */

import React, {Component} from 'react';
import { connect } from 'react-redux';

// Bootstrap
import Table from 'react-bootstrap/lib/Table';
import Panel from 'react-bootstrap/lib/Panel';

@connect(
  (state) => {
    return ({
      brokerAuthority: state.info.brokerAuthority,
      commonAuthority: state.info.commonAuthority,
      contractAuthority: state.info.contractAuthority,
      cargoInsurance: state.info.cargoInsurance,
      autoInsurance: state.info.autoInsurance,
      generalInsurance: state.info.generalInsurance,
      expirationDate: state.info.expirationDate,
      safetyRating: state.info.safetyRating,
    });
  }
)
export default class ValidateTable extends Component {
  render() {
    const styles = require('./ValidateTable.scss');
    return (
      <div className={styles.center}>
      <Panel className={styles.Panel}>
        <div className={styles.table}>
            <Table responsive>
              <thead>
                <tr>
                  <th style={{textAlign: 'center'}}></th>
                  <th style={{textAlign: 'center'}}>Type</th>
                  <th style={{textAlign: 'center'}}>Rating</th>
                  <th style={{textAlign: 'center'}}>Type</th>
                  <th style={{textAlign: 'center'}}>Qualified</th>
                  <th style={{textAlign: 'center'}}>Expiration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Government Safety Rating</td>
                  <td></td>
                  <td>{this.props.safetyRating || 'No Safety Rating Found'}</td>
                  <td></td>
                  <td>{this.props.safetyRating ? 'Qualified' : 'Please Submit Further Documentation'}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Authority</td>
                  <td>Common</td>
                  <td></td>
                  <td>{this.props.commonAuthority}</td>
                  <td>{this.props.commonAuthority === 'Active' ? 'Qualified' : 'Please Submit Further Documentation'}</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>Contract</td>
                  <td></td>
                  <td>{this.props.contractAuthority}</td>
                  <td>{this.props.contractAuthority === 'Active' ? 'Qualified' : 'Please Submit Further Documentation'}</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>Broker</td>
                  <td></td>
                  <td>{this.props.brokerAuthority}</td>
                  <td>{this.props.brokerAuthority === 'Active' ? 'Qualified' : 'Please Submit Further Documentation'}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Valid Carrier Insurance</td>
                  <td>Cargo</td>
                  <td></td>
                  <td>{this.props.cargoInsurance ? 'Active' : 'None'} </td>
                  <td>{this.props.cargoInsurance || 'No Cargo Insurance Found'}</td>
                  <td>{this.props.expirationDate || 'N/A'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>Auto</td>
                  <td></td>
                  <td>{this.props.autoInsurance ? 'Active' : 'None'} </td>
                  <td>{this.props.autoInsurance || 'No Auto Insurance Found'}</td>
                  <td>{this.props.expirationDate || 'N/A'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>General</td>
                  <td></td>
                  <td>{this.props.generalInsurance ? 'Active' : 'None'} </td>
                  <td>{this.props.generalInsurance || 'No Cargo Insruance Found'}</td>
                  <td>{this.props.expirationDate || 'N/A'}</td>
                </tr>
              </tbody>
            </Table>
        </div>
      </Panel>
      </div>
    );
  }
}
