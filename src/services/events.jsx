import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/events'
const getAll = async () => {
    return await axios.get(baseUrl)
}

export default {getAll}