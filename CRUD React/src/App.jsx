import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import swal from 'sweetalert';

const request = axios.create({ baseURL: 'http://localhost:1000' });

const EditModal = ({ toggle, value, refetch }) => {

    const [itemDetail, setItemDetail] = useState([]);

    async function fetchItemDetail() {
        try {
            let response = await request.get(`/crud/load_items/${value}`);
            setItemDetail(response.data.item);
        } catch (error) {
            if (!error?.response) {
                swal("Connection Error", "No Server Response", { icon: 'error', button: false });
            } else {
                setItemDetail(error?.response.data.message);
                swal("Item Not Found", itemDetail, { icon: 'error', button: false });
                console.error(error?.response.data)
            }
        }
    }
    useEffect(() => {
        fetchItemDetail();
    }, []);

    const item_name = useRef(null);
    const item_price = useRef(null);

    const updateItemForm = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                row_id: value,
                item_name: item_name.current.value,
                item_price: item_price.current.value
            }
            let response = await request.put(`/crud/update_item/${payload.row_id}`, payload);
            swal("Update Success", response.data.message, { icon: 'success', button: false });
            refetch();
            toggle(false);
        } catch (error) {
            if (!error?.response) {
                swal("Connection Error", "No Server Response", { icon: 'error', button: false });
            } else {
                swal("Update Failed", error?.response.data.message, { icon: 'error', button: false });
                console.error(error?.response.data)
            }
        }
    }

    return (
        <div className='fixed top-0 left-0 h-screen w-screen bg-[#0007] backdrop-blur-sm z-10 grid place-content-center gap-3'>
            <form onSubmit={updateItemForm} className='grid gap-3 p-3 bg-white rounded-md max-w-[400px] w-[400px] relative'>
                <h2 className='text-2xl'>Update Item</h2>
                <h3 className='text-xl'>Edit No. / ItemID : [{value}]</h3>
                <label htmlFor="item_name" className='flex flex-col gap-2'>
                    <span>Item Name</span>
                    <input defaultValue={itemDetail.item_name} className='p-2 rounded-md border-2 border-slate-300' type="text" id="item_name" ref={item_name} />
                </label>
                <label htmlFor="item_price" className='flex flex-col gap-2'>
                    <span>Item Price</span>
                    <input defaultValue={itemDetail.item_price} className='p-2 rounded-md border-2 border-slate-300' type="text" id="item_price" ref={item_price} />
                </label>
                <button type='submit' className='p-2 rounded-md bg-blue-300 hover:bg-blue-600 w-fit text-[blue]'>
                    Update
                </button>
                <button title='Exit / Cancel' className='absolute top-3 right-3 p-2 rounded-md bg-red-300 hover:bg-red-600' onClick={() => toggle(false)} type='button'>❌</button>
            </form>
        </div>
    )
}

const ListItems = ({ data, message, toggleModal, modalValue, refetch }) => {

    const deleteItem = async (id) => {
        try {
            let response = await request.delete(`/crud/delete_id/${id}`);
            await swal("Delete Success", response?.data.message, { icon: 'success', button: false });
            await refetch();
        } catch (error) {
            if (!error?.response) {
                swal("Connection Error", "No Server Response", { icon: 'error', button: false });
            } else {
                await swal("Delete Failed", error?.response.data.message, { icon: 'error', button: false });
                console.error(await error?.response.data)
            }
        }
    }

    return (
        <>
            {data.length !== 0 ? data.map((item, key) =>
                <tr key={key}>
                    <td className='px-2 py-1 text-start'>{item.row_id}</td>
                    <td className='px-2 py-1 text-start'>{item.item_name}</td>
                    <td className='px-2 py-1 text-start'>{item.item_price}</td>
                    <td className='px-2 py-1 text-start flex gap-2'>
                        <button onClick={() => { toggleModal(true); modalValue(item.row_id) }} type='button' className='hover:underline text-lime-600'>Edit</button>
                        <button onClick={() => deleteItem(item.row_id)} type='button' className='hover:underline text-red-600'>Delete</button>
                    </td>
                </tr>
            ) : <tr><td className='text-center p-2 bg-red-600 text-white' colSpan={4}>{message}</td></tr>}
        </>
    )
}

