import React from 'react';
import Web3 from 'web3';
import { TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL } from '../../abi/configElectoralProcess';
import { TODO_LIST_ABI_TOKEN, TODO_LIST_ADDRESS_TOKEN } from '../../abi/configTokenVoteContract';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import WidgetItemCandidateResult from './WidgetItemCandidateResult';

/**
 * Componente que permite listar los diferentes candidatos con sus respectivos resultados.
 */
export default class WidgetShowResults extends React.Component {

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

    //Crea uns conexion al contrato ElectoralProcessContract usando la direccion de este en la blockchain y su interfas ABI
    const electoralContract = new web3.eth.Contract(TODO_LIST_ABI_ELECTORAL, TODO_LIST_ADDRESS_ELECTORAL);

    //Crea uns conexion al contrato TokenVoteContract usando la direccion de este en la blockchain y su interfas ABI
    const votingContract = new web3.eth.Contract(TODO_LIST_ABI_TOKEN, TODO_LIST_ADDRESS_TOKEN);

    //Se almacena la instancia de los dos contratos en el state de React y ademas una instancia de la libreria Web3js para emplearla posteriormente
    this.setState({ electoralContract, votingContract, web3 });

    //Lista los diferentes candidatos
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
   * Permite listar los difentes candidatos que se encuentran almacenados en la blockchain (en el contrato ElectoralProcessContract). Para conocer la cantidad de votos se debe consultar el balance de la cuenta de cada candidato en el contrato (TokenVoteContract)
   */
  async listCandidates() {

    //Actualiza la cuenta desde la cual se hara la transaccion
    this.updateSelectedAccount();

    try {
      //Array de candidatos
      let listCandidates = [];

      //Consulta el numero de candidatos que fueron registrados en la blockchain
      let numCandidates = await this.state.electoralContract.methods.getNumberCandidates().call({ from: this.state.account });

      //Itera hasta la cantidad de candidatos
      for (let i = 0; i < numCandidates; i++) {

        //Pide al contrato ElectoralProcessContract, el candidato que se encuentra en el indice i
        let datos = await this.state.electoralContract.methods.getCandidate(i).call({ from: this.state.account });

        //Consulta el numero de votos (balance) que este candidato tiene en su cuenta
        let numVotes = await this.state.votingContract.methods.balanceOf(datos[0]).call({ from: this.state.account });

        //Aniade el canidato al array de candidatos
        listCandidates.push({
          "address": datos[0],
          "name": datos[1],
          "cardNumber": datos[2],
          "numVotes": numVotes.balance
        });
      }

      //Actualiza el array de candidatos del state de React 
      this.setState({
        listCandidates: listCandidates
      });

      //Notifica que se han terminado de listar todos los candidatos
      this.notify("Notificación", "success", "Se ha terminado de listar los candidatos.");

    } catch (error) {
      if (error.message.includes("El sistema está en modo proceso electoral.")) {
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
      <div style={{ marginLeft: "30px" }}>
        <ReactNotification ref={this.state.notificationDOMRef} />
        <h4 className="ml-1">Resultados finales de la Consulta de opinión</h4>
        <div className="ml-3">
          {
            this.state.listCandidates.map(function (candidate) {
              return <WidgetItemCandidateResult key={"result" + candidate.cardNumber} name={candidate.name} cardNumber={candidate.cardNumber} address={candidate.address} numVotes={candidate.numVotes} />
            })
          }
        </div>
      </div>
    );
  }
}
