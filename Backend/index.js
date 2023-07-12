const express = require("express");
const app = express();
const connectDB = require("./dbConfig/db");
require("dotenv").config();
app.use(express.json());
const path = require("path");
// const { chats } = require("./data");
const port = process.env.PORT || 2700;

// app.get("/chats", (req, res) => {
//   res.send(chats);
// });
connectDB();

const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const __dirname1 = path.resolve();
// console.log(__dirname1);
app.use(express.static(path.join(__dirname1, "../Frontend/build")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "../Frontend", "build", "index.html"))
);

// app.use(express.static())

const server = app.listen(port, () => {
  console.log("server is running on port ", port);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