const App = () => {
    const [toggleModal, setModalVisibility] = useState(false);
    const [modalValue, setModalValue] = useState();

    const [payload, setPayload] = useState([]);

    const handlePayload = (e) => {
        const payloadID = e.target.id;
        const payloadValue = e.target.value;
        setPayload(values => ({ ...values, [payloadID]: payloadValue }));
    }

    // ? Add Item
    const submitPayload = async (e) => {
        e.preventDefault();
        try {
            let response = await request.post('/crud/add_item', payload);
            await swal("Add Item", response.data.message, { icon: 'success', button: false });
            await loadItems();
        } catch (error) {
            if (!error?.response) {
                await swal("Connection Error", "No Server Response", { icon: 'error', button: false });
            } else {
                console.error(error?.response.data)
            }
        }
    }

    const [data, setList] = useState([]);
    const [message, setMessage] = useState([]);
    const loadItems = async () => {
        try {
            let response = await request.get('/crud/load_items');
            setList(await response.data.list);
        } catch (error) {
            if (!error?.response) {
                console.error('No Server Response');
                setList([]);
                setMessage([]);
            } else {
                setList(await error?.response.data.list);
                setMessage(await error?.response.data.message);
                console.error(error?.response.data);
            }
        }
    }

    const find_item = useRef(null);
    const fetchItem = async (e) => {
        e.preventDefault();
        try {
            let response = await request.get(`/crud/find_items/${find_item.current.value}`);
            setList(await response?.data.list);
        } catch (error) {
            if (!error?.response) {
                console.error('No Server Response');
                setList([]);
                setMessage([]);
            } else {
                console.error(error?.response.data);
                setList(await error?.response.data.list);
                setMessage(await error?.response.data.message);
            }
        }
    }

    useEffect(() => {
        loadItems();
    }, [])

    const resetPayload = () => {
        setPayload([]);
    }

    const onpress = (e) => {
        // dont accept any space on input
        if (e.key === " ") {
            e.preventDefault();
        }
    }


    return (
        <div className='h-screen w-full p-4 flex flex-col justify-center gap-3 bg-gray-500'>
            {toggleModal && <EditModal toggle={setModalVisibility} value={modalValue} refetch={loadItems} />}
            <div className='  text-center'>
                <h1 className='text-4xl hover:underline text-white'>Create - Read - Update - Delete</h1>
                <h2 className='text-3xl hover:underline text-white'>React & TailwindCSS</h2>
                <h3 className='text-2xl hover:underline text-white'>NodeJs & MySQL</h3>
            </div>
            <section className='flex flex-row flex-wrap gap-3 justify-center'>
                <form onReset={resetPayload} onSubmit={submitPayload} className='bg-white p-3 rounded-md w-[400px] h-fit flex flex-col gap-3'>
                    <h4 className='text-xl'>Items</h4>
                    <section className='grid gap-2'>
                        <input required onChange={handlePayload} className='p-2 rounded-md border-2 border-slate-300' type="text" id="item_name" placeholder='Item Name' />
                        <input required onChange={handlePayload} className='p-2 rounded-md border-2 border-slate-300' type="text" id="item_price" placeholder='Price' />
                    </section>
                    <section className=''>
                        <button className='w-fit p-2 rounded-md border-2 border-blue-600' type='submit'>Add</button>
                    </section>
                </form>
                <div className='bg-white p-3 rounded-md w-[400px] h-[400px] flex flex-col gap-3'>
                    <h4 className='text-xl'>Items Lists</h4>
                    <form onSubmit={fetchItem} className='flex justify-start items-stretch gap-3'>
                        <input onKeyDown={onpress} required className=' w-[80%] p-2 rounded-md border-2 border-slate-300' type="search" placeholder='Find Item' id="find_item" ref={find_item} />
                        <button className='w-[20%] p-2 rounded-md border-2 border-lime-600' type='submit'>Find</button>
                    </form>
                    <div className={`${data.length >= 8 && 'h-[80%] overflow-y-scroll pr-2'}  outline-2 outline-dashed outline-red-300`}>
                        <table className='w-full'>
                            <thead>
                                <tr className='bg-blue-300'>
                                    <th className='p-2 text-start'>No</th>
                                    <th className='p-2 text-start'>Item</th>
                                    <th className='p-2 text-start'>Price</th>
                                    <th className='p-2 text-start'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='text-sm'>
                                <ListItems data={data} message={message} toggleModal={setModalVisibility} modalValue={setModalValue} refetch={loadItems} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    )

}

export default App