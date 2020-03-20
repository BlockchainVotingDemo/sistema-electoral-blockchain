import React from 'react';
import WidgetNavBar from '../WidgetNavBar';
import Web3 from 'web3';
import { TODO_LIST_ABI_TABLE, TODO_LIST_ADDRESS_TABLE } from '../../components/abi/configVotingTable';
import { TODO_LIST_ABI_TOKEN, TODO_LIST_ADDRESS_TOKEN } from '../../components/abi/configTokenVoteContract';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

/**
 * Provee al representante de una mesa, una interfaz para autorizar votos a un votante desde la mesa
 */
export default class WidgetTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account: '',
      notificationDOMRef: React.createRef(),
      refAddress: React.createRef(),
      numTokens: 0,
      authorizationStatus: false
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
    const tableContract = new web3.eth.Contract(TODO_LIST_ABI_TABLE, TODO_LIST_ADDRESS_TABLE);

    //Crea uns conexion al contrato TokenVoteContract usando la direccion de este en la blockchain y su interfas ABI
    const tokenVoteContract = new web3.eth.Contract(TODO_LIST_ABI_TOKEN, TODO_LIST_ADDRESS_TOKEN);

    //Se almacena la instancia de los dos contratos en el state de React y ademas una instancia de la libreria Web3js para emplearla posteriormente
    this.setState({ tableContract, tokenVoteContract, web3 });

    //Consulta el numero de tokens que tiene asociados la mesa y para ser presentados a los jurados
    let result = await this.state.tokenVoteContract.methods.balanceOf(TODO_LIST_ADDRESS_TABLE).call({ from: this.state.account });

    //Almacena en el state el numero de tokens que le fueron transferidos a esta mesa en particular
    this.setState({ numTokens: result.balance });

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

  async loadNumberVotes() {
    this.updateSelectedAccount();
    let numVotes = await this.state.tokenVoteContract.methods.balanceOf(TODO_LIST_ADDRESS_TABLE).call({ from: this.state.account });

    this.setState({ numTokens: numVotes });
  }

  /**
   * Autoriza un voto al elector para que este pueda enviarlo a su candidato de preferencia
   */
  async authorize() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {

      //Llama la funcion authorize del contrato VotingTableContract, para que autorizar al elector gastar un token de la mesa
      let result = await this.state.tableContract.methods.authorize().send({ from: this.state.account })
        .once('receipt', (receipt) => {
        });

      //Si el evento AuthorizeVote fue emitido, la autorizacion se realizo correctamente
      if (result.events.AuthorizedVote !== undefined) {
        this.notify("Notificación", "success", result.events.AuthorizedVote.returnValues.msg);
      }

    } catch (error) {
      if (error.message.includes("no está autorizada")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 56, error.message.length - 2));

      } else if (error.message.includes("user denied")) {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");

      } else if (error.message.includes("El proceso electoral aún no ha iniciado")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 42, error.message.length - 2));

      } else {
        this.notify("Error", "danger", error.message);
      }
    }
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div style={{ marginTop: "120px" }}>
        <ReactNotification ref={this.state.notificationDOMRef} />
        <WidgetNavBar title={"Mesa de votación"} />
        <h3 className=" text-center"><strong>Autorización de votos</strong></h3>

        <div className="row mt-5">
          <div className="col-md-8 pl-5">
            <h5 >
              <strong>Cuenta de la mesa: </strong> {TODO_LIST_ADDRESS_TABLE}
            </h5>
          </div>
          <div className="col-md-4">
            <h5 ><strong>Número de votantes pendientes:</strong> {this.state.numTokens}</h5>
          </div>
        </div>

        <button type="button" className="btn btn-primary text-white mt-5 mr-4" style={{ maxWidth: "150px", float: "left", height: "150px", width: "150px", marginLeft: "550px", marginTop: "100px" }} onClick={() =>
          this.authorize()}
        >
          Authorizar voto
          </button>
      </div>
    );
  }
}