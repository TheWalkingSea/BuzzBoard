import './QuoteOfTheDay.css'
import { get_ms_until_midnight } from '../utils/Dates.ts';
import { useState, useEffect } from 'react';



function getQuote(): Promise<string> {
    return fetch('https://zenquotes.io/api/today')
    .then((response) => response.json())
    .then((response) => `${response[0].q} \n ${response[0].a}`)
}

export default function QuoteOfTheDay() {
    const [quote, setQuote] = useState("Loading quote...");

    getQuote().then((q) => console.log(q));

    useEffect(() => {
        getQuote().then(q => setQuote(q));
    }, []);

    useEffect(() => {
        const ms_until_midnight: number = get_ms_until_midnight();

        const timeout = setTimeout(() => {
            getQuote().then(q => setQuote(q));
        }, ms_until_midnight);
        
        return () => clearTimeout(timeout);
    }, [quote])

    return (
        <section className="quote">
            <div className="containerHeading">
                <img src="/images/quote-left-solid-full.svg" alt="Double Quotes" width="32"/>
                <p className="heading">Quote of the Day</p>

            </div>
            <p className="qotd">{quote}</p>
        </section>
    )
}