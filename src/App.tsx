import './App.css'
import Weather from './Weather'
import QuoteOfTheDay from './QuoteOfTheDay'
import Clock from './Clock'

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

      <QuoteOfTheDay quote="There is no passion to be found playing small - in settling for a life that is less than the one you are capable of living.\n- Nelson Mandela"/>
      <Clock />

    </>
  )
}

export default App
