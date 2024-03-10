import { useState, useEffect} from 'react'
import AuthForm from './components/AuthForm'
import MainPage from './components/MainPage'
import loginService from './services/login'
import customStorage from './services/customStorage'
import eventServices from './services/events'
import Togglable from './components/Togglable'

function App() {
  const [curUser, setCurUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  //const [logged, setLogged] = useState(false)
  const [events, setEvents] = useState([])
  const [curUserEvents, setCurUserEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventServices.getAll().then(res => {
      const allEvents = res.data
      setEvents(res.data)
      const loggedUser = customStorage.getItem('localUser')
      if(loggedUser){
        const lUser = JSON.parse(loggedUser)
        setCurUser(lUser);
        const validEvents = allEvents.filter(event => checkEvent(event, lUser.events))
        console.log(validEvents.length, "is length")
        setCurUserEvents(validEvents)
        setLoading(false)
      }
      
    })
  },[])

  //method to check if an event match as of an user
  const checkEvent = (eve, eve_ids) => {
    for(let eve_id of eve_ids){
      if( eve[0] == eve_id){
        return true
      }
    }
    return false
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
    console.log(event.target.value)
  }
  const handleEmail = (event) => {
    setEmail(event.target.value)
    console.log(event.target.value)
  }
  const handleLogin = async(event) => {
    event.preventDefault();
    try{
      const logUser = await loginService.login({email: email, password})

      //get all the events match current user
      const validEvents = events.filter(event => checkEvent(event, logUser.events))
      console.log(validEvents.length, "is length")
      setCurUserEvents(validEvents)

      //handle logging in
      setCurUser(logUser);
      customStorage.setItem('localUser', JSON.stringify(logUser));
      console.log(logUser)
      setUsername('');
      setPassword('');

    }catch{
      setError('Wrong username or password')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setCurUser(null)
    setEmail('')
    setPassword('')
  }

  const loginForm = () => {
    return(
      <div>
        <AuthForm 
          handleLogin={handleLogin} 
          email={email} password={password} 
          handleEmail={handleEmail} 
          handlePassword={handlePassword} 
          error={error}
        /> 
      </div>
    )
  }

  const mainPage = () => {
    console.log('haha', curUserEvents.length)
    return(
      <div>
        <MainPage handleLogout = {handleLogout} events = {curUserEvents} />
      </div>
    )
  }

  return (
    <>
      <div>
        {curUser == null && loginForm()} 
        {curUser != null && mainPage()}
      </div>
    </>
  )
}

export default App
