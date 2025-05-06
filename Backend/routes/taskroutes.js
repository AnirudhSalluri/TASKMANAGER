const express = require('express')
const {
createSubTask,
createTask,
dashboardStatistics,
deleteRestoreTask,
getTask,
getTasks,
postTaskActivity,
trashTask,
updateTask,
} = require("../controllers/taskController.js");
const { isAdminRoute, protectRoute }= require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);
router.get("/",(req,res)=>{
    res.send("Hi")
})

router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
router.put("/update/:id", protectRoute, isAdminRoute, updateTask);
router.put("/:id", protectRoute, isAdminRoute, trashTask);

router.delete(
    "/delete-restore/:id?",
    protectRoute,
    isAdminRoute,
    deleteRestoreTask
);

module.exports=router