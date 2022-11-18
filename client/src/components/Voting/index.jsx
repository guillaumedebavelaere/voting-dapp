import useEth from "../../contexts/EthContext/useEth";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Content from "./Content";
import Header from "./Header";

function Voting() {
  const { state: { artifact, contract, owner, accounts } } = useEth();
  const [status, setStatus] = useState(0);

  const isOwner = () => {
    return owner !== undefined && owner === accounts[0];
  }

  useEffect(() => {
    (async () => {
      if (contract != null) {
        const currentStatus = await contract.methods.workflowStatus().call();
        setStatus(parseInt(currentStatus));
      }
    })();
  }, [contract]);

  useEffect(() => {
    (async function () {
      if (contract != null) {
        contract.events.WorkflowStatusChange({ fromBlock: "earliest" })
          .on('data', async event => {
            setStatus(parseInt(event.returnValues.newStatus))
          })
          .on('error', err => console.log("err: " + err))
      }
    })();
  });

  return (
    <> {
      !artifact ? <NoticeNoArtifact /> :
        !contract ? <NoticeWrongNetwork /> :
          <Stack>
            <Header status={status} setStatus={setStatus} isOwner={isOwner()} />
            <Content status={status} isOwner={isOwner()} />
          </Stack>
    }
    </>

  );
}

export default Voting;
