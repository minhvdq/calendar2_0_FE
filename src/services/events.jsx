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
    await axios.post(url,eventData)
}

const editEvent = async (eventData,userId)=>{
    const url = `${baseUrl}/editEvents/${userId}`
    await axios.post(url,eventData)
}



export default {getAll, getForUser,addEvent,editEvent}