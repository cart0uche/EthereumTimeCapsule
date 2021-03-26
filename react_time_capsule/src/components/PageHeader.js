import React, { useState, useEffect } from "react"
import {Menu, Button} from 'semantic-ui-react'
import Web3 from 'web3'

export default () =>{

	const [accounts, setAccounts] = useState([]);

	const isMetaMaskConnected = () => accounts && accounts.length > 0

	async function onConnectWallet(event) {
		if (typeof window.ethereum !== 'undefined') {
			console.log('MetaMask is installed!');
		  }
		  
		const _accounts = await  window.ethereum.request({ method: 'eth_requestAccounts' });
		setAccounts(_accounts);
		console.log(_accounts)
	}

	return (
		<Menu style={{ marginTop:'10px' }}>

    		<a className="item">
				Ethereum Time Caspsule
			</a>

		<Menu.Menu position="right">

			<Button floated="right" color='blue' onClick={onConnectWallet}>Connect wallet</Button>

		</Menu.Menu>

		</Menu>
	);
}