import React, { useEffect, useRef, useState } from 'react';
import axios from '../..//custom/axios_config';
import swal from 'sweetalert';

const ALLOWED_EX = /^[a-zA-Z0-9_-\s]{3,}$/;


const EditDeviceModal = ({ showEditModal }) => {
    const device_id = useRef(null);
    const device_location = useRef(null);
    const is_active = useRef(null);

    const [input_value, setInputValue] = useState([]);
    const [isValid, setValid] = useState(false);

    const handleUpdateModalSearch = async (e) => {
        e.preventDefault();
        const payload = {
            device_id: device_id.current?.value
        }
        if (ALLOWED_EX.test(payload.device_id) === true) {
            try {
                let response = await axios.get(`/find_device/${payload?.device_id}`);
                setInputValue(response.data.result);
                setValid(true);
            } catch (error) {
                setValid(false);
                if (!error?.response) {
                    await swal("Disconnected", "No Server Response", { icon: 'error', button: false });
                } else {
                    console.error(error.response.data);
                    await swal("Invalid", error.response.data?.message, { icon: 'error', button: false });
                }
            }
        } else {
            await swal("Invalid", "No Empty spaces, No Special Characters allowed! Only Letters and Numbers, hyphens(-), underscores(_)", { icon: 'error', button: false });
        }
    }

    const handleUpateModalUpdate = async () => {
        const payload = {
            device_id: device_id.current?.value,
            device_location: device_location.current?.value,
            is_active: is_active.current?.value
        }
        if (ALLOWED_EX.test(payload.device_id) === true) {
            try {
                let response = await axios.put(`/update_device/${payload?.device_id}`, payload);
                setValid(true);
                swal("Update Success", response.data?.message, { icon: 'success', button: false });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                setValid(false);
                if (!error?.response) {
                    await swal("Disconnected", "No Server Response", { icon: 'error', button: false });
                } else {
                    await swal("Invalid", error.response.data?.message, { icon: 'error', button: false });
                }
            }
        } else {
            await swal("Invalid", "No Empty spaces, No Special Characters allowed! Only Letters and Numbers, hyphens(-), underscores(_)", { icon: 'error', button: false });
        }
    }

    const resetForm = () => {
        setValid(false);
        setInputValue([]);
    }

    return (

        <div className='h-full w-full bg-[#0008] backdrop-blur-sm z-10 fixed top-0 left-0 flex flex-col justify-center items-center'>
            <h1 className='text-3xl text-white' >Update Device</h1>
            <hr className='my-2 border-black' />
            <form onSubmit={handleUpdateModalSearch} onReset={resetForm} className='w-[468px]'>
                <input defaultValue={input_value && input_value.device} ref={device_id} autoComplete="on" autoCapitalize="" autoFocus className='w-full p-2 border-2 border-slate-300 rounded-md text-base' type="search" placeholder='Device' id="device_id" />
                <hr className='my-2 border-black' />
                <section className='grid gap-2'>
                    <input defaultValue={input_value && input_value.location} ref={device_location} className='w-full p-2 border-2 border-slate-300 rounded-md text-base' type="text" id="device_location" placeholder='Location' />
                    <select ref={is_active} className='w-full p-2 border-2 border-slate-300 rounded-md text-base' id="device_status">
                        {input_value && input_value.is_active == 1 ?
                            <>
                                <option value="1">Online</option>
                                <option value="0">Offline</option>
                            </>
                            :
                            <>
                                <option value="0">Offline</option>
                                <option value="1">Online</option>
                            </>
                        }
                    </select>
                </section>
                <hr className='my-2 border-black' />
                <section className='flex gap-2 justify-end items-stretch'>
                    {isValid && <button onClick={handleUpateModalUpdate} type='button' className='text-white bg-blue-600 p-2 rounded-md'>Update</button>}
                    {!isValid && <button type='submit' className='text-white bg-yellow-500 p-2 rounded-md'>Search</button>}
                    <button type='reset' className='text-white bg-red-600 p-2 rounded-md' onClick={() => showEditModal(false)}>Close</button>
                </section>
            </form>
        </div >
    )
}

export default EditDeviceModal