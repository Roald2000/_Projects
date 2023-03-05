import RegisterForm from "./components/Register";
import Login from './components/Login';
import Home from './components/Home';
import './assets/header.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <header>
        <Link className="home_nav_btn" to={'/'}>Home</Link>
        <ul>
          <li><Link className="btn_nav_signin" to={'/login'}>Sign In</Link></li>
          <li><Link className="btn_nav_signup" to={'/register'}>Sign Up</Link></li>
        </ul>
      </header>
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/register'} element={<RegisterForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;
