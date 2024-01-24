import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
import cors from "cors";
const port = process.env.PORT || 3000;
// const secretKey = "dzgyhfg435rwefsss3";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://web-socket-frontend.vercel.app/",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// app.get("/login", (req, res) => {
//   const token = jwt.sign({ _id: "gbeuqgeuwyaf45345" }, secretKey);
//   res
//     .cookie("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//     })
//     .json({
//       message: "Login Successfully",
//       token,
//     });
// });

// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);
//     const token = socket.request.cookies.token;
//     if (!token) return next(new Error("Authenticate Error"));
//     const decode = jwt.verify(token, secretKey);
//     next();
//   });
// });
io.on("connection", (socket) => {
  console.log("user is connected", socket.id);
  socket.on("message", ({ message, room }) => {
    console.log({ message, room });
    // io.emit("receive-message", data);
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("usr join room", room);
  });
  // socket.emit("welcome", `welcome to the server `);
  //   // it will send message to all except one
  //   socket.broadcast.emit("welcome", `${socket.id} join the server`);
  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
  });
});
server.listen(port, () => {
  console.log(`Server is running on port no ${port}`);
});
