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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loggedUser = customStorage.getItem('localUser')
    if(loggedUser){
      const lUser = JSON.parse(loggedUser)
      setCurUser(lUser);
      eventServices.getForUser(lUser.id).then(res => {
        setEvents(res.data)
        setLoading(false)
      })
    }
  },[])

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
      const validEvents = await eventServices.getForUser(logUser.id)
      setEvents(validEvents.data)

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
  const handleAddEvent = async (eventData)=>{
    try {
      console.log("Handle adding event " + eventData);
      const userId= curUser.id;
      await eventServices.addEvent(eventData,userId);
    } catch (error) {
      console.error("Error adding event " + error);
    }
  }

  const handleEditEvent = async (eventData,eventID)=>{
    try {
      await eventServices.editEvent(eventData,eventID);
    } catch (error) {
      console.error("Error adding event " + error);
    }
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
    return(
      <div>
        <MainPage handleLogout = {handleLogout} handleAddEvent={handleAddEvent} handleEditEvent={handleEditEvent} events = {events} user = {curUser} />
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
