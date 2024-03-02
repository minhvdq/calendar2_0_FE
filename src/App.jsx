import { useState, useEffect} from 'react'
import AuthForm from './components/AuthForm'
import loginService from './services/login'
import customStorage from './services/customStorage'

function App() {
  const [curUser, setCurUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);


  window.customLoca

  const handlePassword = (event) => {
    setPassword(event.target.value)
    console.log(event.target.value)
  }
  const handleEmail = (event) => {
    setEmail(event.target.value)
    console.log(event.target.value)
  }
  const handleLogin = async(event) => {
    event.preventDefault();
    try{
      const logUser = await loginService.login({email: email, password})
      setCurUser(logUser);
      customStorage.setItem('localUser', JSON.stringify(logUser));
      console.log(logUser)
      setUsername('');
      setPassword('');
    }catch{
      setError('Wrong username or password')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
  }

  return (
    <>
      <div>
        <AuthForm 
          handleLogin={handleLogin} 
          email={email} password={password} 
          handleEmail={handleEmail} 
          handlePassword={handlePassword} 
        /> 
        {error}
      </div>
    </>
  )
}

export default App
