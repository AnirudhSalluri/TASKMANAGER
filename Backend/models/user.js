const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Task = require('./task')
const {Schema} = mongoose;

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is not modified

  const salt = await bcrypt.genSalt(10); // Generate salt (10 rounds)
  this.password = await bcrypt.hash(this.password, salt); // Hash password
  next();
});



const User = mongoose.model("User", userSchema);

module.exports = User