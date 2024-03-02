import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/login'
const login = async (logInfo) => {
    const response = await axios.post(baseUrl, logInfo)
    console.log(response.data)
    return response.data
}

export default {login}