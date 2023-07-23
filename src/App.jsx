import React from 'react'
import Die from './components/Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {

  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.floor(Math.random() * (6 - 1 + 1)) + 1,
      isHeld: false
    }
  }

  function allNewDice() {
    const newArr = []
    for (let i = 0; i < 10; i++) {
      newArr.push(generateNewDie());
    }
    return newArr;
  }

  const [diceArr, setDiceArr] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)

  const [roll, setRoll] = React.useState(0)
  const [lose, setLose] = React.useState(false)
  
  /* Timer*/

  const [time, setTime] = React.useState(0);
  const intervalRef = React.useRef();
  
  const timer = () => {
    if (!tenzies && !lose) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1000); // Increment by 1 second (1000 milliseconds)
      }, 1000);    
    } else {
      setTime(time)
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTime(0);
  };

  const formatTime = (timeInMillis) => {
    const hours = Math.floor(timeInMillis / 3600000);
    const minutes = Math.floor((timeInMillis % 3600000) / 60000);
    const seconds = Math.floor((timeInMillis % 60000) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  React.useEffect(() => {
    
    timer()

    return function () {
      clearInterval(intervalRef.current)

    }
    
  },[tenzies, lose])

  

  React.useEffect(() => {
    const allHeld = diceArr.every(item => item.isHeld);
    const num = diceArr[0]['value']
    const allSame = diceArr.every(item => item.value === num)
    if (allHeld && allSame) {
      setTenzies(true)
      console.log("You won!")
    } else if (allHeld && !allSame) {
      setLose(true)
      console.log("You Lost!")
    }

  }, [diceArr])


  const dice = diceArr.map(item =>
    <Die
      key={item.id}
      value={item.value}
      isHeld={item.isHeld}
      hold={() => !tenzies && !lose && holdDice(item.id)
      }
    />
  )

  function rollDice() {
    setDiceArr(prevDiceArr => prevDiceArr.map(
      die => die.isHeld ? die : generateNewDie()
    ))
    setRoll(prevRoll => prevRoll + 1)
  }

  function holdDice(id) {
    setDiceArr(prevDiceArr => prevDiceArr.map(
      die => die.id === id ? { ...die, isHeld: !die.isHeld } : die))
  }

  return (
    <main>
      <div className='tenzies'>
        {tenzies && <Confetti
          width={510}
          height={517}
        />}
        <div className="active">
          <p className='status'>{(tenzies && 'You Won 😀👏') || (lose && 'You Lost 😭😱')}</p>
          <h1 className="tenzies-heading">Tenzies</h1>
          <p className="tenzies-subheading">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

          <div className="playzone">
            {dice}
          </div>

          <button onClick={tenzies || lose ?
            () => { setTenzies(false); setLose(false); setRoll(0); resetTimer(); setDiceArr(allNewDice()) }
            : rollDice}

          >
            {tenzies || lose ? 'New Game' : 'Roll'}
          </button>

          <p className='info-game'>
            
            Game Timer: {formatTime(time)} <br />
            Number of Rolls : {roll}
          </p>

        </div>
      </div>
    </main>
  )

}

export default App
