import Workflow from "./Workflow";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Alert, Button, CircularProgress } from "@mui/material";
import Address from "./Address";
import { useEth } from "../../../contexts/EthContext";
import { useState } from "react";
import { ProposalsRegistrationEnded, ProposalsRegistrationStarted, RegisteringVoters, VotesTallied, VotingSessionEnded, VotingSessionStarted } from "../Common";

function Header({ status, setStatus, isOwner }) {
    const { state: { contract, accounts } } = useEth();
    const [loader, setLoader] = useState(false);
    const [hasError, setHasError] = useState(false);

    const nextStep = () => {
        switch (status) {
            case RegisteringVoters:
                contract.methods.startProposalsRegistering().send({ from: accounts[0] })
                    .on('transactionHash', (transactionHash) => {
                        setLoader(true);
                    })
                    .on('receipt', function (receipt) {
                        setStatus(ProposalsRegistrationStarted);
                        setLoader(false);
                        setHasError(false);
                    })
                    .on('error', function (error, receipt) {
                        setLoader(false);
                        setHasError(true);
                    });
                break;
            case ProposalsRegistrationStarted:
                contract.methods.endProposalsRegistering().send({ from: accounts[0] })
                    .on('transactionHash', (transactionHash) => {
                        setLoader(true);
                    })
                    .on('receipt', function (receipt) {
                        setStatus(ProposalsRegistrationEnded);
                        setLoader(false);
                        setHasError(false);
                    })
                    .on('error', function (error, receipt) {
                        setLoader(false);
                        setHasError(true);
                    });
                break;
            case ProposalsRegistrationEnded:
                contract.methods.startVotingSession().send({ from: accounts[0] })
                    .on('transactionHash', (transactionHash) => {
                        setLoader(true);
                    })
                    .on('receipt', function (receipt) {
                        setStatus(VotingSessionStarted);
                        setLoader(false);
                        setHasError(false);
                    })
                    .on('error', function (error, receipt) {
                        setLoader(false);
                        setHasError(true);
                    });
                break;
            case VotingSessionStarted:
                contract.methods.endVotingSession().send({ from: accounts[0] })
                    .on('transactionHash', (transactionHash) => {
                        setLoader(true);
                    })
                    .on('receipt', function (receipt) {
                        setStatus(VotingSessionEnded);
                        setLoader(false);
                        setHasError(false);
                    })
                    .on('error', function (error, receipt) {
                        setLoader(false);
                        setHasError(true);
                    });
                break;
            case VotingSessionEnded:
                contract.methods.tallyVotes().send({ from: accounts[0] })
                    .on('transactionHash', (transactionHash) => {
                        setLoader(true);
                    })
                    .on('receipt', function (receipt) {
                        setStatus(VotesTallied);
                        setLoader(false);
                        setHasError(false);
                    })
                    .on('error', function (error, receipt) {
                        setLoader(false);
                        setHasError(true);
                    });
                break;
            default:
                break;

        }
    }

    return <>
        <Grid2 container spacing={1}>
            <Grid2 xs={9}>
                <Workflow status={status} />
            </Grid2>
            <Grid2 xs={2}>
                {isOwner && status !== VotesTallied && <Button
                    type="submit"
                    variant="contained"
                    disabled={loader}
                    onClick={nextStep}
                >
                    Next step &nbsp;
                    {loader && (
                        <CircularProgress
                            size={24}
                        />
                    )}
                </Button>}
                {hasError && <Alert severity="error" onClose={() => { setHasError(false) }}>An error occured</Alert>}
            </Grid2>
            <Grid2 xs={1}>
                <Address />
            </Grid2>
        </Grid2>
    </>
}

export default Header;