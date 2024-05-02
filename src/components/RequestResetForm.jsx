import {useState} from 'react'

const RequestResetForm = () => {

    const [email, setEmail] = useState('')

    const handlerRequestReset = async() => {

    }

    return(
        <div className="container">
            <form onSubmit={handlerRequestReset}>
                <label htmlFor='reset-email'>Email address </label>
                <input id="reset-email" type="email" value={email} onChange={(e) => {e.preventDefault(); setEmail(e.target.value)}}/>
                <input type='submit' />
            </form>
        </div>
    )
}

export default RequestResetForm