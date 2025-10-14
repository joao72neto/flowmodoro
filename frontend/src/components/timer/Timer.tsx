import { useState } from 'react'
import './Timer.css'

function Timer() {
  const [count, setCount] = useState(0)

  return (
    <div className='timer'>
      <p>Hello World!</p>
      <button onClick={() => setCount(count + 1)}>Click {count}</button>
    </div>
  )
}

export default Timer;
