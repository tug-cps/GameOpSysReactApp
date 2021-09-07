import {useCallback, useState} from "react";

export interface State {
    open: boolean,
    message?: string
}

export function useSnackBar() {
    const [state, setState] = useState<State>({open: false});
    const close = () => setState(prevState => ({...prevState, open: false}));
    const props = {open: state.open, onClose: close, message: state.message};
    const pushMessage = useCallback((message: any) => setState({
        open: true,
        message: typeof message === "string" ? message : message?.response?.statusText
    }), []);
    return [props, pushMessage] as const
}
