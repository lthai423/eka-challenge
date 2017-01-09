/* eslint react/prop-types: 0 */
/* turn off eslint for react proptyopes due to sometimes falsy props */

import React, {Component} from 'react';
import { connect } from 'react-redux';

// Bootstrap
import Table from 'react-bootstrap/lib/Table';
import Panel from 'react-bootstrap/lib/Panel';

@connect(
  (state) => {
    console.log(state);
    return ({
      brokerAuthority: state.info.brokerAuthority,
      commonAuthority: state.info.commonAuthority,
      contractAuthority: state.info.contractAuthority,
      cargoInsurance: state.info.cargoInsurance,
      autoInsurance: state.info.autoInsurance,
      generalInsurance: state.info.generalInsurance,
      cargoInsuranceExpiration: state.info.cargoInsuranceExpiration,
      autoInsuranceExpiration: state.info.autoInsuranceExpiration,
      generalInsuranceExpiration: state.info.generalInsuranceExpiration,
      safetyRating: state.info.safetyRating,
      cprRating: state.info.cprRating
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
                  <th></th>
                  <th>Type</th>
                  <th>Rating</th>
                  <th>Type</th>
                  <th>Qualified</th>
                  <th>Expiration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Valid CPR Rating</td>
                  <td></td>
                  <td>{this.props.cprRating || 'N/A'}</td>
                  <td></td>
                  <td>{this.props.cprRating ? 'Qualified' : 'Not Qualified'}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Government Safety Rating</td>
                  <td></td>
                  <td>{this.props.safetyRating || 'N/A'}</td>
                  <td></td>
                  <td>{this.props.safetyRating ? 'Qualified' : 'Not Qualified'}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Authority</td>
                  <td>Common</td>
                  <td></td>
                  <td>{this.props.commonAuthority}</td>
                  <td>{this.props.commonAuthority === 'Active' ? 'Qualified' : 'Not Qualified'}</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>Contract</td>
                  <td></td>
                  <td>{this.props.contractAuthority}</td>
                  <td>{this.props.contractAuthority === 'Active' ? 'Qualified' : 'Not Qualified'}</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>Broker</td>
                  <td></td>
                  <td>{this.props.brokerAuthority}</td>
                  <td>{this.props.brokerAuthority === 'Active' ? 'Qualified' : 'Not Qualified'}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Valid Carrier Insurance</td>
                  <td>Cargo</td>
                  <td></td>
                  <td></td>
                  <td>{this.props.cargoInsurance || 'N/A'}</td>
                  <td>{this.props.cargoInsuranceExpiration || 'N/A'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>Auto</td>
                  <td></td>
                  <td></td>
                  <td>{this.props.autoInsurance || 'N/A'}</td>
                  <td>{this.props.autoInsuranceExpiration || 'N/A'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>General</td>
                  <td></td>
                  <td></td>
                  <td>{this.props.generalInsurance || 'N/A'}</td>
                  <td>{this.props.generalInsuranceExpiration || 'N/A'}</td>
                </tr>
              </tbody>
            </Table>
        </div>
      </Panel>
      </div>
    );
  }
}
