import { useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = (props) => {
  const [ visible, setVisible] = useState(false)
  const showWhenVisible =  { display: visible ? '': 'none' }
  const showWhenInvisible = { display: visible ? 'none' : '' }

  const toggleVisible = () => {
    setVisible(!visible)
  }

  return(
    <div>
      <h1> LOG IN TO CALENDAR 2.0</h1>
      <div style={showWhenInvisible}>
        <button onClick={toggleVisible}>{props.labelName}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisible}> cancel</button>
      </div>
    </div>
  )
}

Togglable.propTypes = {
  labelName: PropTypes.string.isRequired
}

export default Togglable