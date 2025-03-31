import React, { useState } from "react";
import { useGetTeamListQuery, useRegisterUserMutation, useUpdateUserProfileMutation, useActivateUserProfileMutation, useDeleteUserProfileMutation } from "../redux/slices/apiSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Users = () => {
  const { data:users=[], isLoading, isError,refetch } = useGetTeamListQuery();
  const [registerUser] = useRegisterUserMutation();

  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [activateUserProfile] = useActivateUserProfileMutation();
  const [deleteUserProfile] = useDeleteUserProfileMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const openModal = (user = null) => {
    setEditingUser(user);
    setShowModal(true);
    reset(user || { name: "", email: "", password: "", role: "user", title: "" });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    reset();
  };


  const onSubmit = async (formData) => {
    try {
      if (editingUser) {
        await updateUserProfile({ _id: editingUser._id, ...formData }).unwrap();
        toast.success("User updated successfully!");
      } else {
        await registerUser(formData).unwrap();
        toast.success("User added successfully!");

      }
      closeModal();
      refetch();
    } catch (error) {
      toast.error("Operation failed!");
    }
  };

  const toggleActiveStatus = async (user) => {
    try {
      await activateUserProfile(user).unwrap();
      toast.info("User status updated!");
      console.log(user)
    } catch (error) {
      toast.error("Failed to update status!");
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const deleteUser = async () => {
    try {
      await deleteUserProfile(userToDelete._id).unwrap();
      toast.error("User deleted!");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete user!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
          <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
            + Add User
          </button>
        </div>

        {isLoading && <p>Loading...</p>}
        {isError && <p className="text-red-500">Failed to fetch users.</p>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] bg-white shadow-md rounded-lg border">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Active</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4">{user.title}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleActiveStatus(user)}
                      className={`py-1 px-3 rounded-lg ${user.isActive ? "bg-green-500" : "bg-gray-400"} text-white`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => openModal(user)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg mr-2">Edit</button>
                    <button onClick={() => confirmDelete(user)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{editingUser ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input {...register("name", { required: "Name is required" })} placeholder="Name" className="w-full border p-2 rounded mb-2" />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              
              <input {...register("email", { required: "Email is required" })} placeholder="Email" className="w-full border p-2 rounded mb-2" />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              
              {!editingUser && <input {...register("password", { required: "Password is required" })} placeholder="Password" type="password" className="w-full border p-2 rounded mb-2" />}
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}

              <select {...register("role")} className="w-full border p-2 rounded mb-2">
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>

              <input {...register("title", { required: "Title is required" })} placeholder="Title" className="w-full border p-2 rounded mb-2" />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
              
              <div className="flex justify-end">
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete {userToDelete?.name}?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
              <button onClick={deleteUser} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
