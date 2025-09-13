import './Clock.css'
import { useState, useEffect } from 'react';

export default function Clock() {

    const [time, setTime] = useState(new Date());

    useEffect(() => {
            const timeout = setTimeout(() => {
                setTime(new Date());
            }, 1000);
            return () => clearTimeout(timeout);
        }
    );

    function padTime(time: number): string {
        return time.toString().padStart(2, '0');
    }

    return (
        <div className="clock">
            <div className="leftBlock block">
                <div className="centered">
                    <div className="hour large">{padTime(time.getHours() % 12)}</div>
                </div>
                <div className="meridiem small">{time.getHours() >= 12 ? 'pm' : 'am'}</div>
            </div>
            <div className="large">:</div>
            <div className="rightBlock block">
                <div className="centered">
                    <div className="minutes large">{padTime(time.getMinutes())}</div>
                </div>
                <div className="seconds small">{padTime(time.getSeconds())}</div>
            </div>
        </div>
    )
}