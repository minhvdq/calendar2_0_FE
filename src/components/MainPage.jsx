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

const MainPage = ({handleLogout, handleAddEvent, handleAddManyEvents, handleEditEvent, handleDeleteEvent, feEvents, user}) => {
    const localizer = momentLocalizer(moment);
    console.log('event size', feEvents)
    const email = user.email
    const username = email.split("@")[0]

    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('10:00');

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [havePeriod, setHavePeriod] = useState(false)

    const [formatedStartTime, setSelectedStartTime] = useState(new Date());
    const [formatedEndTime, setSelectedEndTime] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [modal, setModal] = useState(null)
    const [period, setPeriod] = useState(null)
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
      setModal(true)
      setSelectedStartTime(moment(event.start).toDate()); // Set formatedStartTime to the start time of the selected event
      setSelectedEndTime(moment(event.end).toDate());
    }

    const handleEndTimeChange = (date) => {
      setEndTime(date);
    };

    const closeModal =()=>{
      setModal(false);
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
          console.log('period', p)

          console.log('start and end', startDate.getDate(), endDate.getDate())
          let enteredLoc = formData.get('eventLocation')
          let enteredDes = formData.get('eventDescription')
          let enteredTitle = formData.get('eventTitle')

          let d = new Date( startDate )

          while( d.getDate() <= endDate.getDate() ){
            console.log('current start date d and end date is',startDate, d, endDate)

            let startTimeFormated = formatTime(d, startTime)
            let endTimeFormated = formatTime(d, endTime)
            
            const eventData = {
                TITLE: enteredTitle,
                START_TIME: startTimeFormated, 
                END_TIME: endTimeFormated,
                PERIOD: p,
                LOCATION: enteredLoc,
                DESCRIPTIONS: enteredDes,
                GROUP_ID: groupId
            };
            eventDatas.push(eventData)
            d.setDate(d.getDate() + p)
          }
          handleAddManyEvents(eventDatas);
        }
      }
      
      // window.location.reload()
      // updateEvents();
    }
    const handleChange = (e) => {
      e.preventDefault();
      let eventID = selectedEvent.id;
      const eventData = {
        EVENT_ID: selectedEvent.id,
        TITLE: selectedEvent.title,
        START_TIME: formatTime(formatedStartTime),
        END_TIME: formatTime(formatedEndTime),
        PERIOD: selectedEvent.period,
        LOCATION: selectedEvent.location,
        DESCRIPTIONS: selectedEvent.descriptions
      };
      console.log(eventData);
      handleEditEvent(eventData, eventID);
      closeModal();
      // window.location.reload()
      // updateEvents();
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
              
              <label for='startTime'>End Time</label><br/>
              <TimePicker value={endTime} onChange={setEndTime} /><br/>

              <input type="checkbox" id="coding" name="interest" value="coding" onClick={() => {
                document.getElementById('set-period').style.display = document.getElementById('set-period').style.display === 'block' ? 'none' : 'block'
                setHavePeriod(!havePeriod)
              }} /> Add Period <br/>
              

              <div id='set-period' style={{display: 'none'}}>
                <lable for='startDate'>End Date: </lable><br/>
                <DatePicker onChange={(date) => {setEndDate(date)}} selected={endDate} minDate={startDate}  /><br/>
                <label for='period'>Period(days):</label>
                <input type='number' min={1} name='eventPeriod' value={1} required /><br/>
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
                <label>Start time:</label><br/>
                <DateTimePicker onChange={(date)=> setSelectedStartTime(date)} value={formatedStartTime} defaultValue={selectedEvent.start} /><br/><br/>
                <label>End time:</label><br/>
                <DateTimePicker onChange={(date)=> setSelectedEndTime(date)} value={formatedEndTime} defaultValue={selectedEvent.end} /><br/><br/>
                <label>Descriptions:</label>
                <input type="text" name="formatedDescriptions" value={selectedEvent.descriptions} onChange={(e) => setSelectedEvent({...selectedEvent, descriptions: e.target.value})} /><br/><br/>
                <label>Location:</label>
                <input type="text" name="formatedLocation" value={selectedEvent.location} onChange={(e) => setSelectedEvent({...selectedEvent, location: e.target.value})} />
              </form>
              </Modal.Body>
              <Modal.Footer>
              <Button variant='secondary' onClick={() => {if (window.confirm("Do you really want delete this event?")) {handleDeleteEvent(selectedEvent.id); closeModal(); }}}>
                Delete
              </Button>
              <Button variant="secondary" onClick={closeModal}>
                  Close
              </Button>
              <Button variant="primary" onClick={handleChange}>
                  Save Changes
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