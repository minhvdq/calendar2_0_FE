import axios from 'axios'

const baseUrl = '/api/login'
const login = async (logInfo) => {
    const response = await axios.post(baseUrl, logInfo)
    console.log(response.data)
    return response.data
}

export default {login}