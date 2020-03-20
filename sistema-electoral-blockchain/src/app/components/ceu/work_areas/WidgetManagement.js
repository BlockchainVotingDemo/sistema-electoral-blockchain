import React from 'react';
import Web3 from 'web3';
import { TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL } from '../../abi/configElectoralProcess';
import { TODO_LIST_ABI_TABLE, TODO_LIST_ADDRESS_TABLE } from '../../abi/configVotingTable';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
require('events').EventEmitter.defaultMaxListeners = 15;

/**
 * Este componente permite poner a disposicion del usuario, los diferentes botones con las diferentes opciones que el CEU puede hacer para gestionar la jornada electoral
 */
export default class WidgetManagement extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      notificationDOMRef: React.createRef(),
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
    this.setState({ electoralContract });

    //Crea uns conexion al contrato VotingTableContract usando la direccion de este en la blockchain y su interfas ABI
    const tableContract = new web3.eth.Contract(TODO_LIST_ABI_TABLE, TODO_LIST_ADDRESS_TABLE);

    //Se almacena la instancia de los dos contratos en el state de React y ademas una instancia de la libreria Web3js para emplearla posteriormente
    this.setState({ tableContract, web3 });
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

  /**
   * Permite habilitar el modo registro de mesas en la blockchain
   */
  async enableRecordModeTables() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {
      //Se llama la funcion enableRecordModeTable del contrato ElectoralProcessContract para intentar habilitar esta modo de registro
      let result = await this.state.electoralContract.methods.enableRecordModeTables().send({ from: this.state.account })
        .once('receipt', (receipt) => {
        });

      //Si se ha disparado el evento EnableRecordModeTables es porque el modo registro de mesas fue activado correctamente
      if (result.events.EnableRecordModeTables !== undefined) {
        this.notify("Notificación", "success", result.events.EnableRecordModeTables.returnValues.msg);
      }

    } catch (error) {
      if (error.message.includes("está")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 44, error.message.length - 2));

      } else {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");
      }
    }
  }

  /**
   * Permite deshabilitar el modo registro de mesas
   */
  async disableRecordModeTables() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {
      //Se llama la funcion disableRecordModeTables del contrato ElectoralProcessContract para intentar deshabilitar esta modo de registro
      let result = await this.state.electoralContract.methods.disableRecordModeTables().send({ from: this.state.account })
        .once('receipt', (receipt) => {
        });

      //Si se ha disparado el evento DisableRecordModeTables es porque el modo registro de mesas fue desactivado correctamente
      if (result.events.DisableRecordModeTables !== undefined) {
        this.notify("Notificación", "success", result.events.DisableRecordModeTables.returnValues.msg);
      }

    } catch (error) {
      if (error.message.includes("está")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 58, error.message.length - 2));

      } else {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");
      }
    }
  }

  /**
   * Permite habilitar el modo registro de candidatos
   */
  async enableRecordeModeCandidate() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {
      //Se llama la funcion enableRecordeModeCandidate del contrato ElectoralProcessContract para intentar habilitar el modo registro de candidatos
      let result = await this.state.electoralContract.methods.enableRecordeModeCandidate().send({ from: this.state.account })
        .once('receipt', (receipt) => {
        });

      //Si se ha disparado el evento CandidateRegistrationModeEnabled es porque el modo registro de candidatos fue activado correctamente
      if (result.events.CandidateRegistrationModeEnabled !== undefined) {
        this.notify("Notificación", "success", result.events.CandidateRegistrationModeEnabled.returnValues.msg);
      }

    } catch (error) {

      if (error.message.includes("El sistema está en modo registro de mesas.")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 44, error.message.length - 2));

      } else if (error.message.includes("está")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 58, error.message.length - 2));

      } else if (error.message.includes("user denied")) {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");

      } else {
        this.notify("Error", "danger", error.message);
      }
    }
  }

  async disableRecordModeCandidate() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {
      //Se llama la funcion disableRecordModeCandidate del contrato ElectoralProcessContract para intentar deshabilitar esta modo de registro
      let result = await this.state.electoralContract.methods.disableRecordModeCandidate().send({ from: this.state.account })
        .once('receipt', (receipt) => {
        });

      //Si se ha disparado el evento CandidateRegistrationModeDisabled es porque el modo registro de candidatos fue desactivado exitosamente
      if (result.events.CandidateRegistrationModeDisabled !== undefined) {
        this.notify("Notificación", "success", result.events.CandidateRegistrationModeDisabled.returnValues.msg);
      }

    } catch (error) {
      if (error.message.includes("está")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 58, error.message.length - 2));

      } else {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");
      }
    }
  }

  async enableElectoralProcess() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {
      //Se llama la funcion enableElectoralProcess del contrato ElectoralProcessContract para intentar habilitar el modo proceso electoral activo
      let result = await this.state.electoralContract.methods.enableElectoralProcess().send({ from: this.state.account })
        .once('receipt', (receipt) => {
        });

      //Si se ha disparado el evento ElectoralProcessStarted es porque el proceso electoral inicio exitosamente
      if (result.events.ElectoralProcessStarted !== undefined) {
        this.notify("Notificación", "success", result.events.ElectoralProcessStarted.returnValues.msg);
      }

    } catch (error) {
      if (error.message.includes("está")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 58, error.message.length - 2));

      } else {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");
      }
    }
  }

  async endElectoralProcess() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {
      //Se llama la funcion endElectoralProcess del contrato ElectoralProcessContract para intentar deshabilitar el modo proceso electoral
      let result = await this.state.electoralContract.methods.endElectoralProcess().send({ from: this.state.account })
        .once('receipt', (receipt) => {
        });

      //Si se ha disparado el evento ElectoralProcessFinished es porque el proceso electoral finalizo exitosamente
      if (result.events.ElectoralProcessFinished !== undefined) {
        this.notify("Notificación", "success", result.events.ElectoralProcessFinished.returnValues.msg);
      }

    } catch (error) {
      if (error.message.includes("está")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 58, error.message.length - 2));

      } else if (error.message.includes("user denied")) {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");

      } else {
        this.notify("Error", "danger", error.message);
      }
    }
  }

  async enablePublicScrutiny() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {

      //Se llama la funcion enablePublicScrutiny del contrato ElectoralProcessContract para intentar habilitar el modo de escrutinio publico
      let result = await this.state.electoralContract.methods.enablePublicScrutiny().send({ from: this.state.account })
        .once('receipt', (receipt) => {
        });

      //console.log("Eventos de escrutinio público: " + result.events);

      //Si se ha disparado el evento PublicScrutinyEnabled es porque el proceso de escrutinio publico inicio exitosamente
      if (result.events.PublicScrutinyEnabled !== undefined) {
        this.notify("Notificación", "success", result.events.PublicScrutinyEnabled.returnValues.msg);
      }

    } catch (error) {
      if (error.message.includes("está")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 58, error.message.length - 2));

      } else {
        this.notify("Notificación", "info", error.message);
      }
    }
  }

  render() {
    return (
      <div style={{ marginLeft: "245px" }}>
        <ReactNotification ref={this.state.notificationDOMRef} />
        <h4 className="ml-3 mt-1">Gestión del proceso electoral</h4>
        <div className=" text-center" style={{ height: "150px", width: "1105px", marginTop: "120px" }}>
          <button type="button" className="btn btn-primary text-white mt-4 mr-4" style={{ maxWidth: "100px", float: "left" }} onClick={() =>
            this.enableRecordModeTables()}
          >
            Iniciar registro de mesas
          </button>

          <button type="button" className="btn btn-primary text-white mt-4 mx-4" style={{ maxWidth: "100px", float: "left" }} onClick={() => this.disableRecordModeTables()}>
            Terminar registro de mesas
          </button>

          <button type="button" className="btn btn-primary text-white mt-4 mx-4" style={{ maxWidth: "100px", float: "left" }} onClick={() => this.enableRecordeModeCandidate()}>
            Iniciar registro candidatos
          </button>

          <button type="button" className="btn btn-primary text-white mt-4 mx-4" style={{ maxWidth: "100px", float: "left" }} onClick={() => this.disableRecordModeCandidate()}>
            Terminar registro candidatos
          </button>

          <button type="button" className="btn btn-primary text-white mt-4 mx-4" style={{ maxWidth: "100px", float: "left" }} onClick={() => this.enableElectoralProcess()}>
            Iniciar proceso electoral
            </button>

          <button type="button" className="btn btn-primary text-white mt-4 mx-4" style={{ maxWidth: "100px", float: "left" }} onClick={() => this.endElectoralProcess()}>
            Terminar proceso electoral
          </button>

          <button type="button" className="btn btn-primary text-white mt-4 mx-4" style={{ maxWidth: "100px", float: "left" }} onClick={() => this.enablePublicScrutiny()}>
            Habilitar escrutinio público
          </button>
        </div>
      </div >
    );
  }
}
