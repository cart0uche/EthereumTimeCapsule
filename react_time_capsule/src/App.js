import React, { useState, useEffect } from "react";
import {
  Table,
  Grid,
  Form,
  Button,
  Message,
  Image,
  Container,
  Checkbox,
  Menu,
} from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import PageHeader from "./components/PageHeader";
import "semantic-ui-css/semantic.min.css";
import TimeCapsule from "./abi/TimeCapsule.json";
import Web3 from "web3";

function App() {
  const [message, setMessage] = useState("");
  const [messageErr, setMessageErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [capsules, setCapsules] = useState([]);
  const [showFuturCapsules, setShowFuturCapsules] = useState(false);

  useEffect(async () => {
    let _capsules;
    if (refresh) {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        // check if network is rinkeby
        const connectedNetwork = await web3.eth.net.getNetworkType();
        if (connectedNetwork != "rinkeby") {
          return;
        }
        var TimeCapsuleContract = new web3.eth.Contract(
          TimeCapsule.abi,
          "0x2f9F9B7Cc2d7C3cfE7adcB9C3DF9495E5CdAe7c8"
        );
        console.log("getCapsules()");

        _capsules = await TimeCapsuleContract.methods.getCapsules().call();
      } catch (error) {
        setMessageErr(error.message);
      }

      setCapsules(_capsules);
      setRefresh(false);
    }
  }, [capsules, refresh]);

  async function onSendMessage(event) {
    //event.preventDefault;
    setLoading(true);
    console.log("sendMessage" + message);

    try {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      var TimeCapsuleContract = new web3.eth.Contract(
        TimeCapsule.abi,
        "0x2f9F9B7Cc2d7C3cfE7adcB9C3DF9495E5CdAe7c8"
      );
      const accounts = await web3.eth.getAccounts();
      var unixtime = Date.parse(dateTime) / 1000;

      await TimeCapsuleContract.methods
        .sendCapsule(message, unixtime)
        .send({ from: accounts[0] });
    } catch (error) {
      console.log(error.message);
      setMessageErr(error.message);
    }

    setLoading(false);
    setMessage("");
    setDateTime("");
    setRefresh(true);
  }

  let renderCapsules = () => {
    return capsules
      .slice(0)
      .reverse()
      .map((capsule) => {
        console.log("renderCapsules");
        console.log(showFuturCapsules);
        if (!showFuturCapsules && !capsule["visible"]) {
          return <div />;
        }
        var dateTime = new Date(capsule["date"] * 1000).toLocaleString();
        const { Row, Cell } = Table;
        if (!capsule["visible"]) {
          return (
            <Row disabled>
              <Cell>{capsule["sender"]}</Cell>
              <Cell>Not yet available</Cell>
              <Cell>{dateTime}</Cell>
            </Row>
          );
        } else {
          return (
            <Row>
              <Cell>{capsule["sender"]}</Cell>
              <Cell>{capsule["message"]}</Cell>
              <Cell>{dateTime}</Cell>
            </Row>
          );
        }
      });
  };

  let handleChange = (event, { name, value }) => {
    setDateTime(value);
  };

  const { Header, Row, HeaderCell, Body } = Table;
  return (
    <div className="App">
      <Container>
        <PageHeader />

        <Image src="/img/time-capsule.png" size="small" circular centered />

        <Container>
          This is a time capsule that allows you to send a message to the
          ethereum blockchain, so that it is readable on the date you choose.
          This uses the Rinkeby testnet.
        </Container>

        <Form style={{ marginTop: "15px" }} error={!!messageErr}>
          <Form.Group widths="equal">
            <Form.TextArea
              fluid
              onChange={(event) => {
                setMessage(event.target.value);
              }}
              placeholder="Write your message here"
            />

            <DateTimeInput
              name="dateTime"
              dateTimeFormat="YYYY-MM-DDTHH:mm"
              placeholder="Date Time"
              value={dateTime}
              iconPosition="left"
              onChange={handleChange}
              timeFormat="24"
              closable="true"
            />
          </Form.Group>

          <Grid style={{ marginTop: "10px" }}>
            <Grid.Column textAlign="center">
              <Button primary="true" onClick={onSendMessage} loading={loading}>
                Send
              </Button>
            </Grid.Column>
          </Grid>

          <Message error header="Oops!" content={messageErr} />
        </Form>

        <Checkbox
          label="Show futur capsules"
          toggle
          onChange={(event, data) => {
            setShowFuturCapsules(!showFuturCapsules);
          }}
        />

        <Table>
          <Header>
            <Row>
              <HeaderCell width="7">From</HeaderCell>
              <HeaderCell>Message</HeaderCell>
              <HeaderCell>Avaible from</HeaderCell>
            </Row>
          </Header>
          <Body>{renderCapsules()}</Body>
        </Table>

        <Menu style={{ marginTop: "50px" }}>
          <Menu.Item href="https://github.com/cart0uche/EthereumTimeCapsule">
            <img src="./img/github.png" />
          </Menu.Item>

          <Menu.Item href="https://rinkeby.etherscan.io/address/0x2f9F9B7Cc2d7C3cfE7adcB9C3DF9495E5CdAe7c8">
            <a>Contract address 0x2f9F9B7Cc2d7C3cfE7adcB9C3DF9495E5CdAe7c8</a>
          </Menu.Item>
        </Menu>
      </Container>
    </div>
  );
}

export default App;
