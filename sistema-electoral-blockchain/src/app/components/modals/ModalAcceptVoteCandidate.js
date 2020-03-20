import React from 'react';
import Web3 from 'web3';
import { TODO_LIST_ABI_TABLE, TODO_LIST_ADDRESS_TABLE } from '../../components/abi/configVotingTable';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import WidgetCandidateConfirmation from '../Voting/WidgetCandidateConfirmation';

export default class ModalAcceptVoteCandidate extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			account: '',
			notificationDOMRef: React.createRef()
		}
	}

	componentWillMount() {
		this.loadBlockchainData();
	}

	async loadBlockchainData() {
		const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
		window.ethereum.enable();
		const accounts = await web3.eth.getAccounts();
		//const network = await web3.eth.net.getNetworkType();

		this.setState({ account: accounts[0] });

		const votingContract = new web3.eth.Contract(TODO_LIST_ABI_TABLE, TODO_LIST_ADDRESS_TABLE);
		this.setState({ votingContract, web3 });
	}

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

	async updateSelectedAccount() {
		const updateAccount = await this.state.web3.eth.getAccounts();
		this.setState({ account: updateAccount[0] });
	}


	render() {
		return (
			<div className="modal fade hide hide" id="modalAcceptVoteCand" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
				<ReactNotification ref={this.state.notificationDOMRef} />
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLongTitle">¿Confirma que vota por este candidato?</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body " style={{ paddingLeft: "130px" }}>
							<WidgetCandidateConfirmation name={this.props.jsonCandidate.name} cardNumber={this.props.jsonCandidate.cardNumber} />
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
							<button type="button" className="btn btn-primary" onClick={() => { this.confirmVote() }}>Votar</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}