import {Component, Suspense} from 'react';
import {Box, CssBaseline, ThemeProvider, Typography,} from "@material-ui/core";
import {createMuiTheme} from "@material-ui/core/styles";
import ReactRouter from "./Routes";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#7cb342',
            light: '#aee571',
            dark: '#4b830d',
            contrastText: '#fff'
        },
        secondary: {
            main: '#9ccc65',
            light: '#cfff95',
            dark: '#6b9b37'
        },
    },
});

class App extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Suspense fallback="Loading ...">
                    <ReactRouter/>
                </Suspense>
                {process.env.NODE_ENV !== "production" &&
                <Typography component="h5" style={{position: "fixed", bottom: 0}}>
                    {process.env.NODE_ENV} build using api {process.env.REACT_APP_API_BASE_URL}
                </Typography>
                }
            </ThemeProvider>
        );
    }
}

export default App;
