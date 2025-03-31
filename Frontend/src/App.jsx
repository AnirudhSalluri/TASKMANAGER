import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import {Routes,Route,Navigate,Outlet,useLocation} from 'react-router-dom'
import Register from "./pages/Register"
import Tasks from "./pages/Tasks"
import Users from "./pages/Users"
import Trash from "./pages/Trash"
import TaskDetails from "./pages/TaskDetails"
import Navbar from "./components/Navbar"
import TopNav from "./components/TopNav"
import { useSelector } from "react-redux"
import { useEffect } from "react"

function App() {
  const {user,isSidebarOpen} = useSelector((state)=> state.auth);

  useEffect(()=>{
    const cookie = document.cookie;
    if(!cookie){
      localStorage.clear();
    } 
  })

    function Layout(){
     
      const location = useLocation();

      return user?
      (
        <div className="flex  flex-row" >
          <div className="z-4">
          <Navbar  />
          </div>
          <div className={` flex flex-col flex-1 ${isSidebarOpen?"ml-64":"ml-18"}`} >
            <div className={`z-4 fixed bg-blue-50  transition-all duration-300 
                     ${isSidebarOpen ? "w-[calc(100%-16rem)]" : "w-[calc(100%-4.5rem)]"}`}>
          <TopNav/>
          </div>
          <div className="p-4 flex-1 mt-16"><Outlet /></div>
          </div> 
        </div>
      )
      :
      (
        <Navigate to="/log-in" state={{from:location}} replace/>
      );


    }

  return (
    <>
      <main className='w-full min-h-screen '>
        <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/completed" element={<Tasks />} />
              <Route path="/in-progress" element={<Tasks />} />
              <Route path="/todo" element={<Tasks />} />
              <Route path="/users" element={<Users />} />
              <Route path="/trashed" element={<Tasks />} />
              <Route path="/task/:id" element={<TaskDetails />} />

            </Route>

            <Route path="/log-in" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
        </Routes>

    </main>
    </>
  )
}
export default App