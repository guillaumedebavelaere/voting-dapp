import { TableCell, TableRow, Table, TableBody, TableHead, Typography } from "@mui/material"
import { VotesTallied } from "../Common";

function Voters({status, voters}) {

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Registered Voters
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Voter address</TableCell>
            {status === VotesTallied &&<TableCell>Has voted</TableCell>}
            {status === VotesTallied &&<TableCell>For Proposal Id</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {voters.map((voter) => (
            <TableRow key={voter.id}>
              <TableCell>{voter.id}</TableCell>
              {status === VotesTallied && <TableCell>{voter.hasVoted ? "Yes" : "No"}</TableCell>}
              {status === VotesTallied && <TableCell>{voter.votedProposalId}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default Voters;
