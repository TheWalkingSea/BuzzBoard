import { useState, useEffect } from 'react';
import './Progress.css'
import * as dates from '../utils/Dates.ts';

export default function Progress () {

    const [percentage, setPercentage] = useState(dates.get_percentage);
    const [daysRemain, setDaysRemain] = useState(dates.get_days_remaining);

    useEffect(() => {
        const next_percent_update: number = dates.get_ms_next_percent();

        const ms_until_midnight: number = dates.get_ms_until_midnight();

        let timeout: number;
        if (next_percent_update > ms_until_midnight) { // Use ms_until_midnight timeout
            console.log(`Sleeping until next day for ${Math.floor(ms_until_midnight / 1000 / 60 / 60)} hours and ${Math.floor(ms_until_midnight / 1000 / 60 % 60)} minutes.`);
            const days_remaining = dates.get_days_remaining();
            timeout = setTimeout(() => {
                setDaysRemain(days_remaining - 1);
            }, ms_until_midnight);
        } else { // Use next_percent_update timeout
            console.log(`Sleeping until next percentage update for ${Math.floor(next_percent_update / 1000 / 60 / 60)} hours and ${Math.floor(next_percent_update / 1000 / 60)} seconds.`);
            const current_percentage = dates.get_percentage();
            timeout = setTimeout(() => {
                setPercentage(current_percentage + 0.01);
            }, next_percent_update);
        }

        return () => clearTimeout(timeout);
    }, [percentage, daysRemain]);

    return (
        <>
        <section className="progress">
            <div className="containerHeading">
                <img src="images/spinner-solid-full.svg" alt="Spinner" width="40"/>
                <h2 className="heading">Semester Progress</h2>
            </div>

            <div className="progress-circle">
                <div className="outer">
                    <div className="inner">
                        <span className="percentage">{Math.floor(100 * percentage)}%</span>
                    </div>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="200px"
                    height="200px"
                >
                    <defs>
                        <linearGradient id="GradientColor">
                            <stop offset="0%" stopColor="#3f9cda" />
                            <stop offset="100%" stopColor="#38d0ebff" />
                        </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="88" />
                </svg>
            </div>

            <p className="daysRemain">{daysRemain} Days Remaining</p>
        </section>
        </>
    )
}