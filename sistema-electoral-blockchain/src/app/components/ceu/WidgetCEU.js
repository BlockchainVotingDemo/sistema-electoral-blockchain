import React from 'react';
import WidgetNavBar from '../WidgetNavBar';
import { WidgetFooter } from '../WidgetFooter';
import { WidgetSideBar } from './WidgetSideBar';
import WidgetWorkArea from './WidgetWorkArea';
import { TypeSelection } from './TypeSelection';

/**
 * Pagina principal para el actor CEU, el cual contiene las diferentes acciones que este puede realizar sobre el proceso electoral. Es la primera pagina que aparece cuando se entra al actor del CEU
 */
export default class WidgetCEU extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      refreshSelection: false,
      currentSelection: TypeSelection.MANAGEMENT,
      stateConection: false
    }

    this.refreshSelection = this.refreshSelection.bind(this);
  }

  /**
   * Permite conocer cual fue la opcion seleccionada por el actor del CEU, para ser renderizada en la pagina, esta opcion la recibe a traves del parametro option, dada por el boton seleccionado
   * 
   * @param {*} option 
   */
  refreshSelection(option) {
    this.setState({
      currentSelection: option,
      refreshSelection: true
    });
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div>
        <WidgetNavBar title={"CEU"} />
        <div className="row">
          <div className="col-md-2">
            <WidgetSideBar refreshSelection={this.refreshSelection} />
          </div>
          <div className="md-col-10 pl-5 pt-5 mt-5">
            <WidgetWorkArea show={this.state.currentSelection} />
          </div>
        </div>
        <WidgetFooter />
      </div>
    );
  }
}
