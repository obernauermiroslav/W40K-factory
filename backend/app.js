const express = require("express");
const path = require("path");
const PORT = 3000;
const app = express();
const mysql = require("mysql2");
app.use("/frontend/css", express.static("css"));
const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));

app.use(
  express.static(path.resolve(path.join(__dirname, "/../frontend/static")))
);

app.use(express.static(__dirname + '/views', { type: 'text/javascript' }));


app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "gfa",
  database: "redditFrontend",
});

connection.query(
  `CREATE TABLE IF NOT EXISTS posts 
    (id INT AUTO_INCREMENT primary key NOT NULL, 
    title VARCHAR(300) NOT NULL, 
    url VARCHAR(300) NOT NULL, 
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(), 
   vote INT DEFAULT 0 );`,
  (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("posts table created if did not exist");
  }
);

app.get("/", (req, res) => {
  res.sendFile(
    path.resolve(path.join(__dirname, "/../frontend/views/index.html"))
  );
});

app.post("/api/posts/submit", (req, res) => {
  
  const { Title: title, URL: url } = req.body;
  var tzoffset = new Date().getTimezoneOffset() * 60000;
  const data = req.body;
  const timestamp =
    data?.timestamp ??
    new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
  connection.query(
    `INSERT INTO posts (title, url, timestamp) VALUES (?, ?, ?)`,
    [title, url, timestamp],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.redirect("/");
    }
  );
});

app.get("/submit", (req, res) => {
  res.sendFile(
    path.resolve(path.join(__dirname, "/../frontend/views/submit.html"))
  );
});

app.get("/help", (req, res) => {
  res.sendFile(
    path.resolve(path.join(__dirname, "/../frontend/views/help.html"))
  );
});

app.get("/game", (req, res) => {
  res.sendFile(
    path.resolve(path.join(__dirname, "/../frontend/views/game.html"))
  )
});

app.get("/api/posts/get", (req, res) => {
  connection.query("SELECT * FROM redditfrontend.posts;", (err, posts) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
   // console.log(posts);
    return res.status(200).send(posts);
  });
});

app.delete("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(404).send();
    return;
  }
  connection.query(
    `DELETE FROM redditfrontend.posts WHERE id = ?`,
    [id],
    (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else if (result.affectedRows === 0) {
        res.status(404).send();
      } else {
        res.status(204).send();
      }
    }
  );
});

app.put("/api/posts/:id/upvote", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(404).send();
    return;
  }
  connection.query(
    `UPDATE redditfrontend.posts SET vote = vote + 1  WHERE id = ?`,
    [id],
    (err, posts) => {
      if (err) {
        res.status(400).send();
      }

      return res.status(200).json({ posts });
    }
  );
});

app.put("/api/posts/:id/downvote", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(404).send();
    return;
  }
  connection.query(
    `UPDATE redditfrontend.posts SET vote = vote - 1  WHERE id = ?`,
    [id],
    (err, posts) => {
      if (err) {
        res.status(400).send();
      }

      return res.status(200).json({ posts });
    }
  );
});

app.put("/api/posts/:id", (req, res) => {
  const { Title: title, URL: url } = req.body;
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(404).send();
    return;
  }
  console.log(title, url);
  connection.query(
    `UPDATE redditfrontend.posts SET title = ?, url = ? WHERE id = ?`,
    [title, url, id],
    (err, posts) => {
      //console.log(posts);
      if (err) {
        return res.status(400).send();
      } else {
        return res.status(200).json({ posts });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
