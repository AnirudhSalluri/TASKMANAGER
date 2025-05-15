import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../redux/slices/authSlice';
import getInitials from '../utils/Initialsplit';
import { Menu } from '@headlessui/react';
import { FaCog, FaRegLifeRing, FaLock, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'; 
import { CgProfile } from 'react-icons/cg';
import { FaSearch } from "react-icons/fa";
import Notification from './Notification';
import { useLogoutUserMutation } from '../redux/slices/apiSlice';
import { useForm } from 'react-hook-form';
import { useChangeUserPasswordMutation , useUpdateUserProfileMutation} from '../redux/slices/apiSlice';
import { toast, ToastContainer } from 'react-toastify';

const TopNav = () => {
    const dispatch = useDispatch();
    const [toggleopen, settoggleopen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const userInitials = getInitials(user?.name || "U");
    const [logoutUser] = useLogoutUserMutation();
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const [changeUserPassword] = useChangeUserPasswordMutation();
    const [profileOpen, setProfileopen] = useState(false);
    const [editToggle, setEditToggle] = useState(false);
    const [updateUserProfile, { isLoading, error }] = useUpdateUserProfileMutation();

    const logoutuser = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const edituser = async (data) => {
        try {
            await updateUserProfile(data).unwrap();
            toast.success("User Updated Successfully");
            setEditToggle(false);
            dispatch(setCredentials({ ...user, ...data }));
        } catch (error) {
            toast.error(error.data.message);
        }
    };

    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            await changeUserPassword({ password: data.newPassword }).unwrap();
            toast.success("Password Changed Successfully");
            settoggleopen(false);
        } catch (error) {
            toast.error(error.data.message);
        }
    };

    const onCancel = () => {
        settoggleopen(false);
    };

    const password = watch("newPassword");

    return (
        <>
            {/* Fixed Top Nav */}
            <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 shadow-md bg-white z-30">
                <div className='fixed'><ToastContainer /></div>
                {/* Search Box */}
                <div className='px-6 py-2 w-70 rounded-4xl bg-amber-50 flex flex-row items-center gap-3'>
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="focus:border-transparent focus:outline-none p-2 border-0 rounded"
                    />
                </div>

                <div className='flex gap-4'>
                    <div className='flex items-center text-4xl'><Notification /></div>
                    {/* User Menu */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center gap-2">
                            <span className="bg-blue-400 text-white text-2xl p-3 rounded-full">
                                {userInitials}
                            </span>
                        </Menu.Button>
                        <Menu.Items
                            className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">

                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setProfileopen(true)}
                                        className={`w-full cursor-pointer flex items-center gap-2 px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                                    >
                                        <FaUserCircle className="text-lg" />
                                        Profile
                                    </button>
                                )}
                            </Menu.Item>

                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => settoggleopen(true)}
                                        className={`cursor-pointer flex items-center gap-2 px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                                    >
                                        <FaLock className="text-lg" />
                                        Change Password
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={logoutuser}
                                        className={`flex items-center gap-2 cursor-pointer block w-full text-left px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                                    >
                                        <FaSignOutAlt className="text-lg" />
                                        Logout
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                </div>
            </div>

            {/* Change Password Modal */}
            {toggleopen &&
                <div className='fixed bg-black bg-opacity-50 inset-0 flex justify-center items-start z-50 pt-24'>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 border bg-amber-50 rounded shadow-md max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

                        <div className="mb-3">
                            <label className="block mb-1">New Password</label>
                            <input
                                type="password"
                                {...register("newPassword", { required: "New password is required" })}
                                className="w-full border p-2 rounded"
                            />
                            {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="block mb-1">Confirm Password</label>
                            <input
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) => value === password || "Password does not match"
                                })}
                                className="w-full border p-2 rounded"
                            />
                            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            }

            {/* Profile Modal */}
            {profileOpen &&
                <div className='fixed top-0 inset-x-0 z-50 flex justify-center pt-24'>
                    <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center mx-4">
                        <div className="flex justify-center items-center w-full h-24 mb-4">
                            <span className="text-4xl p-5 rounded-full border-4 border-blue-500 object-cover">
                                {getInitials(user.name)}
                            </span>
                        </div>

                        <h2 className="mt-2 text-xl font-semibold text-gray-800">{user?.name || "John Doe"}</h2>
                        <p className="text-gray-500">{user?.title || "Software Engineer"}</p>
                        <p className="text-gray-600">{user?.email || "johndoe@example.com"}</p>

                        <span className={`mt-3 inline-block px-3 py-1 text-sm font-medium rounded-full 
                          ${user?.role === "Admin" ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}>
                            {user?.role || "User"}
                        </span>

                        <div className="mt-5 flex justify-center gap-4">
                            <button onClick={() => setEditToggle(true)} className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded">
                                Edit Profile
                            </button>
                            <button onClick={logoutuser} className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                                Logout
                            </button>
                            <button onClick={() => setProfileopen(false)} className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            }

            {/* Edit Profile Modal */}
            {editToggle &&
                <div className='fixed bg-black bg-opacity-50 inset-0 flex justify-center items-start z-50 pt-24'>
                    <form onSubmit={handleSubmit(edituser)} className="p-8 border bg-amber-50 rounded shadow-md max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

                        <div className="mb-3">
                            <label className="block mb-1">Name</label>
                            <input
                                type="text"
                                {...register("name", { required: "Name is required" })}
                                className="w-full border p-2 rounded"
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="block mb-1">Email</label>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className="w-full border p-2 rounded"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="block mb-1">Title</label>
                            <input
                                type="text"
                                {...register("title", { required: "Title is required" })}
                                className="w-full border p-2 rounded"
                            />
                            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => setEditToggle(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button type="submit" disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            }
        </>
    );
};

export default TopNav;
