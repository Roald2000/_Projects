import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// * Main Page Routes
import Route_Devices from './Routes/Route_Devices';
import Route_Readings from './Routes/Route_Readings';
import Route_LiveReadings from './Routes/Route_LiveReadings';
import Introduction from './Routes/Introduction';

// * Components Modal
import EditDeviceModal from './Routes/components/EditDeviceModal';



const App = () => {

    const [dropdownDevices, setDropDownDevices] = useState(true);
    const [dropdownReadings, setDropDownReadings] = useState(true);

    const [editModal, showEditModal] = useState(false);

    return (
        <BrowserRouter>
            {editModal && <EditDeviceModal showEditModal={showEditModal} />}
            <header className='container bg-blue-600 p-4 mx-auto my-0 flex flex-wrap gap-2 justify-between items-center'>
                <Link className='rounded-md bg-white p-2 font-[500]' to={'/'}>Home</Link>
                <ul className='nav flex justify-start items-center flex-wrap'>
                    <li className='relative' onMouseLeave={() => setDropDownDevices(true)} onMouseOver={() => setDropDownDevices(false)}>
                        <Link className='hover:overline overline-offset-8 p-2 text-white font-[500]' to={'/devices'}>Devices</Link>
                        <div className={`${dropdownDevices ? 'hidden' : 'flex'} w-[200px] flex-col p-1 gap-1 absolute top-6 left-0 rounded-md text-white bg-[#0007] backdrop-blur-sm`}>
                            <button onClick={() => showEditModal(true)} className='p-1 hover:underline text-start rounded-md'>Edit Device</button>
                            <button className='p-1 hover:underline text-start rounded-md '>Device Information</button>
                        </div>
                    </li>
                    <li className='relative' onMouseLeave={() => setDropDownReadings(true)} onMouseOver={() => setDropDownReadings(false)}>
                        <Link className='hover:overline overline-offset-8 p-2 text-white font-[500]' to={'/readings'}>Readings</Link>
                        <div className={`${dropdownReadings ? 'hidden' : 'flex'} w-[200px] flex-col p-1 absolute top-6 left-0 rounded-md text-white bg-[#0007] backdrop-blur-sm`}>
                            <Link className='p-1 hover:underline' to={'/readings'}>Date Readings</Link>
                            <Link className='p-1 hover:underline' to={'/readings'}>Device Readings</Link>
                        </div>

                    </li>
                    <li><Link className='hover:underline underline-offset-8 p-2 text-white font-[500]' to={'/live_readings'}>Live Readings</Link></li>
                </ul>
            </header>
            <main className='container mx-auto my-0 w-full p-2'>
                <Routes>
                    <Route index element={<Introduction />} />
                    <Route path='/devices' element={<Route_Devices />} />
                    <Route path='/readings' element={<Route_Readings />} />
                    <Route path='/live_readings' element={<Route_LiveReadings />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default App