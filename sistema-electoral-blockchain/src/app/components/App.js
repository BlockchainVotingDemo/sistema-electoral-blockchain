import React from 'react';

/**
 * Ese componente encierra a toda la aplicacion, sirve de base para montar todo el resto de componentes
 */
export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      accounts: null,
      contract: null,
      storageValue: 0,
      web3: null
    }
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    const { children } = this.props
    return (
      <div>
        {children}
      </div>
    );
  }
}
