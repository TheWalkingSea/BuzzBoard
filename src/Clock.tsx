import './Clock.css'


export default function Clock() {
    return (
        <div className="clock">
            <div className="leftBlock block">
                <div className="centered">
                    <div className="hour large">09</div>
                </div>
                <div className="meridiem small">am</div>
            </div>
            <div className="large">:</div>
            <div className="rightBlock block">
                <div className="centered">
                    <div className="minutes large">50</div>
                </div>
                <div className="seconds small">36</div>
            </div>
        </div>
    )
}