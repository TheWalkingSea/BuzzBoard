import './App.css'
import Weather from './Components/Weather'
import QuoteOfTheDay from './Components/QuoteOfTheDay'
import Clock from './Components/Clock'
import Progress from './Components/Progress'
import Assignments from './Components/Assignments'
import MealPlan from './Components/MealPlan'
import Schedule from './Components/Schedule'
import Notifications from './Components/Notifications'
import ServerStatus from './Components/ServerStatus'

function App() {

  return (
    <>
      <header>
        <div className="logo">
          <img src="/images/gatech.svg" alt="Georgia Tech Logo" width="211" height="162"/>
          <p className="gatechFont">Georgia Tech<br/>BuzzBoard</p>
        </div>

        <Weather />
        
      
      </header>

      <QuoteOfTheDay />
      <Clock />

      <div style={{gridColumn: '1 / 6'}}>
        <Progress />
        <MealPlan />
      </div>

      <Assignments />

      <Schedule />

      <Notifications />

      <ServerStatus />

    </>
  )
}

export default App
