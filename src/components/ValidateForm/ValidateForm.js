import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

@reduxForm({
  form: 'validate',
  fields: ['name', 'email', 'password', 'password2', 'hint', 'broker', 'mc_num', 'dot_num', 'singleOp']
})
export default class ValidateForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  }

  render() {
    const {
      fields: {name, email, password, password2, hint, broker, mc_num, dot_num, singleOp},
      handleSubmit,
      resetForm,
    } = this.props;
    const renderInput = (field, label) =>
      <div className="form-group" >
        <div className={'col-lg-12 '}>
          <input type="text" className="form-control" id={field.name} placeholder={label} {...field}/>
        </div>
      </div>;

    return (
      <div>
        <form className="form-horizontal" onSubmit={this.props.handleSubmit}>
          {renderInput(name, 'Full Name')}
          {renderInput(email, 'Email', true)}
          {renderInput(password, 'Password')}
          {renderInput(password2, 'Re-Enter Password')}
          {renderInput(hint, 'Password Hint')}
          <div className={'col-lg-12'}>
            <FormGroup>
              <FormControl style={{color: '#999999'}} id={broker.name} {...broker} componentClass="select" placeholder="select">
                <option value="select">Select Broker or Create New One</option>
                <option value="broker1">Broker1</option>
                <option value="broker2">Broker2</option>
                <option value="broker3">Broker3</option>
                <option value="createNewBroker">Create New Broker</option>
              </FormControl>
            </FormGroup>
          </div>
          <ControlLabel> Please provide one of the following </ControlLabel>
          {renderInput(mc_num, 'MC#')}
          <ControlLabel> or </ControlLabel>
          {renderInput(dot_num, 'DOT#')}
          <div className={'col-lg-12'}>
            <FormGroup>
              <ControlLabel>Are you a single owner/operator</ControlLabel>
              <FormControl id={singleOp} style={{color: '#999999'}} {...broker} componentClass="select" placeholder="select">
                <option value="select">Are you a single owner/operator?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </FormControl>
            </FormGroup>
          </div>
          <div className="form-group">
            <div>
                <button className="btn btn-success" onClick={handleSubmit} style={{marginRight: 4}}>
                  <i className="fa fa-paper-plane"/> Submit
                </button>
                <button className="btn btn-warning" onClick={resetForm}>
                  <i className="fa fa-undo"/> Reset
                </button>
            </div>
          </div>
        </form>

      </div>
    );
  }
}
