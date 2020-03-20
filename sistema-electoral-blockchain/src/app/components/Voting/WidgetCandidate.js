import React from 'react';
import candidateImage from '../../../images/candidate.png';
import Web3 from 'web3';
import { TODO_LIST_ABI_TABLE, TODO_LIST_ADDRESS_TABLE } from '../../components/abi/configVotingTable';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

/**
 * Este componente es empleado como un objeto para crear candidatos que seran mostrados en la seccion empleada por el usuario para votar
 */
export default class WidgetCandidate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      notificationDOMRef: React.createRef(),
      account: ""
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

    //Crea uns conexion al contrato VotingTableContract usando la direccion de este en la blockchain y su interfas ABI
    const votingContract = new web3.eth.Contract(TODO_LIST_ABI_TABLE, TODO_LIST_ADDRESS_TABLE);
    this.setState({ votingContract, web3 });
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


  selectCandidate() {
    /*this.state.refBackground.current.style.background = "#90CAF9";
    this.props.updateSelection(this.props.id);
    this.state.refImage.current.style.background = "#90CAF9";
    this.state.refName.current.style.background = "#90CAF9";
    this.state.refNumero.current.style.background = "#90CAF9";
    document.getElementById("changeName").innerHTML = this.props.name
    document.getElementById("changeNumber").innerHTML = this.props.cardNumber*/
  }

  /**
   * Permite votar por el candidato que el votante ha seleccionado como de su preferencia
   */
  async voting() {

    //Pregunta al usuario si confirma votar por este candidato
    let option = window.confirm("¿Confirma que desea votar por el candidato " + this.props.name + " que tiene el tarjetón número " + this.props.cardNumber + "?");

    //Si no selecciono alguna de las opciones, se sale del metodo
    if (!option) {
      return;
    }

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    //Empleada para guardar la respuesta que envia el contrato VotingTableContract desde la blockchain
    let result;

    try {

      //Envia la transaccion para votar y lo hace llamando al metodo voting del contrato VotingTableContract
      result = await this.state.votingContract.methods.voting(this.props.address).send({ from: this.state.account })
        .once('receipt', (receipt) => {
        });

      //Si el evento recibido es SaveVote, indica que la transaccion hizo lo que se le pidio
      if (result.events.SavedVote !== undefined) {
        this.notify("Notificación", "success", result.events.SavedVote.returnValues.msg);
      }

    } catch (error) {
      if (error.message.includes("no está autorizada")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 58, error.message.length - 2));

      } else if (error.message.includes("user denied")) {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");

      } else if (error.message.includes("[ethjs-rpc]")) {
        this.notify("Información", "info", "El voto aún no ha sido autorizado por la mesa.");

      } else if (error.message.includes("El voto aún no ha sido autorizado por la mesa de votación")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 59, error.message.length - 2));

      } else if (error.message.includes("El proceso electoral aún no ha iniciado.")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 40, error.message.length - 2));

      } else if (result === undefined) {
        this.notify("Error", "danger", error.message);

      } else if (result.events.UnregisteredCandidate === undefined) {
        this.notify("Error", "danger", error.message);

      } else {
        this.notify("Error", "danger", result.events.UnregisteredCandidate.returnValues.msg);
      }
    }
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div className="p-3 mt-3" id={this.props.id}
        style={{ float: "left" }}>
        <ReactNotification ref={this.state.notificationDOMRef} />
        <div className="card border-primary" >
          <div className="row pb-0">
            <div className="col-md-8 m-0 p-2 text-center" onClick={() => this.selectCandidate()} >
              <img src={candidateImage} className="card-img-top" alt="Candidate" style={{ width: "100px", height: "100px" }} />
            </div>
            <div className="md-col-4 border-left px-4 pt-4" onClick={() => this.selectCandidate()} >
              <h1 >{this.props.cardNumber}</h1>
            </div>
          </div>
          <div className="card-body pb-2 border-top py-1" style={{ height: "60px", width: "218px" }} onClick={() => this.selectCandidate()} >
            <p className="text-center">{this.props.name}</p>
          </div>
          <div className="card-footer text-center" style={{ width: "218px" }} >
            <button type="button" className="btn btn-primary"
              //data-toggle="modal" 
              onClick={() => { this.voting() }}
            //data-target="#modalAcceptVoteCand"
            >Votar</button>
          </div>
        </div>
      </div >
    );
  }
}
