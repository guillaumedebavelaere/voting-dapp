import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useEth } from "../../../contexts/EthContext";

function ProposalRegistration() {
  const { state: { contract, accounts } } = useEth();
  const [value, setValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleChange = e => {
    setValue(e.target.value);
  }

  const handleSubmit = e => {
    if (e.target.value === "") {
      alert("Please enter a proposal to register.");
      return;
    }
    e.preventDefault();
    contract.methods.addProposal(value).send({ from: accounts[0] })
      .on('transactionHash', (transactionHash) => {
        setLoader(true);
        setHasError(false);
      })
      .on('receipt', function(receipt){
        setValue(""); // reinit form value
        setLoader(false);
        setHasError(false);
      })
      .on('error', function(error, receipt) {
        console.log(error);
        setHasError(true);
        setLoader(false);
      });
  }

  return (
    <>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h2" variant="h5">
          Register Proposal
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            disabled={loader}
            id="proposalDescription"
            label="Proposal Description"
            name="proposalDescription"
            value={value}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loader}
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            Register the proposal &nbsp;
            {loader && (
              <CircularProgress
                size={24}
             />)}
          </Button>
          {hasError && <Alert severity="error" onClose={() => {setHasError(false)}}>An error occured</Alert>}
        </Box>
      </Box>
    </>
  );
}
  
  export default ProposalRegistration;
  