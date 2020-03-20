import React from 'react';
import Web3 from 'web3';
import { TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL } from '../../abi/configElectoralProcess';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

/**
 * Componente que le permite al usuario aniadir una mesa al contrato ElectoralProcessContract para poder ser usada durante la jornada electoral
 */
export default class WidgetAddTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      refCode: React.createRef(),
      refAddress: React.createRef(),
      code: "",
      address: "",
      notificationDOMRef: React.createRef()
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

    //Crea uns conexion al contrato usando la direccion de este en la blockchain y su interfas ABI
    const electoralContract = new web3.eth.Contract(TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL);

    //Se guarda la instancia del contrato obtenida y una instancia de la libreria web3js para futuras peticiones
    this.setState({ electoralContract, web3 });
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
   * Permite aniadir una nueva mesa a la blockchain, a partir de los datos ingresados por el usuario usando los campos de texto
   */
  async addTable() {

    //Comprueba que los campos no esten vacios
    if (this.state.code === '' || this.state.address === '') {
      this.notify("Advertencia", "warning", "Alguno de los campos están vacíos.");
      return;
    }

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    //Se llama al metodo addTable del contrato ElectoralProcessContract y se le pasa los datos de la mesa que se desea aniadir
    try {
      let result = await this.state.electoralContract.methods.addTable(this.state.code, this.state.address).send({ from: this.state.account })
        .once('receipt', (receipt) => {
        });

      //Si se ha disparado el evento VotingTableAdded es porque todo se guardo exitosamente
      if (result.events.VotingTableAdded !== undefined) {
        this.notify("Notificación", "success", result.events.VotingTableAdded.returnValues.msg);
      }

      //Limpia los campos del state
      this.setState({ code: "", address: "" });

      //Limpia los widgets de texto
      this.cancel();

    } catch (error) {
      if (error.message.includes("está autorizado")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 58, error.message.length - 2));

      } else if (error.message.includes("user denied")) {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");

      } else if (error.message.includes("El modo registro de mesas de votación no está activo.")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 53, error.message.length - 2));

      } else if (error.message.includes("La mesa de votación ya existe.")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 30, error.message.length - 2));

      } else {
        this.notify("Error", "danger", error.message);
      }
    }
  }

  //Limpia los campos para registrar un nuevo candidato
  cancel() {
    this.setState({
      code: "",
      address: ""
    });
  }

  /**
  * Permite actualizar el nombre del candidato, direccion y numero del tarjeton, cada vez que se pulsa una tecla sobre alguno de los campos de texto
  */
  update() {
    this.setState({
      code: this.state.refCode.current.value,
      address: this.state.refAddress.current.value
    })
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div>
        <ReactNotification ref={this.state.notificationDOMRef} />
        <h4 style={{ marginLeft: "30px", marginTop: "50px" }}>Añadir mesas de votación</h4>
        <form style={{ marginLeft: "320px", marginTop: "70px" }}>
          <div className="form-group row">
            <label htmlFor="inputCode" className="col-sm-2 col-form-label">Código:</label>
            <div className="col-sm-10">
              <input type="text" ref={this.state.refCode} className="form-control ml-4" id="inputCode" placeholder="Código" value={this.state.code} onChange={() => this.update()} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="inputAddress" className="col-sm-2 col-form-label">Cuenta:</label>
            <div className="col-sm-10">
              <input type="text" ref={this.state.refAddress} className="form-control ml-4" id="inputAddress" placeholder="Cuenta" value={this.state.address} onChange={() => this.update()} />
            </div>
          </div>
          <div className="form-group row">
            <button className="btn btn-secondary mb-2" style={{ marginLeft: "250px" }} onClick={() => this.cancel()}>Cancelar</button>
            <button className="btn btn-primary mb-2" style={{ marginLeft: "10px" }} onClick={() => this.addTable()}>Salvar</button>
          </div>
        </form>
      </div>
    );
  }
}
