import Event from './Event'
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment"
import DateTimePicker from 'react-datetime-picker';

import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = ({handleLogout, handleAddEvent, handleAddManyEvents, handleEditEvent, handleDeleteEvent,handleMultipleEventsChange, handleDeleteMultipleEvents, feEvents, user}) => {
    const localizer = momentLocalizer(moment);
    console.log('event size', feEvents)
    const email = user.email
    const username = email.split("@")[0]

    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('10:00');
    const [period, setPeriod] = useState(1)

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [havePeriod, setHavePeriod] = useState(false)

    const [formatedStartTime, setSelectedStartTime] = useState(new Date());
    const [formatedEndTime, setSelectedEndTime] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [modal, setModal] = useState(null)
    // const [feEvents, setFeEvents] = useState([])
    // const mappedEvents = events.map(event => {
    //   return {
    //     id: event.EVENT_ID,
    //     title: event.TITLE,
    //     start: moment(event.START_TIME).toDate(),
    //     end: moment(event.END_TIME).toDate(),
    //     descriptions: event.DESCRIPTIONS,
    //     location: event.LOCATION,
    //     period: event.PERIOD
    //   }})
  
    // const updateEvents = () => {
    //   const mappedEvents = events.map(event => {
    //     return {
    //       id: event.EVENT_ID,
    //       title: event.TITLE,
    //       start: moment(event.START_TIME).toDate(),
    //       end: moment(event.END_TIME).toDate(),
    //       descriptions: event.DESCRIPTIONS,
    //       location: event.LOCATION,
    //       period: event.PERIOD
    //     }})

    //   setFeEvents(mappedEvents)
    // }

    // let eventForFE = []
    // const updateEvents = () => {
    //   eventForFE = events.map(event => {
    //         return {
    //           id: event.EVENT_ID,
    //           title: event.TITLE,
    //           start: moment(event.START_TIME).toDate(),
    //           end: moment(event.END_TIME).toDate(),
    //           descriptions: event.DESCRIPTIONS,
    //           location: event.LOCATION,
    //           period: event.PERIOD
    //         }})
    // }
    // updateEvents();

    const handleStartTimeChange = (date) => {
      setStartTime(date);
    };
    const handleSelectedEvent = (event)=>{
      console.log(event);
      setSelectedEvent(event);
      setSelectedStartTime(moment(event.start).toDate()); // Set formatedStartTime to the start time of the selected event
      setSelectedEndTime(moment(event.end).toDate());
      setStartTime(formatTimeHour(selectedEvent.start))
      setEndTime(formatTimeHour(selectedEvent.end))
      setModal(true)
   
    }

    const handleEndTimeChange = (date) => {
      setEndTime(date);
    };

    const closeModal =()=>{
      setModal(false);
    }
    const formatTimeHour = (date)=>{
      console.log("date is ",date)
      let hours = String(date.getHours()).padStart(2,'0')
      let minutes = String(date.getMinutes()).padStart(2,'0')
      console.log("hours is ",hours)
      console.log("minutes is ", minutes)
      let time = hours+":"+minutes
      console.log("time is " +time)
      return time
    }

    const formatTime2 = (time)=>{
      console.log("Before formating time is " + time)
      let parseStartTime = new Date(time);
      let year= parseStartTime.getFullYear();
      let month = parseStartTime.getMonth() + 1;
      let day= parseStartTime.getDate();
      let hours = parseStartTime.getHours();
      let minutes = parseStartTime.getMinutes();
      let seconds = parseStartTime.getSeconds();

      const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      console.log("after formating time is " + formattedTime)
      return formattedTime;
    }
    //formating the time into the right format
    const formatTime = (date, time)=>{
      console.log("Before formating time is " + date + " " + time)
      //let parseStartTime = new Date(time);
      let year= date.getFullYear();
      let month = date.getMonth() + 1;
      let day= date.getDate();

      let hours = time.split(":")[0];
      let minutes = time.split(":")[1];
      let seconds = '00';


      let updateMonth = month.toString().length === 1 ? `0${month}` : `${month}`
      let updateDay = day.toString().length === 1 ? `0${day}` : `${day}`
      let updateHour = hours.toString().length === 1 ? `0${hours}` : `${hours}`
      let updateMinute = minutes.toString().length === 1 ? `0${minutes}` : `${minutes}`
      let updateSecond = seconds.toString().length === 1 ? `0${seconds}` : `${seconds}`

      const formattedTime = `${year}-${updateMonth}-${updateDay}T${updateHour}:${updateMinute}:${updateSecond}`;
      console.log("after formating time is " + formattedTime)
      return formattedTime;
    }
    //handling adding events
    const findGroupId = () => {
      let counter = 0;
      for( let event of feEvents){
        if( event.groupId > counter ){
          counter = event.groupId
        }
      }
      return counter + 1
    }
    const handleAddingEvent= (e)=>
    {
      e.preventDefault();
      if( havePeriod == false ){
        let startTimeFormated = formatTime(startDate, startTime)
        let endTimeFormated = formatTime(startDate, endTime)
        const formData = new FormData(e.target);
        const eventData = {
            TITLE: formData.get('eventTitle'),
            START_TIME: startTimeFormated, 
            END_TIME: endTimeFormated,
            PERIOD: null,
            LOCATION: formData.get('eventLocation'),
            DESCRIPTIONS: formData.get('eventDescription'),
            GROUP_ID: findGroupId()
        };
        if( window.confirm("Adding this event?") ){
          formData.get('eventTitle')
          handleAddEvent(eventData);
        }
      }else{
        if( window.confirm("Adding all events?") ){
          let eventDatas = []
          const formData = new FormData(e.target);
          let groupId = findGroupId();
          let p = parseInt(formData.get('eventPeriod'))
          console.log('period', period)

          console.log('start and end', startDate.getDate(), endDate.getDate())
          let enteredLoc = formData.get('eventLocation')
          let enteredDes = formData.get('eventDescription')
          let enteredTitle = formData.get('eventTitle')


          let d = new Date( startDate ).setHours(0,0,0,0)
          let de = new Date( endDate ).setHours(0,0,0,0)

          console.log('current Date adn end date', d, endDate)

          while( d <= de ){
            console.log('current start date d and end date is',startDate, d, endDate)

            let startTimeFormated = formatTime(d, startTime)
            let endTimeFormated = formatTime(d, endTime)
            
            const eventData = {
                TITLE: enteredTitle,
                START_TIME: startTimeFormated, 
                END_TIME: endTimeFormated,
                PERIOD: parseInt(period),
                LOCATION: enteredLoc,
                DESCRIPTIONS: enteredDes,
                GROUP_ID: groupId
            };
            eventDatas.push(eventData)
            d.setDate(d.getDate() + p)
          }
          console.log('size event Datas', eventDatas.length)
          handleAddManyEvents(eventDatas);
        }
      }
    }
    const handleChange = (e) => {
      e.preventDefault();
      let eventID = selectedEvent.id;
      const eventData = {
        EVENT_ID: selectedEvent.id,
        TITLE: selectedEvent.title,
        START_TIME: formatTime2(formatedStartTime),
        END_TIME: formatTime2(formatedEndTime),
        PERIOD: selectedEvent.period,
        LOCATION: selectedEvent.location,
        DESCRIPTIONS: selectedEvent.descriptions
      };
      handleEditEvent(eventData, eventID);
      closeModal();
    };

    console.log('envet Size is', feEvents.length)
    return(

        <div>
            <button onClick={handleLogout}>Log out</button>
            {username} logged in

            <h1> Main Page</h1>
          <div id="add-event-board" >
            <form style={{ marginBottom: '180px', marginTop: '100px', marginLeft: '70px', marginRight: '70px', border: 'solid', padding: "20px" }} onSubmit={handleAddingEvent}>
              <label for='title'>Event title:</label>
              <input type='text' name='eventTitle' required/>
              <label for='desciprtion'>Description: </label>
              <input type='text' name='eventDescription' required/>
              <label for='location'>Location: </label>
              <input type='text' name='eventLocation' required/><br/>

              <lable for='startDate'>Start Date: </lable><br/>
              <DatePicker onChange={(date) => {setStartDate(date)}} selected={startDate}  /><br/>

              <label for='startTime'>Start Time</label><br/>
              <TimePicker value={startTime} onChange={setStartTime} /><br/>
              
              <label for='endTime'>End Time</label><br/>
              <TimePicker value={endTime} onChange={setEndTime} /><br/>

              <input type="checkbox" id="coding" name="interest" value="coding" onClick={() => {
                document.getElementById('set-period').style.display = document.getElementById('set-period').style.display === 'block' ? 'none' : 'block'
                setHavePeriod(!havePeriod)
              }} /> Add Period <br/>
              

              <div id='set-period' style={{display: 'none'}}>
                <lable htmlFor='startDate'>End Date: </lable><br/>
                <DatePicker onChange={(date) => {setEndDate(date)}} selected={endDate} minDate={startDate}  /><br/>
                <label htmlFor='period'>Period(days):</label>
                <input type='number' min={1} name='eventPeriod' onChange={(e) => {e.preventDefault(); setPeriod(parseInt(e.target.value))}} value={period} required /><br/>
              </div>
              <input type='submit' value="submit"/>
            </form>
          </div>
            
          <Calendar
            localizer={localizer}
            events={feEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable={true}
            onSelectEvent={handleSelectedEvent}
          />
          {selectedEvent && modal && (
           <div className="modal show">
            <Modal show={modal} onHide={closeModal} centered size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Event details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <form>
                <label>Title:</label>
                <input type="text" name="formatedTitle" value={selectedEvent.title} onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})} /><br/><br/>
                {selectedEvent.period == null && (
                  <div>
                    <label>Start time:</label><br/>
                    <DateTimePicker onChange={(date)=> setSelectedStartTime(date)} value={formatedStartTime} defaultValue={selectedEvent.start} /><br/><br/>
                    <label>End time:</label><br/>
                    <DateTimePicker onChange={(date)=> setSelectedEndTime(date)} value={formatedEndTime} defaultValue={selectedEvent.end} /><br/><br/>
                  </div>
                )}
                {selectedEvent.period != null && (
                  <div>
                        <label htmlFor='startTime'>Start Time</label><br/>
                        <TimePicker value={startTime} onChange={setStartTime} defaultValue  ={formatTimeHour(selectedEvent.start)}/><br/>
              
                        <label htmlFor='endTime'>End Time</label><br/>
                        <TimePicker value={endTime} onChange={setEndTime} /><br/>
                  </div>
                )}
                <label>Descriptions:</label>
                <input type="text" name="formatedDescriptions" value={selectedEvent.descriptions} onChange={(e) => setSelectedEvent({...selectedEvent, descriptions: e.target.value})} /><br/><br/>
                <label>Location:</label>
                <input type="text" name="formatedLocation" value={selectedEvent.location} onChange={(e) => setSelectedEvent({...selectedEvent, location: e.target.value})} /><br/>
                <label>ID : {selectedEvent.id}</label>
              </form>
              </Modal.Body>
              <Modal.Footer>
              <Button variant='warning' onClick={() => {if (window.confirm("Do you really want delete this event?")) {handleDeleteEvent(selectedEvent.id); closeModal(); }}}>
                Delete
              </Button>
              <Button variant="primary" onClick={handleChange}>
                  Save Changes
              </Button>
              {selectedEvent.period != null &&(
                <div>
                    <Button variant='dark' 
                            style={{marginRight:'10px'}}
                            onClick ={()=>{
                              if(window.confirm('Do you want to change all events from this point to the future'))
                              {
                                let eventID = selectedEvent.id
                                const eventData ={
                                                  EVENT_ID: selectedEvent.id,
                                                  TITLE: selectedEvent.title,
                                                  START_TIME: startTime,
                                                  END_TIME: endTime,
                                                  PERIOD: selectedEvent.period,
                                                  LOCATION: selectedEvent.location,
                                                  DESCRIPTIONS: selectedEvent.descriptions
                                                }
                                handleMultipleEventsChange(eventData,eventID) 
                                closeModal()
                              }
                            }}        
                    >
                      Change all events
                    </Button>
                    <Button variant='danger' onClick={()=>{
                      if(window.confirm('Do you want to delete all events from this point to the future'))
                      {
                          handleDeleteMultipleEvents(selectedEvent.id)
                          closeModal()
                      }
                    }}>
                      Delete all events
                    </Button>
                </div>
             
              )}
                <Button variant="secondary" onClick={closeModal}>
                  Close
              </Button>
              </Modal.Footer>
            </Modal>
            </div>
          )}
          <div style={{height: '200px'}}>

          </div>
        </div>

        
    )
}

export default MainPage