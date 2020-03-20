import React from 'react';
import candidateImage from '../../../../images/candidate.png';

/**
 * Permite la reutilizacion de este componente (Tarjeta candidato) para listar los diferentes candidatos por el CEU, luego de haber finalizado la votacion
 */
export default class WidgetItemCandidateResult extends React.Component {

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div id={"candidate" + this.props.cardNumber} className="m-3"
        style={{ width: "218px", float: "left" }}>
        <div className="card border-primary" >
          <div className="row pb-0">
            <div className="col-md-7 m-0 p-2 text-center">
              <img src={candidateImage} className="card-img-top" alt="Candidate" style={{ width: "100px", height: "100px" }} />
            </div>
            <div className="md-col-5 border-left ml-2 px-4 pt-4">
              <h1 >{this.props.cardNumber}</h1>
            </div>
          </div>
          <div className="card-body pb-2 border-top py-1" style={{ height: "140px", width: "230px" }}>
            <p className="text-center">{this.props.name}</p>
            <p className="text-center">
              <strong>Cuenta: </strong>
              {this.props.address}</p>
          </div>
          <div className="card-footer pb-0">
            <p className="text-center">
              <strong>Núm. votos: </strong>{this.props.numVotes}</p>
          </div>
        </div>
      </div >
    );
  }
}
