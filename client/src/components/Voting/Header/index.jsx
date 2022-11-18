import Workflow from "./Workflow";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Alert, Button, CircularProgress } from "@mui/material";
import Address from "./Address";
import { useEth } from "../../../contexts/EthContext";
import { useState } from "react";

function Header({ status, setStatus, isOwner }) {
    const { state: { contract, accounts } } = useEth();
    const [loader, setLoader] = useState(false);
    const [hasError, setHasError] = useState(false);

    const nextStep = () => {
        console.log("status: !" + status);
        switch (status) {
            case 0:
                contract.methods.startProposalsRegistering().send({ from: accounts[0] })
                    .on('transactionHash', (transactionHash) => {
                        setLoader(true);
                    })
                    .on('receipt', function (receipt) {
                        setStatus(1);
                        setLoader(false);
                        setHasError(false);
                    })
                    .on('error', function (error, receipt) {
                        setLoader(false);
                        setHasError(true);
                    });
                break;
            case 1:
                break;
            case 2:
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
                {isOwner && status != 6 && <Button
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