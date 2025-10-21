import { useContext } from 'react';
import { useTimer, useTimerSync } from '../utils/Hooks';
import ServerContext from '../utils/ServerContext';
import './MealPlan.css';

const FIRST_DAY_OF_SCHOOL = new Date(2025, 8-1, 18);

// Months are zero-aligned!
const DAYS_OUT = [
    new Date(2025, 9-1, 5),
    new Date(2025, 9-1, 6),
    new Date(2025, 9-1, 7),
    new Date(2025, 10-1, 3),
    new Date(2025, 10-1, 4),
    new Date(2025, 10-1, 5),
    new Date(2025, 10-1, 6),
    new Date(2025, 10-1, 7),
    new Date(2025, 10-1, 17),
    new Date(2025, 10-1, 18),
    new Date(2025, 11-1, 21),
    new Date(2025, 11-1, 22),
    new Date(2025, 11-1, 23),
    new Date(2025, 11-1, 24),
    new Date(2025, 11-1, 25),
    new Date(2025, 11-1, 26),
    new Date(2025, 11-1, 27),
    new Date(2025, 11-1, 28),
    new Date(2025, 11-1, 29)
]

const TOTAL_DAYS = 115 - DAYS_OUT.length;

// Growth factor for the meal plan progress bar
const GROWTH_FACTOR = 4;

type MealPlan = {
    diningDollars: number,
    mealSwipes: number
}

function calculateDaysPassed() {
    const current = new Date();

    let days_passed = (current.getTime() - FIRST_DAY_OF_SCHOOL.getTime()) / (1000 * 60 * 60 * 24);
    for (const day of DAYS_OUT) {
        if (day <= current) {
            days_passed--;
        } else {
            break;
        }
    }

    return days_passed;
}

export function ProgressBar({ percentage, relativePercentage}: {percentage: number, relativePercentage: number}) {

    const absRelativePercentage = Math.abs(relativePercentage);

    const width = percentage * absRelativePercentage / 100;
    const transformedWidth = 100 * (1 - Math.pow(Math.E, -1 * GROWTH_FACTOR * width / 100)) /
                                (1 - Math.pow(Math.E, -1 * GROWTH_FACTOR));


    return (
        <div className="percentageContainer">
            <div className="percentage" style={{width: `${percentage}%`}  as React.CSSProperties}></div>
            <div className="percentage relativePercentage" style={{
                width: `${transformedWidth}%`,
                // width: `${absRelativePercentage}%`,
                backgroundColor: relativePercentage > 0 ? "var(--green)" : "var(--red)",
                left: `${(percentage - percentage * absRelativePercentage / 100) - (transformedWidth - width)}%`
            } as React.CSSProperties}></div>
        </div>
    )
}

function fetchDiningData(serverURI: string): Promise<MealPlan> {
    return fetch(serverURI + '/mealplan')
    .then((response) => {
        if (response.status == 500) {
            return new Promise<MealPlan>((resolve) => {
                setTimeout(() => {
                    fetchDiningData(serverURI).then((resolve));
                })
            })
        }
        return response.json();
    })
}

export default function MealPlan() {
    const serverURI = useContext(ServerContext);

    const diningData = useTimer({
        diningDollars: -1,
        mealSwipes: -1
    }, () => fetchDiningData(serverURI), 100*1000);

    const days_passed = useTimerSync(-1, calculateDaysPassed, 120*1000);


    const relativeSwipes = (200 - diningData.mealSwipes) - (days_passed * (200 / TOTAL_DAYS));
    const relativeDiningDollars = ((788 - diningData.diningDollars) - (days_passed * (788 / TOTAL_DAYS)));

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
                    <span className="textRight">${(relativeDiningDollars).toFixed(2)}</span>
                </div>
                {/* $788 dining dollars in a flex package */}
                <ProgressBar percentage={100 * ( 1 - diningData.diningDollars / 788)} relativePercentage={100 * relativeDiningDollars / 788} />
            </div>

            <div className="mealSwipes">
                <div className="topBar">
                    <img src="images/ticket-solid-full.svg" alt="Meal Swipe Ticket" width="36" />
                    <span>Meal Swipes Left</span>
                    <span className="textRight">{Math.floor(relativeSwipes)} Swipes</span>
                </div>
                {/* 200 Meals in a flex package */}
                <ProgressBar percentage={100 * (1 - diningData.mealSwipes / 200 )} relativePercentage={100 * relativeSwipes / 200} />
            </div>
        </section>
    )
}