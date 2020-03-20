import React from 'react';
import WidgetNavBar from '../WidgetNavBar';
import Web3 from 'web3';
import { TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL } from '../../components/abi/configElectoralProcess';
// eslint-disable-next-line no-unused-vars
import { TODO_LIST_ABI_TABLE, TODO_LIST_ADDRESS_TABLE, TODO_LIST_ADDRESS_TABLE2 } from '../../components/abi/configVotingTable';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import WidgetItemCandidateResult from '../ceu/work_areas/WidgetItemCandidateResult';
import WidgetOption from './WidgetOption';

/**
 * Pagina web empleada para auditar los resultados obtenidos por los diferentes candidatos por mesa
 */
export default class WidgetAudit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      notificationDOMRef: React.createRef(),
      listCandidates: [],
      listTables: [],
      selectTable: ''
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

    //Crea uns conexion al contrato VotingTableContract usando la direccion de este en la blockchain y su interfas ABI
    const votingTable = new web3.eth.Contract(TODO_LIST_ABI_TABLE, TODO_LIST_ADDRESS_TABLE);

    //Se almacena la instancia de los dos contratos en el state de React y ademas una instancia de la libreria Web3js para emplearla posteriormente
    this.setState({ electoralContract, votingTable, web3, selectTable: TODO_LIST_ADDRESS_TABLE });

    //Lista las diferentes mesas
    this.listTables();

    //Carga los votos de los candidatos asociados a las mesas
    this.loadTable(TODO_LIST_ADDRESS_TABLE);
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
   * Pemite realizar consultas al contrato ElectoralProcessContract para consultar cuales son las mesas que se tienen y de esta manera poder autidarlas
   */
  async listTables() {
    try {

      //Lista de mesas
      let listTables = [];

      //Obtiene el numero de mesas que hay registradas en el contrato ElectoralProcessContract
      let numTables = await this.state.electoralContract.methods.getNumberTables().call({ from: this.state.account });

      //Itera el numero de mesas para obtener datos sobre las mismas
      for (let i = 0; i < numTables; i++) {

        //Obtiene la mesa i del contrato ElectoralProcessContract
        let datos = await this.state.electoralContract.methods.getTable(i).call({ from: this.state.account })

        //Aniade la tabla al array de mesas
        listTables.push({
          "address": datos[0],
          "codeTable": datos[1],
        });
      }

      //Actualiza el array de mesas del state de React
      this.setState({
        listTables: listTables
      });

    } catch (error) {
      if (error.message.includes("user denied")) {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");

      } else {
        this.notify("Error", "danger", error.message);
      }
    }
  }

  /**
   * Permite cargar los votos de cada uno de los candidatos asociados a la mesa cuya direccion ingresa como el parametro address
   * 
   * @param {*} address 
   */
  async loadTable(address) {
    if (this.state.selectTable === '') {
      return;
    }

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {
      let listCandidates = [];

      //Se obtiene el numero de candidatos totales
      let numCandidates = await this.state.electoralContract.methods.getNumberCandidates().call({ from: this.state.account });

      //Crea uns conexion al contrato VotingTableContract usando la direccion de este en la blockchain y su interfas ABI
      const votingTable = new this.state.web3.eth.Contract(TODO_LIST_ABI_TABLE, address);
      this.setState({ votingTable: votingTable });

      //Itera cada uno de los candidatos para obtener sus datos y cantidad de votos obtenidos en la mesa cuya direccion es el parametro address
      for (let i = 0; i < numCandidates; i++) {

        //Se obtiene la informacion del candidato i, que esta almacenada en el contrato VotingTableContract
        let datos = await this.state.votingTable.methods.getCandidateInfo(i).call({ from: this.state.account });

        //Aniade el candidato al array de candidatos junto con su informacion para luego ser renderizado
        listCandidates.push({
          "address": datos[1],
          "name": datos[0],
          "cardNumber": datos[2],
          "numVotes": datos[3],
        });
      }

      //Actualiza la informacion de los candidatos
      this.setState({
        listCandidates: listCandidates
      });

    } catch (error) {
      if (error.message.includes("user denied")) {
        this.notify("Notificación", "info", "Acción cancelada por el usuario");

      } else {
        this.notify("Error", "danger", error.message);
      }
    }
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    let lTable = this.loadTable.bind(this);
    return (
      <div style={{ marginTop: "70px" }}>
        <WidgetNavBar title="Auditar resultados" />
        <ReactNotification ref={this.state.notificationDOMRef} />
        <div className="input-group mb-3" style={{ marginTop: "110px", maxWidth: "400px", marginLeft: "450px" }}>
          <h5 className="mb-4">Listar los votos de los candidatos por mesa</h5>
          <select className="custom-select" id="inputGroupSelect02">
            <option key="SeleccioneUnaMesa" defaultValue>Seleccione una mesa</option>
            {
              this.state.listTables.map(function (table) {
                return <WidgetOption key={"table" + table.codeTable} loadTable={lTable} codeTable={table.codeTable} address={table.address} />
              })
            }
          </select>
        </div>
        <div style={{ marginTop: "30px" }}>
          {
            this.state.listCandidates.map(function (candidate) {
              return <WidgetItemCandidateResult key={"candidateAudit" + candidate.cardNumber} name={candidate.name} cardNumber={candidate.cardNumber} address={candidate.address} numVotes={candidate.numVotes} />
            })
          }
        </div>
      </div>
    );
  }
}