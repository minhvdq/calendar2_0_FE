import Event from './Event'
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment"



const MainPage = ({handleLogout, events, user}) => {
    const localizer = momentLocalizer(moment);
    console.log('event size', events)

    const email = user.email
    const username = email.split("@")[0]
    const Events = events.map(event => {
      return {
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

    <Calendar
      localizer={localizer}
      events={Events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
        </div>

        
    )
}

export default MainPage