import { useState, useEffect} from 'react'
import AuthForm from './components/AuthForm'
import MainPage from './components/MainPage'
import loginService from './services/login'
import customStorage from './services/customStorage'
import eventServices from './services/events'
import Togglable from './components/Togglable'
import moment from "moment"

function App() {
  const [curUser, setCurUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  //const [logged, setLogged] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [feEvents, setFeEvents] = useState([])
  

  useEffect(() => {
    const loggedUser = customStorage.getItem('localUser')
    if(loggedUser){
      const lUser = JSON.parse(loggedUser)
      setCurUser(lUser);
      eventServices.getForUser(lUser.id).then(res => {
        setEvents(res.data)
        const eventsForFe = res.data.map(event => {
          return {
            id: event.EVENT_ID,
            title: event.TITLE,
            start: moment(event.START_TIME).toDate(),
            end: moment(event.END_TIME).toDate(),
            descriptions: event.DESCRIPTIONS,
            location: event.LOCATION,
            period: event.PERIOD,
            groupId: event.GROUP_ID
          }
        })
        setFeEvents(eventsForFe)
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

      const eventsForFe = validEvents.data.map(event => {
        return {
          id: event.EVENT_ID,
          title: event.TITLE,
          start: moment(event.START_TIME).toDate(),
          end: moment(event.END_TIME).toDate(),
          descriptions: event.DESCRIPTIONS,
          location: event.LOCATION,
          period: event.PERIOD,
          groupId: event.GROUP_ID
        }
      })
      setFeEvents(eventsForFe)

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

  const handleAddManyEvents = async (eventDatas) =>{
    try{
      let addFeEvents = []
      for( let eventData of eventDatas){
        console.log("Handle adding event " + JSON.stringify(eventData));
        const userId= curUser.id;
        const event = await eventServices.addEvent(eventData,userId);
        const newEvent = event.data
        console.log("Handle adding event 2 " + JSON.stringify(newEvent));


        let newEventForFe = {
            id: newEvent.EVENT_ID,
            title: newEvent.TITLE,
            start: moment(newEvent.START_TIME).toDate(),
            end: moment(newEvent.END_TIME).toDate(),
            descriptions: newEvent.DESCRIPTIONS,
            location: newEvent.LOCATION,
            period: newEvent.PERIOD,
            groupId: newEvent.GROUP_ID
          }

        console.log('newly added event is', newEventForFe)
        addFeEvents.push(newEventForFe)
      }

      const newFeEvents = feEvents.concat(addFeEvents)
      console.log('size of add events is: ', addFeEvents.length)
      setFeEvents(newFeEvents)

      console.log('added events size is ', feEvents)

    }catch( error ){
      console.error("Error adding many event " + error);
    }
  }

  const handleAddEvent = async (eventData)=>{
    try {
      console.log("Handle adding event " + eventData);
      const userId= curUser.id;
      const newEvent = await eventServices.addEvent(eventData,userId);

      console.log('event data', newEvent.data.START_TIME)
      const newEvents = events.concat([newEvent.data])
      setEvents(newEvents)

      const newEventForFe = newEvents.map(event => {
        return{
          id: event.EVENT_ID,
          title: event.TITLE,
          start: moment(event.START_TIME).toDate(),
          end: moment(event.END_TIME).toDate(),
          descriptions: event.DESCRIPTIONS,
          location: event.LOCATION,
          period: event.PERIOD,
          groupId: event.GROUP_ID
        }
      })
      setFeEvents(newEventForFe)

    } catch (error) {
      console.error("Error adding event " + error);
    }
  }

  const handleEditEvent = async (eventData,eventID)=>{
    try {
      await eventServices.editEvent(eventData,eventID);
      const updatedEvents = await eventServices.getForUser(curUser.id);

      const updatedFeEvents = updatedEvents.data.map(event => {
        return {
          id: event.EVENT_ID,
          title: event.TITLE,
          start: moment(event.START_TIME).toDate(),
          end: moment(event.END_TIME).toDate(),
          descriptions: event.DESCRIPTIONS,
          location: event.LOCATION,
          period: event.PERIOD,
          groupId: event.GROUP_ID
        };
      });
      setFeEvents(updatedFeEvents);
    } catch (error) {
      console.error("Error adding event " + error);
    }
  }
  const handleMultipleEventsChange = async (eventData,eventID)=>
  {
    try {
      await eventServices.editMultipleEvent (eventData,eventID);
      const updatedEvents = await eventServices.getForUser(curUser.id);

      const updatedFeEvents = updatedEvents.data.map(event => {
        return {
          id: event.EVENT_ID,
          title: event.TITLE,
          start: moment(event.START_TIME).toDate(),
          end: moment(event.END_TIME).toDate(),
          descriptions: event.DESCRIPTIONS,
          location: event.LOCATION,
          period: event.PERIOD,
          groupId: event.GROUP_ID
      };
    });
    setFeEvents(updatedFeEvents);
    } catch (error) {
      console.error("Error adding event " + error);
    }
  }

  const handleDeleteMultipleEvents = async (eventID)=>{
    await eventServices.deleteMultipleEvents(eventID)
    const updatedEvents = await eventServices.getForUser(curUser.id);

    const updatedFeEvents = updatedEvents.data.map(event => {
      return {
        id: event.EVENT_ID,
        title: event.TITLE,
        start: moment(event.START_TIME).toDate(),
        end: moment(event.END_TIME).toDate(),
        descriptions: event.DESCRIPTIONS,
        location: event.LOCATION,
        period: event.PERIOD,
        groupId: event.GROUP_ID
      };
    });
    setFeEvents(updatedFeEvents);
  }

  // const reformatTime = (time) => {
  //   const components = time.split("T")
  //   let timeComps = components[1].split(":")
  //   let finalTime = ""
  //   let counter = 0
  //   for(let timeComp of timeComps ){
  //     if( timeComp.toString().length === 1){
  //       finalTime += `0${timeComp}`
  //       if( counter  === 2 && !timeComp.toString().includes('Z')){
  //         finalTime += '.000Z'
  //       }
  //     }else{
  //       finalTime += `${timeComp}`
  //     }
  //     counter ++
  //     if(counter !== 3){
  //       finalTime += ":"
  //     }
  //   }
  //   return `${components[0]}T${finalTime}`
  // }

  const handleDeleteEvent = async(id) => {
    await eventServices.deleteEvent(id);
    const eventsAfterDeleted = events.filter(event => event.EVENT_ID !== id)
    setEvents(eventsAfterDeleted)

    const feEventsAfterDeleted = feEvents.filter(event => event.id !== id)
    setFeEvents(feEventsAfterDeleted)
    
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
        <MainPage handleLogout = {handleLogout} handleAddEvent={handleAddEvent} handleAddManyEvents={handleAddManyEvents} handleEditEvent={handleEditEvent} handleDeleteEvent = {handleDeleteEvent} handleMultipleEventsChange= {handleMultipleEventsChange} handleDeleteMultipleEvents={handleDeleteMultipleEvents} feEvents = {feEvents} user = {curUser} />
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
