import React from 'react';
import logo from '../../../images/logo-UQ.png';

export default class WidgetToast extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-md-3">
          <img src={logo} className="card-img-top" alt="Logo UQ" style={{ width: "30px", height: "30px" }} />
        </div>
        <div className="col-md-9">
          Notificación
        </div>
      </div>
    );
  }
}