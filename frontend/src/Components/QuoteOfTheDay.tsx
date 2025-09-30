import './QuoteOfTheDay.css'
import { useDailyResetState } from '../utils/Hooks.ts';
import ServerContext from '../utils/ServerContext';
import { useContext } from 'react';

type QOTD = {
    quote: string,
    author: string
}

function fetchQuote(serverURI: string): Promise<QOTD> {
    return fetch(serverURI + '/getQOTD')
    .then((response) => response.json())
    .then((response) => {
        if (response['quote'] == 'Too many requests. Obtain an auth key for unlimited access.') {
            return new Promise<QOTD>((resolve) => {
                setTimeout((() => {
                    fetchQuote(serverURI).then(resolve);
                }), 10000)
            })
        }

        return response;
    });
}

export default function QuoteOfTheDay() {
    const serverURI = useContext(ServerContext);
    const { quote, author } = useDailyResetState({ quote: "Loading quote...", author: ""}, () => fetchQuote(serverURI))

    // const { quote, author } = {"quote":"It isn't what you have or who you are or where you are or what you are doing that makes you happy or unhappy. It is what you think about it.","author":"Dale Carnegie"} 
    return (
        <section className="quote">
            <div className="containerHeading">
                <img src="/images/quote-left-solid-full.svg" alt="Double Quotes" width="32"/>
                <p className="heading">Quote of the Day</p>

            </div>
            <p className="qotd">
                <span className="quoteText">{quote}</span>
                <br />
                - <i>{author}</i>
            </p>
        </section>
    )
}