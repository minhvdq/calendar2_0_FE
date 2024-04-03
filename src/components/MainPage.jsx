import Event from './Event'
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment"
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = ({handleLogout, handleAddEvent, handleEditEvent, events, user}) => {
    const localizer = momentLocalizer(moment);
    console.log('event size', events)
    const email = user.email
    const username = email.split("@")[0]

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());


    const [formatedStartTime, setSelectedStartTime] = useState(new Date());
    const [formatedEndTime, setSelectedEndTime] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [modal, setModal] = useState(null)
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
    const formatTime = (time)=>{
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
    //handling adding events
    const handleAddingEvent= (e)=>
    {
      e.preventDefault();
      let startTimeFormated = formatTime(startTime)
      let endTImeFormated = formatTime(endTime)
      const formData = new FormData(e.target);
      const eventData = {
          TITLE: formData.get('eventTitle'),
          START_TIME: startTimeFormated, 
          END_TIME: endTImeFormated,
          PERIOD: formData.get('eventPeriod'),
          LOCATION: formData.get('eventLocation'),
          DESCRIPTIONS: formData.get('eventDescription')
      }; 
      handleAddEvent(eventData);
      window.location.reload()
    }
    const handleChange = (e) => {
      e.preventDefault();
      let eventID = selectedEvent.id;
      const eventData = {
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
      window.location.reload()
    };



    const Events = events.map(event => {
      return {
        id: event.EVENT_ID,
        title: event.TITLE,
        start: moment(event.START_TIME).toDate(),
        end: moment(event.END_TIME).toDate(),
        descriptions: event.DESCRIPTIONS,
        location: event.LOCATION,
        period: event.PERIOD
      }})
    console.log('envet Size is', Events.length)
    return(

        <div>
            <button onClick={handleLogout}>Log out</button>
            {username} logged in

            <h1> Main Page</h1>

            <form style={{ marginBottom: '180px' }} onSubmit={handleAddingEvent}>
              <label for='title'>Event title:</label>
              <input type='text' name='eventTitle' required/>
              <label for='desciprtion'>Description: </label>
              <input type='text' name='eventDescription' required/>
              <label for='location'>Location: </label>
              <input type='text' name='eventLocation' required/><br/>
              <label for='startTime'>Start time:</label><br/>
              <DateTimePicker onChange={handleStartTimeChange} value={startTime} required/><br/>
              <label for='endTime'> End time:</label><br/>
              <DateTimePicker onChange={handleEndTimeChange} value={endTime} required/>
              <label for='period'>Period(days):</label>
              <input type='text' name='eventPeriod'/>
              <input type='submit' value="submit"/>
            </form>
          <Calendar
            localizer={localizer}
            events={Events}
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
        </div>

        
    )
}

export default MainPage