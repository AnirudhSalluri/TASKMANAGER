const express = require("express");
const cors = require('cors')
const dotenv = require("dotenv");
const morgan = require("morgan");
const userroutes = require('./routes/userroutes')
const taskroutes = require('./routes/taskroutes')
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser")
const path = require('path')



dotenv.config();

const PORT = 5000;

const app = express();


app.use(
  cors({
    origin: [ "http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("MongoDB Connected"))

app.use("/api/user", userroutes);
app.use("/api/task", taskroutes);






app.use(express.static(path.join(__dirname, "../Frontend/dist"))); 


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});

app.use((req,res,next)=>{
  res.status(404).json("Page not found")
}
)



app.listen(PORT, () => console.log(`Server listening on ${PORT}`));