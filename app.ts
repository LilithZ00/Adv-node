import express from "express";
import { router as index } from "./api/index";
import { router as project } from "./api/project"; 
import { router as post } from "./api/post"; 
import { router as vote } from "./api/vote"; 
import { router as avatar } from "./api/avatar"; 
import { router as upload } from "./api/upload";
import bodyParser from "body-parser";
import cors from "cors";

export const app = express();
// app.use("/", (req, res) => {
//   res.send("Hello World!!!");
// });
app.use(
    cors({
      origin: "*",
    })
);
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use("/", index);
app.use("/project", project);
app.use("/post", post);
app.use("/vote", vote);
app.use("/avatar", avatar);


app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));


