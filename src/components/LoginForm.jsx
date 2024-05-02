

const LoginForm = ({togglePage, handleLogin, email, password, handleEmail, handlePassword, error })=> {
    return(
        <div className='col-md-6 right-box'>
          <div className='row align-items-center'>
            <div className='header-text mb-4 mt-4'>
              <p className='h3 mb-0'style={{fontFamily: "Courier New, Courier, monospace", fontWeight: "600", textAlign: "center"}}>Welcome back!</p></div>
              <div className="d-flex flex-row-reverse">
              <button type="button" onClick={togglePage} className="btn btn-link" style={{padding: "0"}}>Signup</button><div className="p-1" >Don't have an account?</div>
              </div>
            <form onSubmit={handleLogin}>
              <div className="row justify-content-center">
                <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                <div className='input-group mb-3'>
                  <input type="email" className="form-control form-control-lg bg-light fs-6" id="exampleFormControlInput1" placeholder="name@example.com" value={email} onChange={handleEmail} required />
                </div>
              </div>
              <div>
                <div className="row justify-content-center">
                  <label htmlFor="inputPassword" className="col-form-label">Password</label>
                  <div className='input-group mb-3'>
                    <input type="password" id="inputPassword" className="form-control form-control-lg bg-light fs-6" aria-describedby="passwordHelpInline" placeholder='Your Password' value={password} onChange={handlePassword} required />
                  </div>
                </div>
              </div>
              <div className='input-group mb-0 mt-2'>
                <button type='submit' className="btn btn-primary w-100 fs-6"> login </button>
                <div className="d-flex flex-row-reverse mb-1">
                    <div className='p-1'>
                      {error}
                  </div>
                  <button type="button" className="btn btn-link" style={{padding: "0"}}>Forgot your password!</button>
                </div>
              </div>
            </form>
          </div>
        </div>
    )
}

export default LoginForm