import './MealPlan.css';

export function ProgressBar({ percentage }: {percentage: number}) {
    return (
        <div className="percentageContainer">
            <div className="percentage" style={{width: `${percentage}%`}}></div>
        </div>
    )
}

export default function MealPlan() {


    return (
        <section className="mealPlan">
            <div className="containerHeading">
                <img src="images/utensils-solid-full.svg" alt="Meal Plan" width="40"/>
                <h2 className="heading">Meal Plan</h2>
            </div>

            <div>
                <div className="topBar">
                    <img src="images/credit-card-solid-full.svg" alt="Credit Card" width="36" />
                    <span>Dining Dollars</span>
                    <span className="textRight">$15.23</span>
                </div>
                <ProgressBar percentage={50} />
            </div>

            <div className="mealSwipes">
                <div className="topBar">
                    <img src="images/ticket-solid-full.svg" alt="Meal Swipe Ticket" width="36" />
                    <span>Meal Swipes Left</span>
                    <span className="textRight">13</span>
                </div>
                <ProgressBar percentage={60} />
            </div>
        </section>
    )
}