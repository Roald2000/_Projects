//#region //* Dependencies
import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../assets/register.css'
//#endregion //! END REGION FOR Dependencies

//#region //* Declarations
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9][a-z-A-Z-0-9-!@#$%^&*()_]{6,50}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,50}$/;
const REGISTER_API_ROUTE = '/register';
const request = axios.create({ baseURL: 'http://localhost:3307' });
//#endregion //! END REGION for Declarations

//#region //* Components 
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
//#endregion //! END REGION for Components


const RegisterForm = () => {
    //? Toggle Password Visibility
    const [type, setType] = useState(true);

    const [payload, setPayload] = useState([]);
    const [validUsername, setValidUsername] = useState(false);
    const [validPassword, setValidPassword] = useState(false);

    const [errRes, setErrorRes] = useState(false);
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        setPayload(values => ({ ...values, [e.target.id]: e.target.value }));
    }

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
            swal("Register", "Invalid Inputs, Follow instructions", { icon: 'error', button: false });
        } else {
            try {
                let response = await request.post(REGISTER_API_ROUTE, payload);
                setErrorRes(false);
                setMsg(response.data.message);
            } catch (error) {
                if (!error?.response) {
                    setErrorRes(true);
                    setMsg('No Server Response');
                } else if (error.response?.status === 409) {
                    setErrorRes(true);
                    setMsg(error.response?.data.message);
                } else {
                    setMsg('Failed!');
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
        <form className='register_form' onSubmit={handleSubmit} onReset={handleReset}>
            {msg && <p className={errRes ? 'msg error' : 'msg success'} >{msg}</p>}
            <h1>Register </h1>
            <hr className='divider-solid' />
            <section className='input_section'>
                <label htmlFor="username">
                    <span>Username :  {payload.length !== 0 && payload?.username && <HandleValid field={payload.username} fieldValid={validUsername} />}</span>
                    <input onChange={handleChange} type="text" id="username" required />
                    <Instructions isValid={payload} isValidInput={validUsername} validFor={'username'} />
                </label>
                <label htmlFor="password">
                    <span>Password :  {payload.length !== 0 && payload?.password && < HandleValid field={payload.password} fieldValid={validPassword} />}</span>
                    <input onChange={handleChange} type={type == true ? 'password' : 'text'} id="password" required />
                    <Instructions isValid={payload} isValidInput={validPassword} validFor={'password'} />
                </label>
                <label htmlFor="togglepass">
                    <input onChange={() => setType(!type)} type="checkbox" id="togglepass" />
                    <span>Show Password</span>
                </label>
            </section>
            <section className='submit_section'>
                <button className='submit_button' type='submit' disabled={!validUsername || !validPassword}>Sign Up</button>
                <button onClick={() => setMsg('')} className='reset_button' type='reset'>Reset</button>
            </section>
            <hr className='divider-solid' />
            <section className='redirect_section'>
                <p>Already have an account ? <Link to={'/login'}>Sign In</Link></p>
            </section>
        </form >
    )
}

export default RegisterForm;