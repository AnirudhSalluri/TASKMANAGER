import React, { useEffect } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";
import getInitials from "../utils/Initialsplit";
import { useGetTasksQuery, useGetTeamListQuery } from "../redux/slices/apiSlice";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp className="text-red-500" />,
  medium: <MdKeyboardArrowUp className="text-orange-500" />,
  low: <MdKeyboardArrowDown className="text-green-500" />,
};

const TaskTable = ({ tasks }) => (
  <div className="w-full md:w-2/3 bg-white p-6 shadow-md rounded-md overflow-x-auto">
    <table className="w-full min-w-[600px] table-auto border-collapse">
      <thead className="border-b border-gray-300 bg-gray-50">
        <tr className="text-left text-gray-700 uppercase text-sm tracking-wide">
          <th className="py-3 px-4">Task Title</th>
          <th className="py-3 px-4">Priority</th>
          <th className="py-3 px-4">Team</th>
          <th className="py-3 px-4 hidden md:table-cell">Created At</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, id) => (
          <tr
            key={id}
            className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150"
          >
            <td className="py-3 px-4 font-medium text-gray-800">{task.title}</td>
            <td className="py-3 px-4 font-semibold capitalize">
              <div className="flex items-center gap-2">
                {ICONS[task.priority] || null}
                <span>{task.priority}</span>
              </div>
            </td>
            <td className="py-3 px-4 flex gap-2 flex-wrap">
              {task.team.map((member, idx) => (
                <span
                  key={idx}
                  title={member.name}
                  className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {getInitials(member.name)}
                </span>
              ))}
            </td>
            <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">
              {moment(task.date).fromNow()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UserTable = ({ users }) => (
  <div className="w-full md:w-1/3 bg-white p-6 shadow-md rounded-md overflow-x-auto mt-8 md:mt-0">
    <table className="w-full min-w-[400px] table-auto border-collapse">
      <thead className="border-b border-gray-300 bg-gray-50">
        <tr className="text-left text-gray-700 uppercase text-sm tracking-wide">
          <th className="py-3 px-4">Full Name</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Created At</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr
            key={index}
            className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150"
          >
            <td className="py-3 px-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-700 text-white flex items-center justify-center font-semibold text-sm uppercase select-none">
                {getInitials(user.name)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <span className="text-xs text-gray-500">{user.role}</span>
              </div>
            </td>
            <td className="py-3 px-4">
              <p
                className={clsx(
                  "inline-block px-4 py-1 rounded-full text-xs font-semibold select-none",
                  user.isActive
                    ? "bg-blue-200 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                {user.isActive ? "Active" : "Disabled"}
              </p>
            </td>
            <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
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
      <span className="text-3xl font-bold text-gray-900">{count}</span>
      <span className="text-sm text-gray-400">110 last month</span>
    </div>
    <div
      className={clsx(
        "w-12 h-12 rounded-full flex items-center justify-center text-white text-3xl",
        bg
      )}
    >
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const { data: users = [] } = useGetTeamListQuery();
  const { data: tasks = [], isLoading } = useGetTasksQuery({
    stage: "",
    isTrashed: "",
  });

  const allTasks = tasks?.tasks || [];

  const stats = [
    {
      label: "TOTAL TASK",
      total: allTasks.length,
      icon: <FaNewspaper />,
      bg: "bg-blue-600",
    },
    {
      label: "COMPLETED TASK",
      total: allTasks.filter((t) => t.status === "completed").length,
      icon: <MdAdminPanelSettings />,
      bg: "bg-teal-700",
    },
    {
      label: "TASK IN PROGRESS",
      total: allTasks.filter((t) => t.status === "in progress").length,
      icon: <FaNewspaper />,
      bg: "bg-yellow-500",
    },
    {
      label: "TODOS",
      total: allTasks.filter((t) => t.status === "todo").length,
      icon: <FaArrowsToDot />,
      bg: "bg-pink-700",
    },
  ];

  useEffect(() => {
    console.log("Tasks from API:", tasks);
  }, [tasks]);

  return (
    <div className="h-full py-6 px-4 md:px-8 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      {/* Tables */}
      <div className="flex flex-col md:flex-row gap-6">
        <TaskTable tasks={allTasks.slice(0, 10)} />
        <UserTable users={users} />
      </div>
    </div>
  );
};

export default Dashboard;
