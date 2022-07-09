import React, { useState } from 'react';
import { ethers } from 'ethers'
import ACVO from './artifacts/contracts/ACVO.sol/ACVO.json'
import Voting from './artifacts/contracts/Voting.sol/BallotPaper.json'
import './App.css'
import { Navbar, Container, Nav, Button, Col, Row, InputGroup, Form, Accordion} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



const ACVOAddress = '0xed9413Bd473c5D048E37574d4B548DDe1b4678BD';


const App = () => {

    const [ID, setID] = useState();
    const [IDForCandidate, setIDForCandidate] = useState();
    const [Candidate, setCandidate] = useState();

    async function requestAccount() {
        await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    async function AddCandidate() {
        if (typeof window.ethereum !== "undefined") {
            await requestAccount();

            const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
            const contract = new ethers.Contract(
                ACVOAddress,
                ACVO.abi,
                provider
            );
            const VoteAddress = await contract.SearchForVotingContract(IDForCandidate);

            const signer = provider.getSigner();

            const VoteContract = new ethers.Contract(VoteAddress, Voting.abi, signer);
            const options = { value: ethers.utils.parseEther("0.0003") }
            const transaction = await VoteContract.AddCandidate(Candidate, options);
            document.getElementById("Annonc").textContent = "Please wait...";
            await transaction.wait();
        }

        document.getElementById("Annonc").textContent = "Congrats! You added " + Candidate;
    }

    async function ShowWinner() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
            const contract = new ethers.Contract(
                ACVOAddress,
                ACVO.abi,
                provider
            );
            try {
                const VoteAddress = await contract.SearchForVotingContract(ID);
                const VoteContract = new ethers.Contract(VoteAddress, Voting.abi, provider);

                const list = await VoteContract.GetKeys();

                var winner = '';
                var WinnerCount = 0;
                for (var elementvalue in list) {
                    var VoteCount = await VoteContract.SearchForCandidate(list[elementvalue]);

                    if (VoteCount > WinnerCount) {
                        winner = list[elementvalue]
                    }
                }
                document.getElementById('Annonc').text = winner;

            } catch (err) {
                console.log("error: ", err);
            }
        }
    }

    async function Vote() {
        if (typeof window.ethereum !== "undefined") {
            await requestAccount();

            const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
            const contract = new ethers.Contract(
                ACVOAddress,
                ACVO.abi,
                provider
            );
            const Candidate = document.getElementById('Candidates').value;
            console.log(Candidate);
            const VoteAddress = await contract.SearchForVotingContract(ID);

            const signer = provider.getSigner();

            const VoteContract = new ethers.Contract(VoteAddress, Voting.abi, signer);
            const transaction = await VoteContract.Vote(Candidate);
            document.getElementById("Annonc").textContent = "Please wait...";
            await transaction.wait();
        }

        document.getElementById("Annonc").textContent = "Congrats! You vote to " + Candidate;
    }

    async function Withdraw() {
        if (typeof window.ethereum !== "undefined") {
            await requestAccount();

            const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
            const contract = new ethers.Contract(
                ACVOAddress,
                ACVO.abi,
                provider
            );
            const Candidate = document.getElementById('Candidates').value;
            console.log(Candidate);
            const VoteAddress = await contract.SearchForVotingContract(ID);

            const signer = provider.getSigner();

            const VoteContract = new ethers.Contract(VoteAddress, Voting.abi, signer);
            const transaction = await VoteContract.Withdraw(Candidate);
            document.getElementById("Annonc").textContent = "Please wait...";
            await transaction.wait();
        }

        document.getElementById("Annonc").textContent = "Withdraw succesfully done!";
    }

    async function FetchAddress() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
            const contract = new ethers.Contract(
                ACVOAddress,
                ACVO.abi,
                provider
            );
            try {
                const VoteAddress = await contract.SearchForVotingContract(ID);
                const VoteContract = new ethers.Contract(VoteAddress, Voting.abi, provider);

                const list = await VoteContract.GetKeys();

                var select = document.getElementById("Candidates");
                for (var elementvalue in list) {
                    var option = document.createElement('option');
                    option.text = option.value = list[elementvalue];
                    select.add(option, list[elementvalue]);
                }
                console.log(list.length);

            } catch (err) {
                console.log("error: ", err);
            }
        }
    }

    async function CreateBallot() {
        var ID = '';
        var characters = '0123456789012345678901234567890123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < charactersLength; i++) {
            ID += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }

        if (typeof window.ethereum !== "undefined") {
            await requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
            const signer = provider.getSigner();

            const contract = new ethers.Contract(ACVOAddress, ACVO.abi, signer);
            const options = { value: ethers.utils.parseEther("0.0005") }
            const transaction = await contract.CreateBallot(ID, options);
            document.getElementById("Annonc").textContent = "Please wait...";
            await transaction.wait();
        }

        document.getElementById("Annonc").textContent = "Congrats! Your ballot ID:" + ID;
    }

    
    return (
        <div>

            <Navbar bg="light" variant="light">
                <Container>
                    <img
                        alt=""
                        src="/acvo.png"
                        width="50"
                        height="50"
                        className="d-inline-block align-top"
                        style={{ marginLeft:'-5%' }}
                    />
                    <Navbar.Brand href="#welcome" style={{ marginLeft:'2%' }}>ACVO</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#vote">Vote</Nav.Link>
                        <Nav.Link href="#create">Create</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div style={{ backgroundColor: '#545454', color:'white', textAlign:'center' }}>
                <p id="Annonc">Welcome to ACVO</p>
            </div>

            <Container>
                
                <Row>
                    <Col style={{
                        alignItems: "center", textAlign: "center", alignContent: "center", backgroundColor: "#545454", padding: '2%'
                    }}><Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Create</Accordion.Header>
                                <Accordion.Body>
                                    You can create new ballot for 0.0005 ETH <br />
                                    <Button variant="primary" onClick={CreateBallot}>Create</Button>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Withdraw</Accordion.Header>
                                <Accordion.Body>
                                    If you create a ballot, you can withdraw ethers which you won from candidates. <br />
                                    <input onChange={(e) => setID(e.target.value)} placeholder='ID' /><br/>
                                    <Button variant="primary" onClick={Withdraw}>Withdraw</Button>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Show Winner</Accordion.Header>
                                <Accordion.Body>
                                    Show Winner of Ballot <br />
                                    <input onChange={ (e) => setID(e.target.value) } placeholder='ID'/><br/>
                                    <Button variant="primary" onClick={ShowWinner}>Show Winner</Button>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>

                    <Col style={{ textAlign: "center", alignContent: "center", backgroundColor: "#545454", padding: '2%' }}>
                        <Accordion defaultActiveKey="4">
                            <Accordion.Item eventKey="4">
                                <Accordion.Header>Search Ballot</Accordion.Header>
                                <Accordion.Body>
                                    <InputGroup className="mb-3" onChange={(e) => setID(e.target.value)}>
                                        <Button variant="outline-secondary" id="button-addon1" onClick={FetchAddress}>
                                            Search Ballot
                                        </Button>
                                        <Form.Control
                                            aria-label="Example text with button addon"
                                            aria-describedby="basic-addon1"
                                        />
                                    </InputGroup>

                                    <select id="Candidates" name="Candidates"></select>

                                    <br />
                                    <Button variant="primary" onClick={Vote}>Vote</Button><br /><br />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="5">
                                <Accordion.Header>Add Candidate</Accordion.Header>
                                <Accordion.Body>
                                    <InputGroup className="mb-3" onChange={(e) => setIDForCandidate(e.target.value)}>
                                        <Button variant="outline-secondary" id="button-addon2">
                                            Ballot ID
                                        </Button>
                                        <Form.Control
                                            aria-label="Example text with button addon"
                                            aria-describedby="basic-addon1"
                                        />
                                    </InputGroup>

                                    <InputGroup className="mb-3" onChange={(e) => setCandidate(e.target.value)}>
                                        <Button variant="outline-secondary" id="button-addon3">
                                            Candidate
                                        </Button>
                                        <Form.Control
                                            aria-label="Example text with button addon"
                                            aria-describedby="basic-addon1"
                                        />
                                    </InputGroup>

                                    <Button variant="primary" onClick={AddCandidate}>Add Candidate</Button><br /><br />
                                </Accordion.Body>
                            </Accordion.Item>
                            
                        </Accordion>
                    </Col>
                </Row>
            </Container>

        </div>

        
        //<div className="App">
          //  <header className="App-header">
            //    <button onClick={fetchAddress}>Fetch Address </button>
              //  <button onClick={CreateBallot}>Create Ballot </button>
                //<input
                  //  onChange={(e) => setID(e.target.value)}
                   // placeholder="ID" />
            //</header >
        // </div>
    );
}

    export default App