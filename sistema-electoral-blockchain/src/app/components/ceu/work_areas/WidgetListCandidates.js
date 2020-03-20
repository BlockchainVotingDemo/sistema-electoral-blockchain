import React from 'react';
import WidgetItemCandidate from './WidgetItemCandidate';
import Web3 from 'web3';
import { TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL } from '../../abi/configElectoralProcess';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

/**
 * Compononente que permite ser reutilizado para poder listar los diferentes candidatos que estan habilitados para aspirar al cargo de rector
 */
export default class WidgetListCandidates extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      notificationDOMRef: React.createRef(),
      listCandidates: []
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

    //Consulta todos los diferentes candidatos que estan registrados en la blockchain
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

  /**
   * Realiza peticiones a la blockchain, empleando el contrato ElectoralProcessContract, para consultar, traer y almacenar todos los diferentes candidatos que se han inscrito.
   */
  async listCandidates() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    //Array de candidatos
    let listCandidates = [];

    try {

      //Consulta el numero de candidatos que estan registrados en la blockchain y los almacena en numCandidates
      let numCandidates = await this.state.electoralContract.methods.getNumberCandidates().call({ from: this.state.account });

      //Itera el numero total de candidatos y los va pidiendo de acuerdo al indice i, uno a uno, para almacenarlos en listCandidates
      for (let i = 0; i < numCandidates; i++) {

        //Se llama la funcion getCandidate del contrato ElectoralProcessContract, para solicitar el candidato que esta en la posicion i
        let datos = await this.state.electoralContract.methods.getCandidate(i).call({ from: this.state.account })

        listCandidates.push({
          "address": datos[0],
          "name": datos[1],
          "cardNumber": datos[2],
          "numVotes": datos[3],
        });
      }

      //Notifica al usuario que se ha terminado de cargar todos los candidatos
      this.notify("Notificación", "success", "Se ha terminado de listar los candidatos.");

    } catch (error) {
      this.notify("Error", "danger", error.message);
    }

    //Asigna los cantidatos consultados al state de React para poder ser empleados posteriormente
    this.setState({
      listCandidates: listCandidates
    });
  }

  /**
  * Funcion que renderiza el componente si este sufre algun cambio
  */
  render() {
    return (
      <div style={{ marginLeft: "30px" }}>
        <ReactNotification ref={this.state.notificationDOMRef} />
        <h4 className="ml-1">Lista de candidatos inscritos</h4>
        <div className="ml-3">
          {
            this.state.listCandidates.map(function (candidate) {
              return <WidgetItemCandidate key={"candidate" + candidate.cardNumber} name={candidate.name} cardNumber={candidate.cardNumber} address={candidate.address} />
            })
          }
        </div>
      </div>
    );
  }
}
