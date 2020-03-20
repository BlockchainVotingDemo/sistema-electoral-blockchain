import React from 'react';
import Web3 from 'web3';
import { TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL } from '../../abi/configElectoralProcess';
import { TODO_LIST_ABI_TOKEN, TODO_LIST_ADDRESS_TOKEN } from '../../abi/configTokenVoteContract';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import WidgetOptionVotes from './WidgetOptionVotes';

/**
 * Componente que permite al CEU realizar transferencia de tokens (autorizacion de votos) a una mesa particular que se encuentre registrada, de manera individual.
 */
export default class WidgetTransferTokens extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      notificationDOMRef: React.createRef(),
      listTables: [],
      refNumTokens: React.createRef(),
      numTokens: '',
      selectedTable: '0x0000000000000000000000000000000000000000'
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

    //Crea uns conexion al contrato TokenVoteContract usando la direccion de este en la blockchain y su interfas ABI
    const tokenContract = new web3.eth.Contract(TODO_LIST_ABI_TOKEN, TODO_LIST_ADDRESS_TOKEN);

    //Se almacena la instancia de los dos contratos en el state de React y ademas una instancia de la libreria Web3js para emplearla posteriormente
    this.setState({ electoralContract, tokenContract, web3 });

    //Lista las diferentes mesas
    this.listTables();
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
  * Permite listar las diferentes mesas que se tienen en la blockchain, por lo que se conecta a los respectivos contratos para hacer peticiones de consulta
  */
  async listTables() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {
      //Array de mesas
      let listTables = [];

      //A traves del contrato ElectoralProcessContract se obtiene el numero de mesas registradas usando la funcion getNumberTables
      let numTables = await this.state.electoralContract.methods.getNumberTables().call({ from: this.state.account });

      //Se itera la cantidad de mesas para llamarlas una por una usando un indice
      for (let i = 0; i < numTables; i++) {

        //Se llama la funcion getTable del contrato VotingTableContract y se le pasa el parametro i que indica la posicion de la mesa que necesito
        let datos = await this.state.electoralContract.methods.getTable(i).call({ from: this.state.account })

        //Agrega la mesa al array de mesas
        listTables.push({
          "address": datos[0],
          "code": datos[1]
        });
      }

      //Asigna la lista de mesas al array de mesas del state de React
      this.setState({
        listTables: listTables
      });

    } catch (error) {
      this.notify("Error", "danger", error.message);
    }
  }

  //Actualiza la cantidad de tokens que el usuario ingresa en el state de React para ser usados posteriormente
  update() {
    this.setState({
      numTokens: this.state.refNumTokens.current.value,
    })
  }

  //Obtiene la direccion de la mesa que fue seleccionada y la guarda en el state de React
  updateSelectTable(address) {
    this.setState({ selectedTable: address })
  }

  /**
   * Autorizar la transferencia de los tokens a la mesa
   */
  async authorize() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {

      //Se hace una peticion al contrato TokenVoteContract, de transferir una cierta cantidad de tokens de una cuent a otra (que es la mesa)
      let result = await this.state.tokenContract.methods.transfer(this.state.selectedTable, this.state.numTokens).send({ from: this.state.account }).once('receipt', (receipt) => {
      });

      //Pregunta si se realizo la transferencia correctamente
      if (result) {

        // Notifica que la transferencia fue realizada correctamente
        this.notify("Notificación", "success", "La autorización de votos se ha realizado exitosamente.");
        this.setState({ code: "", address: "" });

      } else {
        //Notifica que la transferencia de tokens a la mesa fallo
        this.notify("Notificación", "danger", "La autorización de votos falló.");
      }

    } catch (error) {
      if (error.message.includes("está autorizado")) {
        this.notify("Error", "danger", error.message.substring(error.message.length - 58, error.message.length - 2));

      } else if (error.message.includes("user denied")) {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");

      } else {
        this.notify("Error", "danger", error.message);
      }
    }
    this.cancel();
  }

  /**
   * Permite limpiar las variables numTokens y selectedTable del state de React, para poder transferir tokens a una nueva mesa. Este cambio se vera reflejado en los widgets vacios tambien
   */
  cancel() {
    this.setState({
      numTokens: '',
      selectedTable: '0x0000000000000000000000000000000000000000'
    });

    document.forms['mi_Form']['listMesasTransfer'].value = 'default';
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    let updateSelectTable = this.updateSelectTable.bind(this);
    return (
      <div style={{ marginLeft: "250px" }}>
        <ReactNotification ref={this.state.notificationDOMRef} />
        <h4 className="ml-1">Autorizar una cantidad de votos por mesa</h4>
        <div className="ml-3 pt-3" style={{ width: "900px", marginTop: "50px" }}>
          <div className="row">
            <div className="col-md-1">
              <h5 className="mt-1">Mesa:</h5>
            </div>
            <div className="col-md-5">
              <form name='mi_Form' >
                <select name="listMesasTransfer" className="custom-select" id="inputGroupSelect02">
                  <option value="default" key="SeleccioneUnaMesa" defaultValue onClick={() => this.cancel()}>Seleccione una mesa</option>
                  {
                    this.state.listTables.map(function (table) {
                      return <WidgetOptionVotes key={"tableTransfer" + table.code} updateSelectTable={updateSelectTable} codeTable={table.code} address={table.address} />
                    })
                  }
                </select>
              </form>
            </div>
            <div className="col-md-6 p-0">
              <h6>Cuenta: {this.state.selectedTable}</h6>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-1">
              <h5 className="mt-1">Votos:</h5>
            </div>
            <div className="col-md-5">
              <input type="text" ref={this.state.refNumTokens} className="form-control " id="inputName" placeholder="Ingrese la cantidad de votos autorizados" value={this.state.numTokens} onChange={() => this.update()} />
            </div>
          </div>
          <div className="row mt-3">
            <button className="btn btn-secondary mb-2" style={{ marginLeft: "250px" }} onClick={() => this.cancel()}>Cancelar</button>
            <button className="btn btn-primary mb-2" style={{ marginLeft: "10px" }} onClick={() => this.authorize()}>Salvar</button>
          </div>
        </div>
      </div>
    );
  }
}