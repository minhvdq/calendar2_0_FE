const Event = ({event}) => {
    let id = event[0]
    console.log(id, 'id')
    return(
        <div>
            {event[1]} and key {event[0]}
        </div>
        
    )
}

export default Event