import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/events'
const getAll = async () => {
    return await axios.get(baseUrl)
}

const getForUser = async (userId) => {
    const url = `${baseUrl}/user/${userId}`
    return await axios.get(url)
}

export default {getAll, getMonthly, getForUser}