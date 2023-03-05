import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../assets/login.css';

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9][a-z-A-Z-0-9-!@#$%^&*()_]{6,50}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,50}$/;
const LOGIN_API_ROUTE = '/login';
const request = axios.create({ baseURL: 'http://localhost:3307' });

const Instructions = ({ isValid, isValidInput, validFor }) => {
    return isValid.length !== 0 && (
        validFor == 'username' &&
        <ul className={isValid.username && !isValidInput ? 'instructions' : 'hide'}>
            <figcaption>⚠ Instructions ⚠</figcaption>
            <li>Minimum length of 6</li>
            <li>Must contain atleast an upper/lower case letters</li>
            <li>Characters Allowed :  ' ! @ # $ % ^ & * ( ) _'  </li>
        </ul>
    ) ||
        (
            validFor == 'password' &&
            <ul className={isValid.password && !isValidInput ? 'instructions' : 'hide'}>
                <figcaption>⚠ Instructions ⚠</figcaption>
                <li>Minimum length of 8</li>
                <li>Must Contain Allowed Characters : ! @ # $ % </li>
            </ul>
        )

}
const HandleValid = ({ field, fieldValid }) => {
    return field && !fieldValid ? <span>Failed ❌</span> : <span>Passed ✔</span>
}

const Login = () => {
    //? Toggle Password Visibility
    const [type, setType] = useState(true);
    const [payload, setPayload] = useState([]);
    const [validUsername, setValidUsername] = useState(false);
    const [validPassword, setValidPassword] = useState(false);

    const [errRes, setErrorRes] = useState(false);
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        setPayload(values => ({ ...values, [e.target.id]: e.target.value }));
    };

    useEffect(() => {
        const user = USERNAME_REGEX.test(payload.username);
        setValidUsername(user);
    }, [payload.username]);

    useEffect(() => {
        const pass = PASSWORD_REGEX.test(payload.password);
        setValidPassword(pass);
    }, [payload.password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const U = USERNAME_REGEX.test(payload.username);
        const P = PASSWORD_REGEX.test(payload.password);
        if (!U || !P) {
            swal("Login Failed", "Invalid Inputs, Follow instructions", { icon: 'error', button: false });
        } else {
            try {
                let response = await request.post(LOGIN_API_ROUTE, payload);
                setErrorRes(false); 
                setMsg(response.data.message);
            } catch (error) {
                if (!error?.response) {
                    setErrorRes(true);
                    setMsg('No Server Response');
                } else if (error.response?.status === 409 || error.response?.status === 404) {
                    setErrorRes(true);
                    setMsg(error.response?.data.message);
                } else {
                    setMsg('Sonething went wrong in processing the request!');
                }
            }
        }
    }

    const handleReset = () => {
        setPayload([]);
        setValidUsername(false);
        setValidPassword(false);
        setErrorRes(false);
        setMsg('');
    }

    return (
        <form className='login_form' onSubmit={handleSubmit} onReset={handleReset}>
            {msg && <p className={errRes ? 'msg error' : 'msg success'} >{msg}</p>}
            <h1>Login </h1>
            <hr className='divider-solid' />
            <div className="input_section">
                <label htmlFor="username">
                    <span>Username : {payload.length !== 0 && payload?.username && <HandleValid field={payload.username} fieldValid={validUsername} />}</span>
                    <input onChange={handleChange} type="text" id="username" required />
                    <Instructions isValid={payload} isValidInput={validUsername} validFor={'username'} />
                </label>
                <label htmlFor="password">
                    <span>Password : {payload.length !== 0 && payload?.password && < HandleValid field={payload.password} fieldValid={validPassword} />}</span>
                    <input onChange={handleChange} type={type ? 'password' : 'text'} id="password" required />
                    <Instructions isValid={payload} isValidInput={validPassword} validFor={'password'} />
                </label>
                <label htmlFor="togglepass">
                    <input onChange={() => setType(!type)} type="checkbox" id="togglepass" required="optional" />
                    <span>Show Password</span>
                </label>
            </div>
            <div className="submit_section">
                <button type='submit' className='submit_button'>Sign In</button>
                <button type='reset' className='reset_button'>Reset</button>
            </div>
            <hr className='divider-solid' />
            <div className="redirect_section">
                <p>Create account to sign in : <Link to={'/register'}>Sign Up</Link></p>
            </div>
        </form>
    )
}

export default Login