import Event from './Event'
import React, { useState,useMemo, useEffect } from "react";
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
import{ButtonGroup, Button }from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Calender.css';

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
    const [modal, setModal] = useState(true)
    const [modalAdding,setModalAdding]=useState(false)
    const { defaultDate, formats } = useMemo(
      () => ({
        defaultDate: new Date(),
        formats: {
          monthHeaderFormat: (date, culture, localizer) =>
            localizer.format(date, `MMMM YY`, culture),
          weekdayFormat: (date, culture, localizer) =>
            localizer.format(date, 'dddd', culture),
          dayFormat: (date, culture, localizer) =>
            localizer.format(date, 'ddd MM/DD', culture),
          dayHeaderFormat: (date, culture, localizer) =>
            localizer.format(date, 'dddd MMMM Do', culture),
        },
      }),
      []
    )

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
    const closeAddingModal=()=>{
      setModalAdding(false)
    }
    const openAddingModal=()=>{
      console.log('open modal')
      setModalAdding(true)
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
    const handleAddingEvent    = (e)=>
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
          handleAddEvent(eventData)
          closeAddingModal()
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

          let d = new Date( startDate )

          //let d = new Date( startDate ).setHours(0,0,0,0)
          let de = new Date( endDate ).setHours(0,0,0,0)
          
          while( d < de ){
            let curDate = new Date(d)
            let curDe = new Date(de)
            console.log('current start date d and end date is ',startDate, curDate, curDe)

            let startTimeFormated = formatTime(curDate, startTime)
            let endTimeFormated = formatTime(curDate, endTime)
            
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
            d = curDate.setDate(curDate.getDate() + p)
          }
          console.log('size event Datas', eventDatas.length)
          handleAddManyEvents(eventDatas);
          closeAddingModal()
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
        <div  >
        <div className='calendarcontainer' >
          <div style={{position: 'relative'}}>
            <button className="btn btn-danger" style={{position: 'absolute', right: '10px', top: '10px'}} onClick={handleLogout}>Log out</button>
          </div>
            <p style={{marginTop: "20px"}} className='HelloHeader'>Welcome back {username} !</p>

            {/* <h1 style={{position: 'fixed', left: '43%', marginBottom: "30px"}} className='HeadLine'> Your schedule</h1> */}
            <button className='btn btn-primary' style={{marginBottom: '7px'}} onClick={openAddingModal}>Add events</button>
           {modalAdding && (
            <div className='Adding event modal'>
              <Modal show={modalAdding} onHide={closeAddingModal} centered size="lg">
                  <Modal.Header closeButton>
                    <Modal.Title>Adding Panel</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div id="add-event-board" >
            
                    <form className='event-form' onSubmit={handleAddingEvent}>
                    
                      <label htmlFor='title'>Event title:</label>
                      <input type='text' name='eventTitle' required/><br/>
                      <label htmlFor='desciprtion'>Description: </label>
                      <input type='text' name='eventDescription' required/><br/>
                      <label htmlFor='location'>Location: </label>
                      <input type='text' name='eventLocation' required/><br/>

                      <label htmlFor='startDate'>Start Date: </label><br/>
                      <DatePicker onChange={(date) => {setStartDate(date)}} selected={startDate}  /><br/>

                      <label htmlFor='startTime'>Start Time</label><br/>
                      <TimePicker value={startTime} onChange={setStartTime} /><br/>
                      
                      <label htmlFor='endTime'>End Time</label><br/>
                      <TimePicker value={endTime} onChange={setEndTime} /><br/>

                      <input type="checkbox" id="coding" name="interest" value="coding" onClick={() => {
                        document.getElementById('set-period').style.display = document.getElementById('set-period').style.display === 'block' ? 'none' : 'block'
                        setHavePeriod(!havePeriod)
                      }} /> Add Period <br/>
                      

                      <div id='set-period' style={{display: 'none'}}>
                        <label htmlFor='startDate'>End Date: </label><br/>
                        <DatePicker onChange={(date) => {setEndDate(date)}} selected={endDate} minDate={startDate}  /><br/>
                        <label htmlFor='period'>Period(days):</label>
                        <input type='number' min={1} name='eventPeriod' onChange={(e) => {e.preventDefault(); setPeriod(parseInt(e.target.value))}} value={period} required /><br/>
                      </div>
                      <input className='btn btn-primary' type='submit' value="submit"/>
                    </form>
                   </div>
                  </Modal.Body>

                  <Modal.Footer>
                    <Button variant="secondary" onClick={closeAddingModal}>Close</Button>
                  </Modal.Footer>
              </Modal>

            </div>
           )}
          
            
          <Calendar 
            localizer={localizer}
            views={['month','week','day']}
            events={feEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '80vh' }}
            selectable={true}
            onSelectEvent={handleSelectedEvent}
            defaultView='month'
            formats={formats}
            defaultDate={defaultDate}
            
          />
          {selectedEvent && modal && (
           <div className="modal show">
            <Modal show={modal} onHide={closeModal} centered size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Event Panel</Modal.Title>
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
                      Change all
                    </Button>
                    <Button variant='danger' onClick={()=>{
                      if(window.confirm('Do you want to delete all events from this point to the future'))
                      {
                          handleDeleteMultipleEvents(selectedEvent.id)
                          closeModal()
                      }
                    }}>
                      Delete all
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
        </div>
        <footer style={{height:  '5vh', textAlign: 'center', marginTop: '3vh'}}>
          <p>Copyright &#169; 2024 Calendar2_0. All Rights Reserved.</p>
        </footer>
        </div>

        
    )
}

export default MainPage