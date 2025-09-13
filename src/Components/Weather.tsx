import './Weather.css'

export default function Weather() {
    return (
        <>
            <div className="weather">
                <img src="images/cloud-bolt-solid-full.svg" alt="Thunderstorm" width="60" />
                <div className="weatherInfo">
                    <p className="temperature">72°F</p>
                    <p className="weatherType subtext">Very Rainy</p>
                    <br/>
                    <div className="weatherStats">
                        <div className="rain subtext">
                            <img src="/images/droplet-solid-full.svg" alt="Raindrop" width="25"/>
                            <p className="rainChance">65%</p>
                        </div>
                        <div className="wind subtext">
                            <img src="/images/wind-solid-full.svg" alt="Wind" width="25"/>
                            <p className="rainChance">8mph</p>
                        </div>
                    </div>
                    <p className='subtext'>Atlanta, GA</p>
                </div>
            </div>
        </>
    )
}