import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useEth } from "../../../contexts/EthContext";

function Proposals({proposals, setAddProposal}) {
    const { state: { contract, accounts } } = useEth();

    useEffect(() => {
        (async function () {
            await contract.events.ProposalRegistered({ fromBlock: "earliest" })
                .on('data', async event => {
                    const proposal = await contract.methods.getOneProposal(event.returnValues.proposalId).call({from: accounts[0]});
                    setAddProposal({id: event.returnValues.proposalId, ...proposal});
                })
                .on('changed', changed => console.log("changed" + changed))
                .on('error',    err => console.log("err: " + err)) // TODO
                .on('connected', str => console.log("str: " + str))
        })();
    }, [contract, accounts]);

    return (
        <>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Registered Proposals
            </Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Proposal id</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Votes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {proposals.map((proposal) => (
                        <TableRow key={"proposal_" + proposal.id}>
                            <TableCell>{proposal.id}</TableCell>
                            <TableCell>{proposal.description}</TableCell>
                            <TableCell>{proposal.voteCount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default Proposals;
