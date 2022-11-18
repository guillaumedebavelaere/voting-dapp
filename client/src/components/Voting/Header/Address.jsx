import { Button } from "@mui/material";
import useEth from "../../../contexts/EthContext/useEth";

function Address() {
    const { state: { accounts } } = useEth();

    const formatETHAddress = (s, size = 5) => {
        const first = s.slice(0, size + 1);
        const last = s.slice(-size);
        return first + "..." + last;
    }

    return <>
        {accounts !== undefined && (<Button variant="contained">{formatETHAddress(accounts[0])}</Button>)}
    </>
}

export default Address;