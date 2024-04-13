import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/events'
const getAll = async () => {
    return await axios.get(baseUrl)
}

const getForUser = async (userId) => {
    const url = `${baseUrl}/user/${userId}`
    return await axios.get(url)
}

const addEvent = async (eventData,userId)=>{
    const url = `${baseUrl}/addEvents/${userId}`
    return await axios.post(url,eventData)
}

const editEvent = async (eventData,userId)=>{
    const url = `${baseUrl}/editEvents/${userId}`
    await axios.post(url,eventData)
}

const deleteEvent = async (eventId) => {
    const url = `${baseUrl}/${eventId}`
    await axios.delete(url)
}



export default {getAll, getForUser, addEvent, editEvent, deleteEvent}