import axios from 'axios'

const baseUrl = '/api/users'

const signup = async (signInfo) => {
    const response = await axios.post(baseUrl, signInfo)
    console.log(response.data)
    return response.data
}

export default { signup }