import { useEffect, useState, useRef } from "react";
import { get_ms_until_midnight } from "./Dates";


export function useTimer<T>(initial_state: T, getter: () => Promise<T>): T {
    const [state, setState] = useState(initial_state);
    const getterRef = useRef(getter);

    useEffect(() => {
        getterRef.current().then(q => setState(q));
    }, []);

    useEffect(() => {
        const ms_until_midnight: number = get_ms_until_midnight();

        const timeout = setTimeout(() => {
            getterRef.current().then(q => setState(q));
        }, ms_until_midnight);
        
        return () => clearTimeout(timeout);
    }, [state])

    return state;
}


export function useTimerSync<T>(initial_state: T, getter: () => T): T {
    const [state, setState] = useState(initial_state);
    const getterRef = useRef(getter);

    useEffect(() => {
        setState(getterRef.current());
    }, []);

    useEffect(() => {

        const timeout = setTimeout(() => {
            setState(getterRef.current());
        }, 100 * 1000);
        
        return () => clearTimeout(timeout);
    }, [state])

    return state;
}