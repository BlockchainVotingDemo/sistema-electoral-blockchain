/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';
import { Link } from 'react-router-dom';
import WidgetNavBar from './WidgetNavBar';
import { WidgetFooter } from './WidgetFooter';

/**
 * Componente definido como la pagina principal de la aplicacion, y contiene a todos los roles y servicios que se puede consumir
 */
export default class WidgetHome extends React.Component {

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div>
        <WidgetNavBar title={"Proceso electoral"} />
        <div className="home" >
          <div className="border p-3 mx-auto" style={{ width: "980px", height: "200px" }}>
            <div className="card text-center floatLeft  mt-2" style={{ width: "150px" }}>
              <div className="card-header">
                Votar
            </div>
              <div className="card-body">
                <h5 className="card-title"></h5>
                <p className="card-text">
                </p>
                <Link to="/votar" className="btn btn-primary widthButton">Ir</Link>
              </div>
            </div>

            <div className="card text-center floatLeft ml-5 mt-2" style={{ width: "150px" }}>
              <div className="card-header">
                Mesa
            </div>
              <div className="card-body">
                <h5 className="card-title"></h5>
                <p className="card-text">
                </p>
                <Link to="/mesa" className="btn btn-primary widthButton">Ir</Link>
              </div>
            </div>

            <div className="card text-center floatLeft  ml-5 mt-2" style={{ width: "150px" }}>
              <div className="card-header">
                CEU
            </div>
              <div className="card-body">
                <h5 className="card-title"></h5>
                <p className="card-text">
                </p>
                <Link to="/ceu" className="btn btn-primary widthButton">Ir</Link>
              </div>
            </div>

            <div className="card text-center floatLeft  ml-5 mt-2" style={{ width: "150px" }}>
              <div className="card-header">
                Resultados
            </div>
              <div className="card-body">
                <h5 className="card-title"></h5>
                <p className="card-text">
                </p>
                <Link to="/resultados" className="btn btn-primary widthButton">Ir</Link>
              </div>
            </div>

            <div className="card text-center floatLeft ml-5 mt-2" style={{ width: "150px" }}>
              <div className="card-header">
                Auditar
            </div>
              <div className="card-body">
                <h5 className="card-title"></h5>
                <p className="card-text">
                </p>
                <Link to="/auditar" className="btn btn-primary widthButton">Ir</Link>
              </div>
            </div>

          </div>
        </div>
        <WidgetFooter />
      </div>
    );
  }
} 