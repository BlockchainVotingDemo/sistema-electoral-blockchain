import React from 'react';

/**
 * Componente que se muestra como el footer de la pagina web
 */
export class WidgetFooter extends React.Component {

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div className="footer fixed-bottom bg-dark pt-2 text-center text-white mt-4" style={{ height: "40px" }} >
        2019
      </div>
    );
  }
}