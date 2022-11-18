import { useState } from "react";
import { TextField, Box, Button, Alert, CircularProgress } from "@mui/material";
import Typography from '@mui/material/Typography';
import { useEth } from "../../../contexts/EthContext";

function VoterRegistration() {
  const { state: { contract, accounts, web3 } } = useEth();
  const [value, setValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleChange = e => {
    setValue(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (value === "") {
      alert("Please enter an address to register.");
      return;
    }
    if (!web3.utils.isAddress(value)) {
      alert("Invalid address!")
      return;
    }
    
    contract.methods.addVoter(value).send({ from: accounts[0] })
      .on('transactionHash', (transactionHash) => {
        setLoader(true);
      })
      .on('receipt', (receipt) => {
        setValue("");
        setHasError(false);
        setLoader(false);
      })
      .on('error', (error, receipt) => {
        setHasError(true);
        setLoader(false);
      });

  };

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
          Register Voter
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="voterAddress"
            label="Voter address"
            name="voterAddress"
            disabled={loader}
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
            Register voter &nbsp;
            {loader && (
          <CircularProgress
            size={24}
          />
        )}
          </Button>
          {hasError && <Alert severity="error" onClose={() => { setHasError(false) }}>An error occured</Alert>}
        </Box>
      </Box>
    </>
  );
}

export default VoterRegistration;
