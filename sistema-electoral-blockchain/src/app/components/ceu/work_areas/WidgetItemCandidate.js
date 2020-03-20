import React from 'react';
import candidateImage from '../../../../images/candidate.png';

export default class WidgetItemCandidate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

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
          <div className="card-body pb-2 border-top py-1" style={{ height: "60px", width: "218px" }}>
            <p className="text-center">{this.props.name}</p>
          </div>
          <div className="card-body pb-4" style={{ height: "130px", width: "218px" }}>
            <p className="text-center">
              <strong>Cuenta: </strong>{this.props.address}</p>
          </div>
        </div>
      </div >
    );
  }
}
