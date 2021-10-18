import {createTheme, ThemeOptions, useMediaQuery} from "@mui/material";
import {useMemo, useState} from "react";
import {lightGreen} from "@mui/material/colors";

export const useThemeBuilder = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState<'light' | 'dark' | undefined>();
    const colorMode = useMemo(() => ({mode: mode, toggleColorMode: setMode}), [setMode, mode]);
    const useDarkTheme = mode ? mode === 'dark' : prefersDarkMode;
    const theme: ThemeOptions = useMemo(() => createTheme({
        palette: {
            mode: useDarkTheme ? "dark" : "light",
            primary: {
                main: lightGreen[600],
                contrastText: '#fff'
            },
            secondary: {
                main: lightGreen[400]
            },
        },
        components: {
            MuiAppBar: {
                defaultProps: {
                    elevation: useDarkTheme ? 1 : 0,
                    color: "inherit",
                },
            },
            MuiUseMediaQuery: {
                defaultProps: {
                    noSsr: true,
                }
            },
            MuiGrid: {
                defaultProps: {
                    spacing: 1
                }
            },
            MuiCard: {
                defaultProps: {
                    variant: "outlined",
                    square: true,
                }
            },
            MuiFab: {
                styleOverrides: {
                    root: {
                        position: 'fixed',
                        bottom: '10px',
                        right: '10px',
                    }
                }
            },
            MuiSnackbar: {
                styleOverrides: {
                    anchorOriginBottomCenter: {
                        // When bottom bar is shown, raise Snackbar position
                        '@media (max-width:599.95px)': {
                            bottom: '70px'
                        }
                    }
                }
            }
        },
    }), [useDarkTheme]);
    return [theme, colorMode] as const
}
