import { useEffect } from "react";
import { TableCell, TableRow, Table, TableBody, TableHead, Typography } from "@mui/material"
import { useEth } from "../../../contexts/EthContext";

function Voters({voters, setAddVoter}) {
  const { state: { contract, accounts } } = useEth();

  useEffect(() => {
    (async function () {
      contract.events.VoterRegistered({ fromBlock: "earliest" })
        .on('data', event => {
          let voterAddress = event.returnValues.voterAddress;
          setAddVoter(voterAddress);
        })
        .on('changed', changed => console.log("changed" + changed))
        .on('error', err => console.log("err: " + err))
        .on('connected', str => console.log("str: " + str))
    })();
  }, [contract, accounts]);

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Registered Voters
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Voter address</TableCell>
            <TableCell>Has voted</TableCell>
            <TableCell>For Proposal Id</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {voters.map((voter) => (
            <TableRow key={voter}>
              <TableCell>{voter}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default Voters;
