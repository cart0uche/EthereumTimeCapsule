import React, { useState, useEffect } from "react";
import { Menu, Button } from "semantic-ui-react";
import Web3 from "web3";

export default () => {
  const [accounts, setAccounts] = useState([]);
  const [once, setOnce] = useState(true);

  useEffect(async () => {
    if (once) {
	  const _accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setAccounts(_accounts);
      setOnce(false);
    }
  }, [once]);

  async function onConnectWallet(event) {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    }

    const _accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccounts(_accounts);
  }

  function renderMetamask() {
    if (accounts && accounts.length > 0) {
      return <a className="item">{accounts[0]}</a>;
    } else {
      return (
        <Button floated="right" color="blue" onClick={onConnectWallet}>
          Connect wallet
        </Button>
      );
    }
  }

  return (
    <Menu style={{ marginTop: "10px" }}>
      <a className="item">Ethereum Time Caspsule</a>

      <Menu.Menu position="right">{renderMetamask()}</Menu.Menu>
    </Menu>
  );
};
