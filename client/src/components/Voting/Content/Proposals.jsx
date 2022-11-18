import { Alert, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useEth } from "../../../contexts/EthContext";
import { VotesTallied, VotingSessionEnded, VotingSessionStarted } from "../Common";
import CheckIcon from '@mui/icons-material/Check';

function Proposals({status, winningProposalId}) {
    const { state: { contract, accounts } } = useEth();
    const [proposals, setProposals] = useState([]);
    const [addProposal, setAddProposal] = useState();
    const [loader, setLoader] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [votedProposalId, setVotedProposalId] = useState();

    useEffect(() => {
        (async function () {
                let oldEvents = await contract.getPastEvents('ProposalRegistered', {
                    fromBlock: 0,
                    toBlock: 'latest'
                });

                const proposals = await Promise.all(oldEvents.map(async (event) => {
                    const proposal = await contract.methods.getOneProposal(parseInt(event.returnValues.proposalId)).call({ from: accounts[0] });
                    return { id: parseInt(event.returnValues.proposalId), ...proposal };
                }));
                setProposals(proposals);
        })();
    }, [addProposal, status]);

    useEffect(() => {
        (async function () {
            await contract.events.ProposalRegistered({ fromBlock: "earliest" })
                .on('data', async event => {
                    const proposal = await contract.methods.getOneProposal(parseInt(event.returnValues.proposalId)).call({from: accounts[0]});
                    setAddProposal({id: parseInt(event.returnValues.proposalId), ...proposal});
                })
                .on('error',    err => console.log("err: " + err))
        })();
    });

    useEffect(() => {
        (async () => {
            if ([VotesTallied, VotingSessionStarted, VotingSessionEnded].includes(status)) {
                const voter = await contract.methods.getVoter(accounts[0]).call({from: accounts[0]});
                setVotedProposalId(parseInt(voter.votedProposalId));
            }
        })();
    }, [hasVoted, status]);

    const vote = async(proposalId) => {
        contract.methods.setVote(proposalId).send({from: accounts[0]})
            .on('transactionHash', (transactionHash) => {
                setLoader(true);
              })
              .on('receipt', (receipt) => {
                setHasError(false);
                setLoader(false);
                setHasVoted(true);
              })
              .on('error', (error, receipt) => {
                setHasError(true);
                setLoader(false);
              });
    }

    const successCheck = (proposalId) => {
        if ((VotesTallied === status && proposalId === winningProposalId) 
            || ([VotingSessionStarted, VotingSessionEnded].includes(status) && hasVoted && votedProposalId === proposalId)) {
            return <CheckIcon color="success"/>
        } else {
            return <></>
        }
    }

    return (
        <>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Registered Proposals
            </Typography>
            {hasError && <Alert severity="error" onClose={() => { setHasError(false) }}>An error occured</Alert>}
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Proposal id</TableCell>
                        <TableCell>Description</TableCell>
                        {status === VotesTallied && <TableCell>Votes</TableCell>}
                        { [VotingSessionStarted, VotingSessionEnded].includes(status) && hasVoted && <TableCell>You voted for</TableCell>}
                        { VotesTallied === status  && <TableCell>Winning proposal</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {proposals.map((proposal) => (
                        <TableRow key={"proposal_" + proposal.id}>
                            <TableCell>{proposal.id}</TableCell>
                            <TableCell>{proposal.description}</TableCell>
                            { status === VotesTallied && <TableCell>{proposal.voteCount}</TableCell>}
                            { status === VotingSessionStarted && !hasVoted ? <TableCell>
                                <Button
                                variant="contained"
                                disabled={loader}
                                fullWidth
                                onClick={() => vote(proposal.id)}
                                sx={{ mt: 3, mb: 2 }}
                                >
                                Vote &nbsp;
                                {loader && (
                            <CircularProgress
                                size={24}
                            />)}
                            </Button>
                            </TableCell> : <TableCell>{successCheck(proposal.id)}</TableCell>
                            
                        }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default Proposals;
