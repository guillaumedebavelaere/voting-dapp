import VoterRegistration from "./VoterRegistration";
import Voters from "./Voters";
import ProposalRegistration from "./ProposalRegistration";
import Proposals from "./Proposals";
import { useEffect, useState } from "react";
import { useEth } from "../../../contexts/EthContext";
import { ProposalsRegistrationEnded, ProposalsRegistrationStarted, RegisteringVoters, VotesTallied, VotingSessionEnded, VotingSessionStarted } from "../Common";
import { Stack, Typography } from "@mui/material";

function Content({ status, isOwner }) {
    const { state: { contract, accounts } } = useEth();
    const [voters, setVoters] = useState([]);
    const [addVoter, setAddVoter] = useState();
    const [isVoter, setIsVoter] = useState();
    const [winningProposalId, setWinningProposalId] = useState();

    useEffect(() => {
        (async () => {
            if (status === VotesTallied) {
                const result = await contract.methods.winningProposalID().call({ from: accounts[0] });
                setWinningProposalId(parseInt(result));
            }
        })();
    }, [status]);

    useEffect(() => {
        (async function () {
            contract.events.VoterRegistered({ fromBlock: "earliest" })
                .on('data', async event => {
                    setAddVoter({ id: event.returnValues.voterAddress });
                })
                .on('error', err => console.log("err: " + err))
        })();
    });

    useEffect(() => {
        (async function () {
            let oldEvents = await contract.getPastEvents('VoterRegistered', {
                fromBlock: 0,
                toBlock: 'latest'
            });
            let oldVoters = [];
            oldEvents.forEach(event => {
                console.log(event.returnValues.voterAddress);
                oldVoters.push({ id: event.returnValues.voterAddress });
            });
            const voterAddresses = voters.map(voter => voter.id);
            if (status === VotesTallied && voterAddresses.includes(accounts[0])) {
                const votersWithDetails = await Promise.all(oldVoters.map(async (voter) => {
                    const voterWithDetail = await contract.methods.getVoter(voter.id).call({ from: accounts[0] });
                    return { id: voter.id, ...voterWithDetail };
                }));
                setVoters(votersWithDetails);
            } else {
                setVoters(oldVoters);
            }
        })();
    }, [addVoter, status]);

    useEffect(() => {
        const voterAddresses = voters.map(voter => voter.id);
        setIsVoter(accounts !== undefined && voterAddresses.includes(accounts[0]));
    }, [contract, accounts, voters]);


    return (<>
        <Stack>
            {status === VotesTallied && <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Winning proposal id : {winningProposalId}
            </Typography>}
            {isVoter && [ProposalsRegistrationStarted, ProposalsRegistrationEnded, VotingSessionStarted, VotingSessionEnded, VotesTallied].includes(status) ? <Proposals winningProposalId={winningProposalId} status={status} /> : ([ProposalsRegistrationStarted].includes(status) && <p>Wait for voters to finish adding proposals or click next</p>)}
            {isVoter && [ProposalsRegistrationStarted].includes(status) && <ProposalRegistration />}
            {((RegisteringVoters === status && (isOwner || isVoter)) || (VotesTallied === status && isVoter)) && <Voters status={status} voters={voters} setVoters={setVoters} setAddVoter={setAddVoter} />}
            {isOwner && status === RegisteringVoters ? <VoterRegistration /> : (status === RegisteringVoters && isVoter && <p>Waiting for admin to finish registering voters</p>)}
        </Stack>

    </>);
}

export default Content;