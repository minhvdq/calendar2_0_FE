import PropTypes from 'prop-types'

const AuthForm = ({ handleLogin, email, password, handleEmail, handlePassword }) => {
  return(
    <form onSubmit = {handleLogin}>
      <div>
        email:
        <input id='email' type = "text" name = "email" value = {email} onChange = {handleEmail} />
      </div>
      <div>
        password
        <input id='password' type='text' name = 'password' value = {password} onChange = {handlePassword} />
      </div>
      <button id='login_button' type='submit'> login </button>
    </form>
  )
}
AuthForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleEmail: PropTypes.func.isRequired,
  handlePassword: PropTypes.func.isRequired
}

export default AuthForm