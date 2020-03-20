/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import logoUQ from '../../images/logo-UQ.png';


/**
 * Componente pensado para mostrar una barra de navegacion al usuario en la pagina web
 */
export default class WidgetNavBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand ml-4" href="#">
          <h4>Voting App</h4>
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ">
            <div className="row">
              <div className="md-col-10 py-1 text-center" style={{ marginLeft: "300px" }}>
                <a className="nav-item nav-link text-white " href="#">
                  <h5 className="text-center">{this.props.title} - Universidad del Quindío</h5>
                </a>
              </div>
              <div className="md-col-2">
                <img src={logoUQ} className="card-img-top" alt="Candidate" style={{ width: "55px", height: "55px", marginLeft: "320px" }} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}