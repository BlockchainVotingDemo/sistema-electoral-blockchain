/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';
import candidateImage from '../../../images/candidate.png';

export default class WidgetCandidateConfirmation extends React.Component {

  render() {

    return (
      <div className="m-3"
        style={{ width: "218px", float: "left" }}>
        <div className="card border-primary" >
          <div className="row pb-0">
            <div className="col-md-8 m-0 p-2 text-center" onClick={() => this.selectCandidate()}>
              <img src={candidateImage} className="card-img-top" alt="Candidate" style={{ width: "100px", height: "100px" }} />
            </div>
            <div className="md-col-4 border-left px-4 pt-4">
              <h1 id="changeNumber"></h1>
            </div>
          </div>
          <div className="card-body pb-2 border-top py-1" style={{ height: "60px", width: "218px" }}>
            <p id="changeName" className="text-center"></p>
          </div>
        </div>
      </div >
    );
  }
}
