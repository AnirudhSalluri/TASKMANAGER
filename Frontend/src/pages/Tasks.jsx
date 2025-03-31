import React, { useEffect } from 'react'
import { useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import {useForm} from 'react-hook-form';
import { useGetTeamListQuery,useDeleteRestoreTaskMutation , useCreateTaskMutation,useGetTasksQuery,useUpdateTaskMutation,useTrashTaskMutation} from '../redux/slices/apiSlice';
import { toast, ToastContainer } from 'react-toastify';
import getInitials from "../utils/Initialsplit"
import { CiMenuKebab } from "react-icons/ci";
import { useLocation } from 'react-router-dom';
import { Menu , MenuButton , MenuItems , MenuItem } from '@headlessui/react';

const Tasks = () => {
const location = useLocation();
const [actionType,setactionType] = useState("");
const [stage,setStage]=useState(); 
const [isTrashed,setisTrashed]=useState("") 
const { data:users=[]} = useGetTeamListQuery();
const [deleteRestoreTask] = useDeleteRestoreTaskMutation()
const {data:taskks=[],refetch,isLoading:fetching} = useGetTasksQuery({
  stage,
  isTrashed,
});
const [createTask,{isLoading,isError}]=useCreateTaskMutation();
const [updateTask]=useUpdateTaskMutation();
const [trashTask] = useTrashTaskMutation();
const {register ,setValue, handleSubmit , reset , formState:{errors} } = useForm();
const [openAdd,setOpenAdd]=useState(false);  
const tasklu = taskks?.tasks || [];
const[editingTask , setEditingTask] = useState({})
const [deletemodal,setDeletemodal] = useState(false)
const[deletingTask ,setDeletingTask ] = useState({})
const [getget , setgetget] = useState(null);
const [dialogue, setDialogue] = useState({ visible: false, x: 0, y: 0 });

const totaltasksperpage = 9;
const [currentPage , setCurrentpage] = useState(1);
const lastindex = totaltasksperpage*currentPage;
const firstindex = lastindex-totaltasksperpage;
const tasks = tasklu.slice(firstindex,lastindex)
const totalPages = Math.ceil(tasklu?.length/totaltasksperpage)
const [openMember,setOpenMember] = useState({});

const handlePageChange = (page)=>{
    if(page>=0&&page<=totalPages){
      setCurrentpage(page)
    }
}


useEffect(()=>{
    if(location.pathname=="/tasks"){
      setStage("")
      setisTrashed("")
    }
    if(location.pathname=="/completed"){
      setStage("completed")
      setisTrashed("")
    }
    if(location.pathname=="/todo"){
      setStage("todo")
      setisTrashed("")
    }
    if(location.pathname=="/in-progress"){
      setStage("in progress")
      setisTrashed("")
    }
    if(location.pathname=="/trashed"){
      setisTrashed("true")
    }
    refetch()
},[location])

 useEffect(()=>{
  console.log(actionType);
  
},[actionType]) 

const restoretask =(task)=>{
setgetget("Restore ")
setDeletemodal(true);
setDeletingTask(task);
setactionType("restore");
}

const deleteparamanent =(task)=>{
setgetget("Permanently delete")
setDeletemodal(true)
setactionType("delete")
setDeletingTask(task)
}

const open = (task=null)=>{
  setEditingTask(task);
  setOpenAdd(!openAdd)
  reset({...task,team:[...task.team.map(i=>i._id)]}||{title:"",stage:"todo",date:"",priority:"normal",team:""})
}

const submitting=async (data)=>{
  if(editingTask){
    try {
      const response = await updateTask(data).unwrap();
        toast.success(response.message)
        console.log(response)
        setOpenAdd(false);
    } catch (error) {
      toast.error(error.data.message);
      console.log({...data})
      
    }
    
  }
  else{
  try {
    await createTask(data).unwrap();
    toast.success("Task Created Successfully")
    
  } catch (error) {
    toast.error(error.data.message)
    console.log(data)
  }
}
}

  // Priority Badge Colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-600";
      case "medium": return "bg-yellow-100 text-yellow-600";
      case "normal": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

const close=()=>{
  setOpenAdd(false);
  setEditingTask(null);
  reset({title:"",stage:"todo",date:"",priority:"normal",team:""});
}

const deleteTask=(task)=>{
  setDeletemodal(true);
  setDeletingTask(task);
}

const canceldelete=()=>{
  setDeletemodal(false);
  setgetget(null)
  setDeletingTask({})
}

const confirmdelete =async ()=>{
  if(getget){
    try {
      const response = await deleteRestoreTask({id:deletingTask._id,actionType}).unwrap();
      toast.success(`Task ${getget} Success`);
      setgetget(null);
      setDeletingTask({})
      setDeletemodal(false);
    } catch (error) {
      toast.error(error.data.message);
    }
  }
  else{
  try {
    const response =await trashTask(deletingTask._id).unwrap();
    toast.success(response.message)
    setDeletemodal(false)
    setDeletingTask({})
    refetch();
  } catch (error) {
    toast.error(error.data.message)
  }
}
}









  
      return (
  <div className='mt-8 min-h-[80vh] p-4 bg-blue-100 rounded-2xl'>
    <ToastContainer/>
    
     { location.pathname=="/tasks" &&
      <div className='absolute z-[0] top-25 right-6 rounded-full bg-white p-2'>
      <div onClick={()=>open()} className=" w-fit flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 
                hover:from-blue-700 hover:to-blue-900 px-5 py-3 rounded-full 
                text-white font-semibold shadow-md shadow-blue-500/50 
                transition-all duration-300 transform hover:scale-105 cursor-pointer">
  <IoAddSharp className="text-5xl md:text-6xl text-white" />
  <span className="text-lg md:text-xl font-bold tracking-wide text-white">Add Task</span> 
</div>
</div>
}
{openAdd && (
  <div className="z-5 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div className="fixed right-[15%] top-[5%] w-2/3 h-[calc(100vh-8rem)] mx-auto text-[1.5vh] bg-white shadow-2xl rounded-xl border border-gray-300 transition-all duration-300 z-20">
    <h2 className="text-[3vh] font-bold text-gray-900 mb-3 text-center">🚀 Assign a Task</h2>

    <form onSubmit={handleSubmit(submitting)} className="space-y-3 px-8">
      {/* Task Title */}
      <div>
        <label className="block text-[2vh] text-gray-700 font-semibold">📌 Task Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          placeholder="Enter task title"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Stage Dropdown */}
      <div>
        <label className="block text-[2vh] text-gray-700 font-semibold">📍 Stage</label>
        <select
          {...register("stage")}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        >
          <option value="todo">📝 Todo</option>
          <option value="in progress">🚀 In Progress</option>
          <option value="completed">✅ Completed</option>
        </select>
      </div>

      {/* Priority Dropdown */}
      <div>
        <label className=" text-[2vh] block text-gray-700 font-semibold">🔥 Priority</label>
        <select
          {...register("priority")}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        >
          <option value="normal">🟢 Normal</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🔵 Low</option>
        </select>
      </div>

      {/* Assign User */}
      <label className="block text-[2vh] text-gray-700 font-semibold mb-2">👥 Assign to Team Members</label>
      <div className=" text-[2vh] h-40 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50">
        
        {users.map((user) => (
          <label key={user._id} className="flex items-center space-x-3 py-2 hover:bg-gray-100 px-2 rounded-lg cursor-pointer">
            <input 
              type="checkbox"
              value={user._id}
              {...register("team")}
              className="h-5 w-5 accent-blue-600"
            />
            <span className="text-gray-800">{user.name}, <span className="text-gray-600">{user.title}</span></span>
          </label>
        ))}
      </div>

      <input
          type='date'
          defaultValue={new Date().toISOString().slice(0,10)}
          {...register("date")}
          className=" text-[1.5vh] w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          placeholder="Enter task title"
        />
        

      
      <div className="flex gap-4">
      {isLoading? "Loading...":
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold px-5 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          ✅ Add Task
        </button>
        }

        <button
          type="button"
          onClick={close}
          className="w-full bg-gray-500 text-white font-bold px-5 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300"
        >
          ❌ Cancel
        </button>
      </div>
    </form>
  </div>
  </div>
)}

{fetching?<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
    </div>
:
<div className="max-w-6xl   mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">📋 Task List</h1>
      {tasks.length==0 &&  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl shadow-lg border border-gray-200">
      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-200 rounded-full">
        <span className="text-2xl text-gray-500">📂</span>
      </div>
      <h2 className="text-lg font-semibold text-gray-700">No Tasks Available</h2>
      <p className="text-sm text-gray-500">You are all caught up! 🎉</p>
    </div>}
      <div className="grid grid-cols-3 gap-3 font-serif ">  
       
          {tasks?.map((task) => (
            
            <div
              key={task._id}
              className="flex flex-col justify-between  bg-white  rounded-xl  shadow-2xl p-5 transition-transform transform   hover:shadow-xl"
            >
    
              
  {!task.isTrashed&&  <Menu as="div" className=" absolute right-1 top-3 p-2 text-2xl cursor-pointer">
  <MenuButton className="cursor-pointer hover:text-cyan-500 transition-transform duration-30 hover:scale-110">
    <CiMenuKebab />
  </MenuButton>
  <MenuItems 
    anchor="bottom" 
    className="bg-white border border-gray-200 shadow-lg rounded-lg space-y-1   -ml-15 "
  >
    <MenuItem onClick={() => open(task)}>
      <a 
        href="/settings" 
        className="block px-4 py-2 text-gray-700 hover:bg-cyan-100 hover:text-cyan-800 rounded transition-all"
      >
        Settings
      </a>
    </MenuItem>
    <MenuItem>
      <a 
        href="/support" 
        className="block px-4 py-2 text-gray-700 hover:bg-cyan-100 hover:text-cyan-800 rounded transition-all"
      >
        Support
      </a>
    </MenuItem>
    <MenuItem>
      <button
        onClick={()=>deleteTask(task)}
        className="block w-full px-4 py-2 text-gray-700 hover:bg-cyan-100 hover:text-cyan-800 rounded transition-all"
      >
        Delete
      </button>
    </MenuItem>
  </MenuItems>
</Menu>
}
  

            
            
              <h2 className="text-[1.5vw] break-words  w-2/3 capitalize font-bold mb-2 text-gray-800">{task.title}</h2>
              
              {/* Priority Badge */}
              <span className={`inline-block w-fit px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>

              {/* Stage */}
              <p className="mt-2 text-gray-500 text-sm">
                Stage: <span className="font-medium text-blue-600">{task.stage}</span>
              </p>

              {/* Due Date */}
              {task.date && (
                <p className="mt-1 text-sm text-gray-400">
                  📅 Due: {new Date(task.date).toLocaleDateString()}
                </p>
              )}

              {/* Team Members */}
              {task.team && task.team.length > 0 && (
                <div className="mt-3">
                  <p className="text-gray-600 font-medium mb-2">👥 Team Members:</p>
                  <div className="flex -space-x-1">
                    {task.team.map((member) => (
                      <div
                        key={member._id}
                        className="flex"
                        title={`${member.name} (${member.title})`}
                      >
                        <span onMouseEnter={(e)=>openuser(member,e)} onMouseLeave={()=>setDialogue({visible:false , x:0 , y:0})} className="mb-2 cursor-pointer bg-blue-300 p-2.5 rounded-full font-bold text-emerald-800 border border-amber-50">
                        {getInitials(member.name)}
                          </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!task.isTrashed &&
              <p className="absolute bottom-2 right-3 text-xs text-gray-400">
                🕒 Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
              }

              {task.isTrashed &&

<div className="flex justify-between py-2">
  <button onClick={()=>restoretask(task)}  className="cursor-pointer text-[1.5vw] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
    Restore
  </button>
  <button onClick={()=>deleteparamanent(task)} className="cursor-pointer text-[1.5vw] px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
    Delete
  </button>
</div>
}
            </div>
          ))}

          
      </div>

      {totalPages>1?
      <div className="flex items-center justify-center gap-4 my-6">
  {/* Previous Button */}
  <button 
    disabled={currentPage === 1} 
    onClick={() => handlePageChange(currentPage - 1)}
    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
      currentPage === 1 
        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
  >
    ⬅️ Prev
  </button>

  {/* Current Page */}
  <span className="text-lg font-bold text-gray-700">
    Page <span className="text-blue-600">{currentPage}</span> of <span className="text-blue-600">{totalPages}</span>
  </span>

  {/* Next Button */}
  <button 
    disabled={currentPage === totalPages} 
    onClick={() => handlePageChange(currentPage + 1)}
    className={` px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
      currentPage === totalPages 
        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
  >
    Next ➡️
  </button>
</div>:""} 
    </div>
}
 {deletemodal&&
  <div className="z-5 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
    <p>Are you sure  want to {getget || "delete"} the Task </p>
    <div className="flex justify-end mt-4">
      <button onClick={canceldelete} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
      <button onClick={confirmdelete}  className="bg-red-500 text-white px-4 py-2 rounded">{getget||"Delete"}</button>
    </div>
  </div>
</div>

 }



  </div>
);
}

export default Tasks