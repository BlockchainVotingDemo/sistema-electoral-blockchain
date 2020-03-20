/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import "../styles/sidebar.css";
import { TypeSelection } from "./TypeSelection";
var $ = require("jquery");

/**
 * Barra lateral que contiene todas las acciones que puede realizar el actor del CEU y que se encuentra desplegado en el lado izquierdo de la pantalla
 */
export class WidgetSideBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  /**
   * Cambia el estado de oculto a desplegado de este panel lateral de opciones
   */
  componentDidMount() {
    $("#wrapper").toggleClass("toggled");
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div id="wrapper" >
        <div id="sidebar-wrapper">
          <ul className="sidebar-nav">
            <li className="text-center">
              <div style={{ paddingTop: "50px", marginBottom: "40px" }}>
                <img
                  style={{ width: "70px", height: "70px" }}
                  src={require("../../../images/logo-UQ.png")}
                  alt="Logo"
                />
              </div>
            </li>
            <li>
              <a href="#" onClick={() => { this.props.refreshSelection(TypeSelection.MANAGEMENT) }}>Gestionar proceso electoral</a>
            </li>
            <li>
              <a href="#" onClick={e => { this.props.refreshSelection(2) }}>Añadir mesa de votación</a>
            </li>
            <li>
              <a href="#" onClick={() => { this.props.refreshSelection(TypeSelection.ADD_CANDIDATE) }}>Añadir candidato</a>
            </li>
            <li >
              <a href="#" onClick={() => { this.props.refreshSelection(TypeSelection.LIST_TABLES) }}>Listar mesas de votación</a>
            </li>
            <li>
              <a href="#" onClick={() => { this.props.refreshSelection(TypeSelection.LIST_CANDIDATES) }}>Listar candidatos</a>
            </li>
            <li>
              <a href="#" onClick={() => { this.props.refreshSelection(TypeSelection.TRANSFER_TOKENS) }}>Autorizar votos por mesa</a>
            </li>
            <li>
              <a href="#" onClick={() => { this.props.refreshSelection(TypeSelection.SHOW_RESULTS) }}>Consultar resultados</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
