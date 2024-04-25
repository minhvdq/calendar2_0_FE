import PropTypes from 'prop-types'
import './AuthForm.css'

const AuthForm = ({ handleLogin, email, password, handleEmail, handlePassword, error }) => {
  return (
    <div className='container d-flex justify-content-center align-items-center min-vh-100 min-vw-100' >

      <div className='row border rounded-5 p-3 bg-white shadow box-area'>
        <div className='col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box' style={{background: "#1167b1"}}>
          <div className='featured-image mb-3'>
            <img src='../../assets/project-management.png' className='img-fluid' style={{width: "250px"}} />
          </div>
          <p className='text-white fs-2' style={{fontFamily: "Courier New, Courier, monospace", fontWeight: "600"}}> Be verified! </p>
          <small className='text-white text-wrap text-center mb-3' style={{width: '17rem', fontFamily: "Courier New, Courier, monospace" }}>Join our better version of Google Calendar</small>
        </div>
        <div className='col-md-6 right-box'>
          <div className='row align-items-center'>
            <div className='header-text mb-4 mt-4'>
              <p className='h3'style={{fontFamily: "Courier New, Courier, monospace", fontWeight: "600", textAlign: "center"}}>Welcome back!</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="row justify-content-center">
                <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                <div className='input-group mb-3'>
                  <input type="email" className="form-control form-control-lg bg-light fs-6" id="exampleFormControlInput1" placeholder="name@example.com" value={email} onChange={handleEmail} />
                </div>
              </div>
              <div>
                <div className="row justify-content-center">
                  <label htmlFor="inputPassword" className="col-form-label">Password</label>
                  <div className='input-group mb-3'>
                    <input type="password" id="inputPassword" className="form-control form-control-lg bg-light fs-6" aria-describedby="passwordHelpInline" placeholder='Your Password' value={password} onChange={handlePassword} />
                  </div>
                </div>
              </div>
              <div className='input-group mb-3 mt-2'>
                <button type='submit' className="btn btn-primary w-100 fs-6"> login </button>
              </div>
              <p>
                {error}
              </p>
              
            </form>
          </div>
        </div>
      </div>
    </div>
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