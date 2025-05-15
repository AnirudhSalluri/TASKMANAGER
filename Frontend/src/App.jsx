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

  function Layout() {
  const location = useLocation();
  const { user, isSidebarOpen } = useSelector((state) => state.auth);

  return user ? (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Navbar />

      {/* Main content with margin based on sidebar state */}
      <div
        className={`flex-1 transition-all duration-300
          ${isSidebarOpen ? "ml-64" : "ml-18"}`}
      >
        {/* Fixed TopNav */}
        <div className="fixed top-0 left-0 right-0 bg-blue-50 z-10 p-4">
          <TopNav />
        </div>

        {/* Content padding to avoid topnav overlap */}
        <div className="pt-16 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
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