import * as React from 'react';

/**
 * Componente que es desplegado cuando en el routing no se encuentra registrada una direccion ingresada por el usuario
 */
export default class Page404 extends React.Component {

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div>
        <h4>Página no encontrada</h4>
      </div>
    );
  }
}