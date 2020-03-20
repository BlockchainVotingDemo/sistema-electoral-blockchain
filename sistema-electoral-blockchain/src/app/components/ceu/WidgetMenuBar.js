import * as React from 'react';
var $ = require('jquery');

/**
 * Barra de menu de la pagina web
 */
export class WidgetMenuBar extends React.Component {

  /**
   * Una vez este componente se ha montado, oculta el componente WidgetMenuBar, que es el panel que contiene las acciones disponibles para el CEU, ubicado en el lado izquierdo
   */
  componentDidMount() {
    $("#wrapper").toggleClass("toggled");
    $("#wrapper").toggleClass("toggled");
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <ul className="nav nav-pills" style={{ height: "20px", marginTop: "14px" }}>
        <li className="nav-item dropdown py-0">
          <a className="nav-link dropdown-toggle py-0" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Archivo</a>
          <div className="dropdown-menu">
            <a className="dropdown-item" data-toggle="modal" href="#modalCrearExamen">Crear examen</a>
            <a className="dropdown-item" data-toggle="modal" href="#exampleModalCenter">Nuevo examen</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">Save</a>
            <a className="dropdown-item" href="#">Save as</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">Close</a>
          </div>
        </li>
        <li className="nav-item  py-0">
          <a className="nav-link dropdown-toggle py-0" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">About</a>
          <div className="dropdown-menu">
            <a className="dropdown-item" data-toggle="modal" href="#modalAbout">Sistema de gestión de notas</a>
          </div>
        </li>
      </ul>
    );
  }
}
