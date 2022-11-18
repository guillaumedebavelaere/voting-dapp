import { EthProvider } from "./contexts/EthContext";
import Voting from "./components/Voting";
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function App() {

  return (
    <EthProvider>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Voting />
        </Container>
      </ThemeProvider>
    </EthProvider >
  );
}

export default App;
