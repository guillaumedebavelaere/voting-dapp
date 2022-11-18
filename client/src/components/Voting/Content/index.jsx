import VoterRegistration from "./VoterRegistration";
import Voters from "./Voters";
import ProposalRegistration from "./ProposalRegistration";
import Proposals from "./Proposals";
import { useEffect, useState } from "react";
import { useEth } from "../../../contexts/EthContext";

function Content({ status, isOwner }) {
    const { state: { contract, accounts } } = useEth();
    const [voters, setVoters] = useState([]);
    const [addVoter, setAddVoter] = useState([]);
    const [isVoter, setIsVoter] = useState();
    const [proposals, setProposals] = useState([]);
    const [addProposal, setAddProposal] = useState([]);

    useEffect(() => {
        (async function () {
            let oldEvents = await contract.getPastEvents('VoterRegistered', {
                fromBlock: 0,
                toBlock: 'latest'
            });
            let voterAddresses = [];
            oldEvents.forEach(event => {
                voterAddresses.push(event.returnValues.voterAddress);
            });
            setVoters(voterAddresses);
        })();
    }, [contract, accounts, addVoter]);

    useEffect(() => {
        setIsVoter(accounts !== undefined && voters.includes(accounts[0]));
    }, [contract, accounts, voters]);

    useEffect(() => {
        (async function () {
            if (isVoter) {
                let oldEvents = await contract.getPastEvents('ProposalRegistered', {
                    fromBlock: 0,
                    toBlock: 'latest'
                });
    
                const proposals = await Promise.all(oldEvents.map(async (event) => {
                    const proposal = await contract.methods.getOneProposal(event.returnValues.proposalId).call({ from: accounts[0] });
                    return { id: event.returnValues.proposalId, ...proposal };
                }));
                setProposals(proposals);
            }
        })();
    }, [contract, accounts, addProposal, isVoter]);



    return (<>
        {isVoter && [1, 2].includes(status) ? <Proposals proposals={proposals} setAddProposal={setAddProposal} /> : ([1, 2].includes(status) && <p>Waiting for voters to finish adding proposals</p>)}
        {isVoter && [1, 2].includes(status) && <ProposalRegistration />}
        {[0, 3, 4, 5].includes(status) && <Voters voters={voters} setAddVoter={setAddVoter} />}
        {isOwner && status == 0 ? <VoterRegistration /> : (status == 0 && <p>Waiting for admin to finish registering voters</p>)}

    </>);
}

export default Content;