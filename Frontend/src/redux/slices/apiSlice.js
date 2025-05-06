import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const API_URI = "/api";

const baseQuery = fetchBaseQuery({baseUrl: API_URI,credentials:'include'});

export const apiSlice = createApi({
    baseQuery,
    tagTypes:["User","Task"],
    endpoints: (builder)=>({
        login: builder.mutation({
            query:(data)=>({
                url:'/user/login',
                method:'POST',
                body:data,
            })
        }),
        logoutUser: builder.mutation({
            query:()=>({
            url:'/user/logout',
            method:"POST",
            })
        }),


        registerUser: builder.mutation({
            query:(data)=>({
                url:'/user/register',
                method:"POST",
                body:data
            }),
            invalidatesTags: ["User"],
        }),
        getTeamList: builder.query({
            query: () => ({
              url: "user/get-team",
              method: "GET",
              credentials: "include", // Ensures cookies (auth token) are sent
            }),
            providesTags: ["User"],
          }),   
          
          updateUserProfile: builder.mutation({
            query: (data) => ({
              url: "user/profile",
              method: "PUT",
              body: data,
              credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),

        activateUserProfile: builder.mutation({
            query: (user) => ({
              url: `user/${user._id}`,
              method: "PUT",
              body:{isActive:!user.isActive},
              credentials: "include",
              
            }),
            invalidatesTags: ["User"],
          }),

          // Delete User Profile (DELETE request)
        deleteUserProfile: builder.mutation({
            query: (userId) => ({
            url: `user/${userId}`,
            method: "DELETE",
            credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),

        changeUserPassword:builder.mutation({
            query:(user)=>({
                url:'user/change-password',
                method:'PUT',
                body:user,
                credentials:'include',
            }),
        }),

        getNotifications : builder.query({
          query:()=>({
            url:"/user/notifications"
          }),
          invalidatesTags:["User"],
        }),

         
    getTasks: builder.query({
        query: ({stage,isTrashed}) =>({
          url: "/task",
          params:{stage,isTrashed}
        }),
        providesTags: ["Task"],
      }),
  
      
      getTask: builder.query({
        query: (id) => `/task/${id}`,
        providesTags: (result, error, id) => [{ type: "Task", id }],
      }),
  
      
      createTask: builder.mutation({
        query: (taskData) => ({
          url: "/task/create",
          method: "POST",
          body: taskData,
        }),
        invalidatesTags: ["Task"],
      }),
  
     
      createSubTask: builder.mutation({
        query: ({ id, subtaskData }) => ({
          url: `/task/create-subtask/${id}`,
          method: "PUT",
          body: subtaskData,
        }),
        invalidatesTags: ["Task"],
      }),
  
   
      updateTask: builder.mutation({
        query: ( data ) => ({
          url: `/task/update/${data._id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["Task"],
      }),
  
      
      deleteRestoreTask: builder.mutation({
        query: ({id,actionType}) => ({
          url: `/task/delete-restore/${id}`,
          method: "DELETE",
          params:{actionType}
        }),
        invalidatesTags: ["Task"],
      }),
  
      trashTask: builder.mutation({
        query: (id) => ({
          url: `/task/${id}`,
          method: "PUT",
        }),
        invalidatesTags: ["Task"],
      }),
  
      
      getDashboardStats: builder.query({
        query: () => "/dashboard",
        providesTags: ["Task"],
      }),
  
      postTaskActivity: builder.mutation({
        query: ({ id, activityData }) => ({
          url: `/task/activity/${id}`,
          method: "POST",
          body: activityData,
        }),
        invalidatesTags: ["Task"],
      }),
      
    })
})


export const {useGetTeamListQuery,useLoginMutation,useLogoutUserMutation,useRegisterUserMutation,useGetNotificationsQuery,
    useUpdateUserProfileMutation,useActivateUserProfileMutation,
    useDeleteUserProfileMutation,useChangeUserPasswordMutation,  useGetTasksQuery,
    useGetTaskQuery,
    useCreateTaskMutation,
    useCreateSubTaskMutation,
    useUpdateTaskMutation,
    useDeleteRestoreTaskMutation,
    useTrashTaskMutation,
    useGetDashboardStatsQuery,
    usePostTaskActivityMutation} = apiSlice;