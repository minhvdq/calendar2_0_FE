import Event from './Event'
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment"



const MainPage = ({handleLogout, events}) => {
    console.log('event size is', events.length)
    const localizer = momentLocalizer(moment);

    const Events = [
    {
      title: 'Meeting',
      start: moment('2024-03-01T10:00:00').toDate(), // Convert moment object to JavaScript Date object
      end: moment('2024-03-01T11:00:00').toDate(), // Convert moment object to JavaScript Date object
    },

    {
        title: 'Meeting important',
        start: moment('2024-03-16T19:00:00').toDate(), // Convert moment object to JavaScript Date object
        end: moment('2024-03-16T20:00:00').toDate(), // Convert moment object to JavaScript Date object
      },
    // Add more events as needed
  ];
    return(

        <div>
            
            <button onClick={handleLogout}>Log out</button>

            <h1>The events available</h1>
            {events.map(event => (
                <Event key={event[0]} event = {event} />
            ))}


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