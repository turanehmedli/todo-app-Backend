import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [/.+@.+\..+/, "Please fill a valid email address"],
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minLength: [2, "First name must be at least 2 characters long"],
    maxLength: [100, "First name must be at most 100 characters long"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    minLength: [2, "Last name must be at least 2 characters long"],
    maxLength: [100, "Last name must be at most 100 characters long"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
    minLength: [6, "Password must be at least 6 characters long"],
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  },
  refreshToken:{
    type:String,
    default:null
  }
},{timestamps:true}
);

// Use async middleware without calling next() to avoid "next is not a function" issues
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }

  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.matchPassword = function (enteredPassword){
    return bcrypt.compare(enteredPassword, this.password)
}

export const User = mongoose.model("User", userSchema)
