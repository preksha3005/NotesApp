// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const app = express();
// import path from 'path';
// const dotenv = require("dotenv");
// dotenv.config();
// const cookieParser = require("cookie-parser");
// const nodemailer = require("nodemailer");
// const User = require("./models/User");
// const Notes = require("./models/Notes_model");
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";
import Notes from "./models/Notes_model.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser()); // middleware function in Express.js that enables the parsing of cookies in incoming requests.
// mongoose.connect("mongodb://localhost:27017/notes-new")
//   .then(() => {
//     console.log("MongoDB connected successfully");
//     // mongoose.connection.close();
//   })
//   .catch(err => {
//     console.error("MongoDB connection error:", err);
//   });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Exit process with failure code if database connection fails
    process.exit(1);
  });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  );
}

app.post("/sign", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ message: "User already exists" });
  } else {
    const hashpass = await bcrypt.hash(password, 8);
    await User.create({ name: name, email: email, password: hashpass });
    return res.json({ status: true, message: "Account created" });
  }
});

app.post("/loginapp", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });
  else {
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.json({ message: "Wrong password" });
    } else {
      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.KEY,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("token", token, { httpOnly: true, maxAge: 360000 });
      return res.json({ status: true, message: "Login successful" });
    }
  }
});

app.post("/forgotpass", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return res.json({ message: "User not found" });
  else {
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.KEY, {
      expiresIn: "5m",
    });
    var transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "preksha.g504@gmail.com",
        pass: process.env.PASS,
      },
    });
    var mailOptions = {
      from: "preksha.g504@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `Click on following link to reset:  http://localhost:3000/resetpass/${token}`,
    };
    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.json({ message: "Error sending mail" });
      } else {
        return res.json({ status: true, message: "Email sent" });
      }
    });
  }
});

app.post("/resetpass/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decode = jwt.verify(token, process.env.KEY);
    console.log("Token verified:", decode);
    const id = decode.id;
    const hash = await bcrypt.hash(password, 8);
    const user = await User.findByIdAndUpdate(id, { password: hash });
    return res.json({ status: true, message: "Updated" });
  } catch {
    return res.json({ message: "Invalid token" });
  }
});

const verifyuser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ message: "No token" });
  }
  const decode = await jwt.verify(token, process.env.KEY);
  req.user = { id: decode.id, name: decode.name };
  console.log("Verified user:", req.user);
  next();
};

app.get("/verify", verifyuser, (req, res) => {
  return res.json({ status: true, message: "Authorised" });
});

app.post("/add", verifyuser, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  Notes.create({ title: title, content: content, user: userId })
    .then((cnote) => res.json({ status: true, message: "Note stored", note:cnote}))
    .catch((err) => res.json({ message: "Error in storing note" }));
});

app.get("/get", verifyuser, async (req, res) => {
  const userId = req.user.id;
  try {
    const notes = await Notes.find({ user: userId }).exec();
    //exec(): This method executes the query and returns a promise that resolves with the result.
    res.json({ status: true, message: "Notes found", notes });
  } catch (err) {
    console.log(err);
    res.json({ message: "Error fetching notes" });
  }
});

app.delete("/delete/:id", verifyuser, async(req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try{
    const deletednote=await Notes.findOneAndDelete({_id:id,user:userId})
    if (!deletednote) {
      return res.status(404).json({ message: "Note not found or unauthorized to delete." });
    }
     const remainingNotes = await Notes.find({ user: userId }).exec();
    res.json(remainingNotes); 
  }
  catch(err)
  {
    console.error("Error: ",err)
  }
});

app.put("/update/:id", verifyuser, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;
  try {
    const updatedNote = await Notes.findOneAndUpdate(
      { _id: id, user: userId },
      { title, content },
      { new: true }
    );
     if (!updatedNote) {
      return res.status(404).json({ message: "Note not found or you don't have permission to edit it." });
    }

    return res.json({ status: true, message: "Note updated successfully",  updatedNote });
  } catch (err) {
    console.error("Error: ", err);
  }
});
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true, message: "Logged out" });
});
app.get("/initial", verifyuser, (req, res) => {
  try {
    const userN = req.user.name[0];
    const initial = userN;
    res.json({ initial });
  } catch (err) {
    res.json({ message: "Error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});

//mongodb+srv://mern_user:<prek7171>@cluster0.uxy03en.mongodb.net/
