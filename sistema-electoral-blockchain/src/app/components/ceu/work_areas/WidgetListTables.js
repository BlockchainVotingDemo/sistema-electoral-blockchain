import React from 'react';
import Web3 from 'web3';
import { TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL } from '../../abi/configElectoralProcess';
import { TODO_LIST_ABI_TOKEN, TODO_LIST_ADDRESS_TOKEN } from '../../abi/configTokenVoteContract';
import WidgetItemTable from './WidgetItemTable';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

/**
 * Este componente crea una seccion donde se listaran todas las mesas que se han registrado.
 */
export default class WidgetListTables extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      notificationDOMRef: React.createRef(),
      listTables: []
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
    const voteContract = new web3.eth.Contract(TODO_LIST_ABI_TOKEN, TODO_LIST_ADDRESS_TOKEN);

    //Se almacena la instancia de los dos contratos en el state de React y ademas una instancia de la libreria Web3js para emplearla posteriormente
    this.setState({ electoralContract, voteContract, web3 });

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

        //Se llama la funcion getTable del contrato ElectoralProcessContract y se le pasa el parametro i que indica la posicion de la mesa que necesito
        let datos = await this.state.electoralContract.methods.getTable(i).call({ from: this.state.account });

        //Se llama la funcion balanceOf del contrato VotingTableContract para conocer el balance (Tokens - num votantes) que esta tiene asociados
        let numTokens = await this.state.voteContract.methods.balanceOf(datos[0]).call({ from: this.state.account });

        //Se agrega la mesa
        listTables.push({
          "address": datos[0],
          "code": datos[1],
          "numTokens": numTokens.balance
        });
      }

      //Se actualiza la lista de mesas en el state de React
      this.setState({
        listTables: listTables
      });

      //Notifica que se ha listado correctamente todas las mesas de votacion
      this.notify("Notificación", "success", "Se ha terminado de listar todas las mesas de votación.");

    } catch (error) {
      this.notify("Error", "danger", error.message);
    }
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div style={{ marginLeft: "30px" }}>
        <ReactNotification ref={this.state.notificationDOMRef} />
        <h4 className="ml-4 mt-0 mb-4">Lista de mesas de votación inscritas</h4>
        {
          this.state.listTables.map(function (table) {
            return <WidgetItemTable key={table.code} num={table.code} address={table.address} numTokens={table.numTokens} />
          })
        }
      </div>
    );
  }
}