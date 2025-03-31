import React, { useEffect, useState } from 'react';
import { IoIosNotifications } from "react-icons/io";
import { useGetNotificationsQuery } from '../redux/slices/apiSlice';
import { IoIosAlert } from "react-icons/io";
import { MdMessage } from "react-icons/md";


const Notification = () => {
    const [opennoti, setOpennoti] = useState(false);
    const { data: notices = [], isLoading } = useGetNotificationsQuery();
    const count = notices?.length || 0;

    useEffect(()=>{
            console.log(notices)
    },[])

    return (
        <div className="relative ">
            <div className='flex '>
            {/* Notification Bell Icon */}
            <IoIosNotifications 
                onClick={() => setOpennoti(!opennoti)} 
                className=" cursor-pointer text-gray-600 hover:text-indigo-600 transition" 
            />
           {count>0? <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>:""}
            </div>

            {/* Loading State */}
            {isLoading && <div className="text-gray-500">Loading...</div>}

            {/* Notification List */}
            {opennoti && (
                <div className="absolute right-0 mt-2 w-[40vw]  bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-5">
                    {notices.length > 0 ? (
                        notices.map((notice) => (
                            <div key={notice._id} className="flex p-1 gap-2 justify-center items-center hover:bg-gray-100 border-b transition">
                                <div className="flex  items-center justify-center ">
                                </div>
                                <p className="text-xs h-5 overflow-hidden text-gray-700 mt-1">{notice.text}</p>
                                <p className="text-xs text-gray-500 mt-1 ">{notice.notiType==="alert"? <IoIosAlert />:<MdMessage /> }</p>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-sm text-gray-500">No new notifications</div>
                    )}
                </div>
                  
            )}

          
            
        </div>
    );
};

export default Notification;
