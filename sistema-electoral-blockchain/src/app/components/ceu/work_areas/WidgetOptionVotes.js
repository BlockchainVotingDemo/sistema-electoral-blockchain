import React from 'react';

/**
 * Componente que permite ser reutilizado y es empleado para items de un combobox, para listar las mesas cuando se les va a transferir tokens
 */
export default class WidgetOptionVotes extends React.Component {

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
      <option onClick={() => { this.props.updateSelectTable(this.props.address) }} >Mesa {this.props.codeTable}</option>
    );
  }
}