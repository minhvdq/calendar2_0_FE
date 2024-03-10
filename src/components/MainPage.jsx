import Event from './Event'

const MainPage = ({handleLogout, events}) => {
    console.log('event size is', events.length)
    return(
        <div>
            
            <button onClick={handleLogout}>Log out</button>

            <h1>The events available</h1>
            {events.map(event => (
                <Event key={event[0]} event = {event} />
            ))}
        </div>
    )
}

export default MainPage