import express from "express";
import { conn, queryAsync } from "../connectDB";
import { character_voteRequest } from "../model/vote";
import mysql from "mysql";

export const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM character_vote";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

// get date 7
//SELECT * FROM your_table WHERE your_date_column >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
router.get("/date", (req, res) => {
  const sql = "SELECT date FROM character_vote where date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

router.get("/join", (req, res) => {
  const sql = "SELECT * FROM character_vote INNER JOIN character_user on character_user.user_id = character_vote.user_id INNER JOIN character_post on character_post.post_id = character_vote.post_id ORDER BY vote_id";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = 
  `SELECT * FROM character_vote INNER JOIN character_user on character_user.user_id = character_vote.user_id INNER JOIN character_post on character_post.post_id = character_vote.post_id where vote_id = ${id}`;
  conn.query(sql, [id], (err, result) => {
    res.status(200);
    res.json(result);
  });
});

//date
router.get("/date/:date", (req, res) => {
  const date = req.params.date;
  const sql = 
  'SELECT * FROM character_vote WHERE DATE(date) = ?';
  conn.query(sql, [date], (err, result) => {
    res.status(200);
    res.json(result);
  });
});

//insert
router.post("/insert_vote", (req, res) => {
  const vote: character_voteRequest = req.body;
  console.log(vote);
  
  let sql = "INSERT INTO character_vote (vote_sum, score_sum, date, user_id, post_id) VALUES (?, ?, NOW(), ?, ?)";
  const values = [vote.vote_sum, vote.score_sum, vote.user_id, vote.post_id];
  
  sql = mysql.format(sql, values);
  
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.insertId,
    });
  });
  
});

//delete
router.delete("/delete_vote/:id", (req, res) => {
  const id = +req.params.id;
  let sql = "DELETE FROM character_vote WHERE post_id = ?";
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json({
      affected_rows: result.affectedRows,
      changed_rows: result.changedRows,
    });
  });
});

router.put("/update/:id", async (req, res) => {
  const id = +req.params.id;
  const vote: character_voteRequest = req.body;

  let character_vote_Orriginal: character_voteRequest | undefined;
  let sql = mysql.format("select * from character_vote where vote_id = ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  character_vote_Orriginal = rawData[0] as character_voteRequest;
  console.log(character_vote_Orriginal);

  const updatevote = { ...character_vote_Orriginal, ...vote };

  sql = "update character_vote set vote_sum = ?, score_sum = ?, date = NOW(), user_id = ?, post_id = ? where vote_id = ?";
  sql = mysql.format(sql, [updatevote.vote_sum, updatevote.score_sum, updatevote.user_id, updatevote.post_id, id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.updateId,
    });
  });
});
