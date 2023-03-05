import { useState, useEffect } from "react";
import swal from "sweetalert";
import axios from '../custom/axios_config';


const ListItems = ({ Data, Message, Update }) => {
  return Data.length !== 0 ? Data.map((item, key) =>
    <tr key={key} className={!item.is_active ? 'bg-red-600' : 'bg-blue-400'} >
      <td className='py-1 text-white px-2 text-start'>{item.t_id}</td>
      <td className='py-1 text-white px-2 text-start'>{item.device}</td>
      <td className='py-1 text-white px-2 text-start'>{item.location}</td>
      <td className={`py-1 text-white px-2 text-start ${item.latest_s_data == 1 ? 'bg-blue-500' : item.latest_s_data == 2 ? 'bg-orange-500' : 'bg-red-500'}`}>{`${item.latest_s_data == 1 ? '[Low]' : item.latest_s_data == 2 ? '[Med]' : item.latest_s_data == 3 && '[High]'} ${item.latest_s_tstamp}`}</td>
      <td className='py-1 text-white px-2 text-start'>
        <button onClick={() => Update(item.device, item.is_active == 1 ? 0 : 1)} type="button">Set {item.is_active == 1 ? 'Offline' : 'Online'}</button>
      </td>
    </tr >
  ) :
    <tr className="text-center text-white bg-[crimson]">
      <td className="p-3" colSpan={5}>{Message}</td>
    </tr>
}


const Route_Devices = () => {

  const [payload, setPayload] = useState([]);
  const handlePayload = (e) => {
    const PayloadID = e.target.id;
    const PayloadValue = e.target.value;
    setPayload(values => ({ ...values, [PayloadID]: PayloadValue }));
  }

  const [fetchResponse, setFetchResponse] = useState([]);
  const [errFetch, setErrFetch] = useState(false);
  const submitSearch = async (e) => {
    e.preventDefault();
    const ALLOWED_EX = /^[a-zA-Z0-9_-\s]{3,}$/;
    const search = ALLOWED_EX.test(payload.search_box);
    if (search === true) {
      try {
        let data = await axios.get(`/search_device/${payload?.search_box}`);
        setFetchResponse(await data?.data);
        setErrFetch(false);
      } catch (error) {
        if (!error?.response) {
          await swal("Disconnected", "No Server Response", { icon: 'error', button: false });
        } else {
          setFetchResponse(error?.response.data);
        }
        setErrFetch(true);
      }
    } else {
      swal("Invalid Input", "No Empty spaces, No Special Characters allowed! Only Letters and Numbers, hyphens(-), underscores(_)", { icon: 'error', button: false });
    }
  }

  const edit_device_status = async (device, status) => {
    try {
      let response = await axios.put('/set_status/' + device, { status: status });
      await swal("Set Status", response.data.message, { icon: 'success', button: false });
      loadDefault();
    } catch (error) {
      if (!error?.response) {
        await swal("Disconnected", "No Server Response", { icon: 'error', button: false });
      } else {
        await swal("Set Status", error?.response.data.message, { icon: 'error', button: false });
      }
    }
  }

  const loadDefault = async () => {
    try {
      let refresh = await axios.get('/devices');
      setFetchResponse(await refresh.data);
      setErrFetch(false);
    } catch (error) {
      if (!error?.response) {
        await swal("Disconnected", "No Server Response", { icon: 'error', button: false });
      } else {
        setFetchResponse(error?.response.data);
      }
      setErrFetch(true);
    }
  }

  useEffect(() => {
    loadDefault();
  }, []);


  return (
    <section className="w-full">
      <h1 className='text-3xl'>Smart Water Level Monitoring System</h1>
      <hr className='my-2 border-2 border-black' />
      <h2 className='text-2xl w-fit rounded-md'>Devices</h2>
      <br />
      <form onSubmit={submitSearch} className='flex justify-between items-center gap-2 flex-wrap'>
        <div className="flex justify-start items-center gap-2 flex-wrap">
          <label htmlFor="search_box">Search : </label>
          <input autoComplete="on" autoCapitalize="" autoFocus onChange={handlePayload} className='p-2 border-2 border-slate-300 rounded-md text-base' type="search" id="search_box" />
          {!errFetch && <button className='p-2 rounded-md bg-blue-300 hover:bg-blue-200' type='submit'>Search</button>}
          {errFetch && <button onClick={loadDefault} className='p-2 rounded-md bg-blue-300 hover:bg-blue-200' type='button'>Reload</button>}
        </div>
        <span className="p-2 rounded-md bg-blue-400 text-white">
          Total Result/s : {fetchResponse.length !== 0 && fetchResponse.list.length}
        </span>
      </form>
      <br />
      <div className='h-[500px] overflow-y-scroll pr-3'>
        <table className='w-full'>
          <thead>
            <tr className='bg-blue-300'>
              <th className='p-2 text-start'>No.</th>
              <th className='p-2 text-start'>Device</th>
              <th className='p-2 text-start'>Location</th>
              <th className='p-2 text-start'>Last Reading - TimeStamp</th>
              <th className='p-2 text-start'>Status</th>
            </tr>
          </thead>
          <tbody>
            {fetchResponse.length !== 0 && <ListItems Data={fetchResponse.list} Message={fetchResponse.message} Update={edit_device_status} />}
          </tbody>
        </table>
      </div>

    </section >
  )
}

export default Route_Devices