import React from 'react';
import WidgetCandidate from './WidgetCandidate';
import WidgetNavBar from '../WidgetNavBar';
import { WidgetFooter } from '../WidgetFooter';
import Web3 from 'web3';
import { TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL } from '../../components/abi/configElectoralProcess';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

/**
 * Provee al elector una interfaz mediante la cual se le listan los candidatos y este elige por cual desea votar
 */
export default class WidgetVoting extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      notificationDOMRef: React.createRef(),
      listCandidates: [],
    }
  }

  /**
  * Se ejecuta automaticamente cuando el componente va a ser montado.
  */
  componentWillMount() {
    this.loadBlockchainData();
  }

  /**
  * Esta funcion se encarga de conectarse a la blockchain y tener una conexion para hacerle peticiones.
  */
  async loadBlockchainData() {

    //Obteniendo un proveedor desde Metamask
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

    //Solicitando autorizar el proveedor de Metamask
    window.ethereum.enable();

    //Obteniendo todas las cuentas asociadas a la billetera
    const accounts = await web3.eth.getAccounts();

    //Guarda toda la cuenta desde la cual se hara peticiones, en el state de React
    this.setState({ account: accounts[0] });

    //Crea uns conexion al contrato ElectoralProcessContract usando la direccion de este en la blockchain y su interfas ABI
    const electoralContract = new web3.eth.Contract(TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL);

    //Se almacena la instancia de los dos contratos en el state de React y ademas una instancia de la libreria Web3js para emplearla posteriormente
    this.setState({ electoralContract, web3 });

    //Listar todos los candidatos inscritos en esta jornada electoral
    this.listCandidates();
  }

  /**
  * Permite una notificacion tipo toast en la esquina superior derecha de la pantalla, de manera personalizada usando los tres parametros que recibe la funcion
  *
  * @param {*} _title Titulo que se mostrara en el toast
  * @param {*} _type Tipo de alerta (error, satisfactorio o info)
  * @param {*} _message Mensaje a mostrar al usuario en la alerta
  */
  notify(_title, _type, _message) {
    this.state.notificationDOMRef.current.addNotification({
      title: _title,
      message: _message,
      type: _type,
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 4000 },
      dismissable: { click: true }
    });
  }

  /**
  * Permite actualizar la cuanta actual con la que estara realizando peticiones, de forma automatica y es asignada al state account
  */
  async updateSelectedAccount() {
    const updateAccount = await this.state.web3.eth.getAccounts();
    this.setState({ account: updateAccount[0] });
  }

  updateSelection(id) {

    /* if (this.state.candidateSelected !== '') {
       document.getElementById(this.state.candidateSelected).style.background = "white";
     }
 
     document.getElementById(id).style.background = "#90CAF9";
 
     this.setState({
       candidateSelected: id
     });
     */
  }

  /**
   * Permite listar todos los candidatos por los que el elector puede votar
   */
  async listCandidates() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {

      //Lista de candidatos
      let listCandidates = [];

      //A traves del contrato ElectoralProcessContract se obtiene el numero de candidatos registrados usando la funcion getNumberCandidates
      let numCandidates = await this.state.electoralContract.methods.getNumberCandidates().call({ from: this.state.account });

      //Se itera la cantidad de candidatos para llamarlas una por una usando un indice
      for (let i = 0; i < numCandidates; i++) {

        //Se llama la funcion getCandidate del contrato ElectoralProcessContract y se le pasa el parametro i que indica la posicion del candidato que necesito
        let datos = await this.state.electoralContract.methods.getCandidate(i).call({ from: this.state.account })

        //Aniade el candidato al array de candidatos
        listCandidates.push({
          "address": datos[0],
          "name": datos[1],
          "cardNumber": datos[2]
        });
      }

      //Se actualiza la lista de candidatos en el state de React
      this.setState({
        listCandidates: listCandidates
      });

      //Notifica que se ha listado correctamente todos los candidatos
      this.notify("Notificación", "success", "Se ha terminado de listar los candidatos.");

    } catch (error) {
      this.notify("Error", "danger", error.message);
    }
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    let updateSelect = this.updateSelection.bind(this);
    let jsonCandidate = this.state.jsonCandidate;
    return (
      <div >
        <ReactNotification ref={this.state.notificationDOMRef} />
        <WidgetNavBar title={"Consulta de opinión"} />
        <div className="candidateRow pl-5 px-5 mt-4 pt-5">
          {
            this.state.listCandidates.map(function (candidate) {
              return <WidgetCandidate key={"candidate" + candidate.cardNumber} name={candidate.name} cardNumber={candidate.cardNumber} address={candidate.address} updateSelection={updateSelect} id={"candidate" + candidate.cardNumber} jsonCandidate={jsonCandidate} />
            })
          }
        </div>
        <WidgetFooter />
      </div>
    );
  }
}
