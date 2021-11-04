import {AxiosError} from "axios";
import {useCallback, useState} from "react";

export interface State {
    open: boolean,
    message?: string
}

interface ResponseType {
    title: string
}

export function useSnackBar() {
    const [state, setState] = useState<State>({open: false});
    const close = () => setState(prevState => ({...prevState, open: false}));
    const props = {open: state.open, onClose: close, message: state.message};
    const pushMessage = useCallback((reason: AxiosError<ResponseType> | string) => {
        if (typeof reason === 'string') return setState({open: true, message: reason});
        if (!reason.response) return setState({open: true, message: reason.message});
        if (!reason.response.data.title) return setState({open: true, message: reason.response.statusText});
        setState({open: true, message: reason.response.data.title});
    }, []);
    return [props, pushMessage] as const
}
