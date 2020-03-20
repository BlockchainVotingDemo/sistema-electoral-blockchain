import React from 'react';

/**
 * Este componente permite ser reutilizado para listar las diferentes mesas que estan presentes en la jornada electoral
 */
export default class WidgetItemTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div className="card text-center border-primary ml-5 mb-5" style={{ maxWidth: "200px", float: "left" }}>
        <div className="card-header">
          <strong>Mesa cód. </strong>{this.props.num}</div>
        <div className="card-body">
          <h6><strong>Número de votantes</strong></h6>
          <h1 className="card-title">{this.props.numTokens}</h1>
        </div>
        <div className="card-footer">
          <strong>Cuenta: </strong>
          <h6>{this.props.address}</h6>
        </div>
      </div >
    );
  }
}