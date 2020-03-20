import React from 'react';

/**
 * Componente destinado a servir de objeto para listar todas las mesas en el componente (WidgetAudit)
 */
export default class WidgetOption extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <option onClick={() => { this.props.loadTable(this.props.address) }} >Mesa {this.props.codeTable}</option>
    );
  }
}