import { useState, useEffect } from 'react';

const HeaderNav = () => {

    const [dropDownProjects, setDropDownProjects] = useState(false);
    const [dropDownAbout, setDropDownAbout] = useState(false);

    return (
        <header className='container mx-auto my-0 flex justify-between items-center p-4 bg-slate-300'>
            <button>Roald M. Dela Cruz</button>
            <ul className='flex justify-start items-center gap-4 z-10'>
                <li className='relative z-10' onClick={() => setDropDownProjects(true)} onMouseOver={() => setDropDownProjects(true)} onMouseLeave={() => { setDropDownProjects(false) }}>
                    <button>Projects</button>
                    <ul className={`${dropDownProjects ? 'flex' : 'hidden'} justify-start items-start flex-col bg-slate-200 absolute top-6 right-0 p-2 rounded shadow-slate-400 shadow-md`}>
                        <figcaption className='p-1 w-[260px] font-semibold underline'>MySQL Express React NodeJS</figcaption>
                        <li className='p-1 w-fit'>NodeJS/MySQL CRUD REST API</li>
                        <li className='p-1 w-fit'>CRUD React</li>
                        <li className='p-1 w-fit'>SignIn/SignUp Project</li>
                        <li className='p-1 w-fit'>Thesis Capstone React Version</li>
                        <figcaption className='p-1 w-[260px] font-semibold underline'>PHP Javascript/JQuery HTML/CSS</figcaption>
                        <li className='p-1 w-fit'>Thesis Capstone</li>
                        <li className='p-1 w-fit'>PHP/MySQL CRUD</li>
                        <li className='p-1 w-fit'>PHP REST API</li>
                        <li className='p-1 w-fit'>Javascript Fetch API</li>
                        <li className='p-1 w-fit'>JQuery Ajax HTTP Requests</li>
                    </ul>
                </li>
                <li className='relative z-10' onClick={() => setDropDownAbout(true)} onMouseOver={() => setDropDownAbout(true)} onMouseLeave={() => { setDropDownAbout(false) }}>
                    <button>About</button>
                    <ul className={`${dropDownAbout ? 'flex' : 'hidden'}  justify-start items-start flex-col bg-slate-200 absolute top-6 right-0 p-2 rounded shadow-slate-400 shadow-md`}>
                        <figcaption className='p-1 w-[200px] font-semibold underline'>Profile</figcaption>
                        <li className='p-1'>Github</li>
                        <figcaption className='p-1 w-[300px] font-semibold underline'>Contact</figcaption>
                        <li className='p-1 underline'>📧 roalddelacruz@gmail.com</li>
                        <li className='p-1'>📱+63-992-574-4271</li>
                        <figcaption className='p-1 w-[200px] font-semibold underline'>Hire Me</figcaption>
                        <li className='p-1'>Indeed</li>
                    </ul>
                </li>

            </ul>
        </header>
    )
}

export default HeaderNav