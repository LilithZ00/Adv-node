import express from "express";
import { conn, queryAsync } from "../connectDB";
import { character_postRequest } from "../model/post";
import mysql from "mysql";

export const router = express.Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM character_post INNER JOIN character_user ON character_post.user_id = character_user.user_id";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});
router.get("/joinAll", (req, res) => {
  const sql = "SELECT * FROM character_post INNER JOIN character_user ON character_post.user_id = character_user.user_id INNER JOIN character_vote ON character_vote.post_id = character_post.post_id";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});
router.get("/joinUser", (req, res) => {
  const sql = "SELECT * FROM character_post INNER JOIN character_user ON character_post.user_id = character_user.user_id ";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

// router.get("/score10", (req, res) => {
//   const sql = "SELECT *, RANK() OVER (ORDER BY score DESC) AS ranking FROM character_post INNER JOIN character_user ON character_post.user_id = character_user.user_id ORDER BY score DESC LIMIT 10";
//   conn.query(sql, (err, result) => {
//     res.status(200);
//     res.json(result);
//   });
// });

router.get("/score10", (req, res) => {
  const sql = "SELECT *, RANK() OVER (ORDER BY score DESC) AS ranking FROM character_post INNER JOIN character_user ON character_post.user_id = character_user.user_id ORDER BY score DESC LIMIT 10";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});

router.get("/scoreCheck", (req, res) => {
  const sql = "( SELECT * FROM character_vote INNER JOIN character_post ON character_vote.post_id = character_post.post_id WHERE DATE(character_vote.date) = CURDATE() ORDER BY character_vote.score_sum DESC LIMIT 10 ) UNION ( SELECT * FROM character_vote INNER JOIN character_post ON character_vote.post_id = character_post.post_id WHERE DATE(character_vote.date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) ORDER BY character_vote.score_sum DESC LIMIT 10 )";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});


// SELECT * 
// FROM character_post
// INNER JOIN character_user on character_post.user_id = character_user.user_id
// ORDER BY score DESC
// LIMIT 10;

// Query trip by id => field idx
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM character_post INNER JOIN character_user ON character_post.user_id = character_user.user_id where post_id = ?";
  conn.query(sql, [id], (err, result) => {
    res.status(200);
    res.json(result);
  });
});

//Grap
router.get("/grap/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT post_id,score_sum,DATE_FORMAT(date, '%Y-%m-%d') AS date FROM character_vote WHERE date BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE() AND post_id = ? GROUP BY DATE_FORMAT(date, '%Y-%m-%d'), score_sum ORDER BY DATE_FORMAT(date, '%Y-%m-%d');";
  conn.query(sql, [id], (err, result) => {
    res.status(200);
    res.json(result);
  });
});



//insert
router.post("/insert_post", (req, res) => {
  const post: character_postRequest = req.body;
  console.log(post);
  let sql =
    "insert into character_post(post_photo, post_caption, post_time, user_id) values (?,?,?,?)";
  sql = mysql.format(sql, [post.post_photo, post.post_caption, post.post_time, post.user_id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.insertId
    });
  });
  // return;
});

//   deleta
router.delete("/delete_post/:id", (req, res) => {
  const id = +req.params.id;
  let sql = "delete from character_post where post_id = ?";
  conn.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.DeleteId,
    });
  });
});

router.put("/update_post/:id", async (req, res) => {
  const id = +req.params.id;
  const post: character_postRequest = req.body;

  let character_post_Orriginal: character_postRequest | undefined;
  let sql = mysql.format("select * from character_post where post_id = ?", [id]);

  let result = await queryAsync(sql);
  const rawData = JSON.parse(JSON.stringify(result));
  console.log(rawData);
  character_post_Orriginal = rawData[0] as character_postRequest;
  console.log(character_post_Orriginal);

  const updateuser = { ...character_post_Orriginal, ...post };//

  sql =
    "update character_post set post_photo = ?, post_caption = ?, score = ?, post_time = ?, user_id = ? where post_id = ?";
  sql = mysql.format(sql, [
    updateuser.post_photo,
    updateuser.post_caption,
    updateuser.score,
    updateuser.post_time,
    updateuser.user_id,
    id,
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.updateId,
    });
  });
});
