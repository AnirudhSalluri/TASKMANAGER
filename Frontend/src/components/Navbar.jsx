import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GrTasks, GrTask, GrInProgress } from "react-icons/gr";
import { RiCalendarTodoLine } from "react-icons/ri";
import { FaUsers, FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineSpaceDashboard, MdMenu, MdClose } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { setSidebarOpen } from '../redux/slices/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const {user,isSidebarOpen} = useSelector(i=>i.auth)
    const isAdmin = user.isAdmin
    const location = useLocation();
    const dispatch = useDispatch();
    
    
    const itemList = [
        { label: "Dashboard", link: "/dashboard", icon: <MdOutlineSpaceDashboard /> },
        { label: "Tasks", link: "/tasks", icon: <GrTasks /> },
        { label: "Completed", link: "/completed", icon: <GrTask /> },
        { label: "In-Progress", link: "/in-progress", icon: <GrInProgress /> },
        { label: "Todo", link: "/todo", icon: <RiCalendarTodoLine /> },
        { label: "Team", link: "/users", icon: <FaUsers /> },
        { label: "Trash", link: "/trashed", icon: <FaRegTrashAlt /> }
    ];

    const items = isAdmin?itemList:itemList.slice(0,5)

    return (
        <div className={` fixed h-screen  bg-blue-50  p-4 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-18"}`}>
            {/* Toggle Button */}
            <button 
                onClick={()=>dispatch(setSidebarOpen(!isSidebarOpen))} 
                className="text-2xl text-gray-700 mb-14 flex items-center"
            >
                {isSidebarOpen ? <MdClose /> : <MdMenu />}
            </button>

            {/* Sidebar Items */}
            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <button 
                        key={item.label} 
                        onClick={() => navigate(item.link)} 
                        className={clsx("flex items-center gap-2 p-2 text-lg font-medium hover:bg-amber-400 rounded",
                            location.pathname==item.link?"bg-amber-400 rounded":""
                        )}
                    >
                        <span className="text-2xl">{item.icon}</span>
                        {isSidebarOpen && <span>{item.label}</span>}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Navbar;
 