import './QuoteOfTheDay.css'

type QuoteProp = {
    quote: string
};

export default function QuoteOfTheDay({ quote }: QuoteProp) {
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