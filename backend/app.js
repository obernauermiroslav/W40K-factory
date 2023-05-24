const express = require("express");
const path = require("path");
const PORT = 3000;
const app = express();
const mysql = require("mysql2");
const bcrypt = require('bcrypt');
app.use("/frontend/css", express.static("css"));
const bodyParser = require("body-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static(path.resolve(path.join(__dirname, "/../frontend/static"))));
app.use(express.static(__dirname + '/views', { type: 'text/javascript' }));




const connection = mysql.createConnection({
  host: "localhost",
  user: "gfa",
  database: "redditFrontend",
});

// Create the posts table
connection.query(
  `CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(300) NOT NULL,
    url VARCHAR(300) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    vote INT DEFAULT 0
  );`,
  (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("Posts table created if it did not exist");

    // Create the users table
    connection.query(
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        username VARCHAR(200) NOT NULL,
        password VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
      );`,
      (error) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log("Users table created if it did not exist");
      }
    );
  }
);

app.get("/", (req, res) => {
  res.sendFile(
    path.resolve(path.join(__dirname, "../frontend/views/login.html"))
  );
});

app.get("/main", (req, res) => {
  res.sendFile(
    path.resolve(path.join(__dirname, "../frontend/views/index.html"))
  );
});

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Check if the username or email already exist in the database
  connection.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error checking data in database' });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error saving data to database' });
        }

        const tzoffset = new Date().getTimezoneOffset() * 60000;
        const timestamp = req.body.timestamp ?? new Date(Date.now() - tzoffset).toISOString().slice(0, -1);

        // Store the hashed password in the database
        connection.query(
          'INSERT INTO users (username, email, password, timestamp) VALUES (?, ?, ?, ?)',
          [username, email, hash, timestamp],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Error saving data to database' });
            }
            res.redirect('/');
          }
        );
      });
    }
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
      res.redirect("/main");
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

app.get("/api/posts/getUser", (req, res) => {
  connection.query("SELECT username FROM redditfrontend.users ORDER BY id DESC LIMIT 1;", (err, users) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
   // console.log(posts);
    return res.status(200).send(users);
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
