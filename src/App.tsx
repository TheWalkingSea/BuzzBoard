import './App.css'
import Weather from './Weather'

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
    </>
  )
}

export default App
