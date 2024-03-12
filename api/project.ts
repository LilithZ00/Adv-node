import express from "express";
import { conn, queryAsync } from "../connectDB";
import { character_userRequest } from "../model/users";
import mysql from "mysql";

export const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM character_user INNER JOIN character_avatar ON character_user.avatar_id = character_avatar.avatar_id ";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

router.get("/join", (req, res) => {
  const sql = "SELECT * FROM character_user INNER JOIN character_avatar ON character_user.avatar_id = character_avatar.avatar_id INNER JOIN character_post ON character_user.user_id = character_post.user_id";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

router.get("/join/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT * FROM character_post WHERE user_id = ${userId}`;
  conn.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Query trip by id => field idx
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM character_user INNER JOIN character_avatar ON character_user.avatar_id = character_avatar.avatar_id INNER JOIN character_post ON character_user.user_id = character_post.user_id where character_user.user_id = ?";
  conn.query(sql, [id], (err, result) => {
    res.status(200);
    res.json(result);
  });
});

//insert
router.post("/register", (req, res) => {
  const user: character_userRequest = req.body;
  console.log(user);
  let sql =
    "insert into character_user(user_name, user_email, user_password, user_type, avatar_id) values (?,?,?,?,?)";
  sql = mysql.format(sql, [
    user.user_name,
    user.user_email,
    user.user_password,
    user.user_type,
    user.avatar_id
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.insertId
    });
  });
  // return;
});

//delete
router.delete("/delete/:id", (req, res) => {
  const id = +req.params.id;
  let sql = "delete from character_user where user_id = ?";
  conn.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.DeleteId,
    });
  });
});

//update all
// router.put("/:id", (req, res)=>{
//   const id = +req.params.id;
//   const user : character_userRequest = req.body;
//   let sql = "update character_user set user_name = ?, user_email = ?, user_password = ?, user_avatr = ?, user_type = ? where user_id = ?";
//   sql = mysql.format(sql, [
//     user.user_name,
//     user.user_email,
//     user.user_password,
//     user.user_avatr,
//     user.user_type,
//     id
//   ]);
//   conn.query(sql, (err, result)=>{
//     if(err) throw err;
//     res.status(201).json({
//       affected_row : result.affectedRows,
//       last_idx : result.updateId
//     });
//   });
// });
//update fiw
router.put("/update/:id", async (req, res) => {
  const id = +req.params.id;
  const user: character_userRequest = req.body;

  let character_user_Orriginal: character_userRequest | undefined;
  let sql = mysql.format("select * from character_user where user_id = ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  character_user_Orriginal = rawData[0] as character_userRequest;
  console.log(character_user_Orriginal);

  const updateuser = { ...character_user_Orriginal, ...user };

  sql =
    "update character_user set user_name = ?, user_email = ?, user_password = ?, user_type = ?, avatar_id = ? where user_id = ?";
  sql = mysql.format(sql, [
    updateuser.user_name,
    updateuser.user_email,
    updateuser.user_password,
    updateuser.user_type,
    updateuser.avatar_id,
    id
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.updateId,
    });
  });
});
