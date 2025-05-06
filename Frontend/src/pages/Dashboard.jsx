import React from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import { summary } from "../assets/data";
import clsx from "clsx";
import getInitials from "../utils/Initialsplit";
import { useGetTasksQuery } from "../redux/slices/apiSlice";
import { useEffect } from "react";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp className="text-red-500" />,
  medium: <MdKeyboardArrowUp className="text-orange-500" />,
  low: <MdKeyboardArrowDown className="text-green-500" />,
};

const TaskTable = ({ tasks }) => (
  <div className="w-full md:w-2/3 bg-white p-4 shadow-md rounded-md">
    <table className="w-full table-auto">
      <thead className="border-b border-gray-300">
        <tr className="text-left text-gray-700">
          <th className="py-2">Task Title</th>
          <th className="py-2">Priority</th>
          <th className="py-2">Team</th>
          <th className="py-2 hidden md:table-cell">Created At</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, id) => (
          <tr key={id} className="border-b border-gray-200 hover:bg-gray-100">
            <td>{task.title}</td>
            <td>{task.priority}</td>
            <td className="flex gap-2">
              {task.team.map((i) => (
                <span className="bg-blue-400 text-amber-100 rounded-full p-2 -mx-2">
                  {getInitials(i.name)}
                </span>
              ))}
            </td>
            <td>{moment(task.date).fromNow()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UserTable = ({ users }) => (
  <div className="w-full md:w-1/3 bg-white p-4 shadow-md rounded-md">
    <table className="w-full table-auto">
      <thead className="border-b border-gray-300">
        <tr className="text-left text-gray-700">
          <th className="py-2">Full Name</th>
          <th className="py-2">Status</th>
          <th className="py-2">Created At</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-700 text-white flex items-center justify-center text-sm">
                {getInitials(user.name)}
              </div>
              <div>
                <p>{user.name}</p>
                <span className="text-xs text-gray-500">{user.role}</span>
              </div>
            </td>
            <td>
              <p
                className={clsx(
                  "w-fit px-3 py-1 rounded-full text-sm",
                  user.isActive ? "bg-blue-200 text-blue-700" : "bg-yellow-100 text-yellow-700"
                )}
              >
                {user.isActive ? "Active" : "Disabled"}
              </p>
            </td>
            <td className="py-2 text-sm text-gray-600">
              {moment(user.createdAt).fromNow()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Card = ({ label, count, bg, icon }) => (
  <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between">
    <div className="flex flex-col justify-between">
      <p className="text-base text-gray-600">{label}</p>
      <span className="text-2xl font-semibold">{count}</span>
      <span className="text-sm text-gray-400">{"110 last month"}</span>
    </div>
    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", bg)}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const { data: tasks = [], isLoading } = useGetTasksQuery({
    stage: "",
    isTrashed: "",
  });

  const totals = tasks?.tasks || [];
  const stats = [
    { label: "TOTAL TASK", total: totals?.length || 0, icon: <FaNewspaper />, bg: "bg-blue-600" },
    { label: "COMPLETED TASK", total: totals["completed"] || 0, icon: <MdAdminPanelSettings />, bg: "bg-teal-700" },
    { label: "TASK IN PROGRESS", total: totals["in progress"] || 0, icon: <FaNewspaper />, bg: "bg-yellow-500" },
    { label: "TODOS", total: totals["todo"], icon: <FaArrowsToDot />, bg: "bg-pink-700" },
  ];

  useEffect(() => {
    console.log(tasks);
  }, []);

  return (
    <div className="h-full py-4 px-4 md:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      <div className="w-full bg-white my-10 p-4 rounded shadow-sm">
        <h4 className="text-xl text-gray-700 font-semibold">Chart by Priority</h4>
        {/* Chart Component Here */}
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 py-8">
        <div className="w-full overflow-x-auto">
          <TaskTable tasks={summary.last10Task} />
        </div>
        <div className="w-full overflow-x-auto">
          <UserTable users={summary.users} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
