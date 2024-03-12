import express from "express";
import { conn, queryAsync } from "../connectDB";
import { character_avatarRequest } from "../model/avatar";
import mysql from "mysql";

export const router = express.Router();

router.get("/", (req, res) => {
  const sql = "select * from character_avatar";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

// Query trip by id => field idx
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "select * from character_avatar where avatar_id = ?";
  conn.query(sql, [id], (err, result) => {
    res.status(200);
    res.json(result);
  });
});

//insert
router.post("/insert_avatar", (req, res) => {
    const avatar: character_avatarRequest = req.body;
    console.log(avatar);
    let sql =
      "insert into character_avatar(avatar) values (?)";
    sql = mysql.format(sql, [
        avatar.avatar
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res.status(201).json({
        affected_row: result.affectedRows,
        last_idx: result.insertId
      });
    });
});

//delete
router.delete("/delete_avatar/:id", (req, res) => {
    const id = +req.params.id;
    let sql = "delete from character_avatar where avatar_id = ?";
    conn.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.status(201).json({
        affected_row: result.affectedRows,
        last_idx: result.DeleteId,
      });
    });
});

router.put("/update_avatar/:id", async (req, res) => {
    const id = +req.params.id;
    const avatar: character_avatarRequest = req.body;
  
    let character_user_Orriginal: character_avatarRequest | undefined;
    let sql = mysql.format("select * from character_user where user_id = ?", [id]);
  
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    character_user_Orriginal = rawData[0] as character_avatarRequest;
    console.log(character_user_Orriginal);
  
    const updateavatar = { ...character_user_Orriginal, ...avatar };
  
    sql =
      "update character_avatar set avatar = ? where avatar_id = ?";
    sql = mysql.format(sql, [
        updateavatar.avatar,
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
