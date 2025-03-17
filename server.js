const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3444;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

// MySQL Connection
const db = mysql.createConnection({
    host: "oakter.cuzlniri5zxa.ap-south-1.rds.amazonaws.com",
    user: "root",
    password: "poiuytrewq",
    database: "milestones"
});

db.connect((err) => {
    if (err) throw err;
    console.log("✅ Connected to MySQL");
});

// 📌 Home Page - Render Milestones
app.get("/", (req, res) => {
    db.query("SELECT * FROM milestones", (err, results) => {
        if (err) return res.status(500).send(err);
        res.render("index", { milestones: results });
    });
});

// 📌 Add a New Milestone
app.post("/add-milestone", (req, res) => {
    const { name, description, status, delivery_date, todo_list } = req.body;
    const sql = "INSERT INTO milestones (name, description, status, delivery_date, todo_list) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, description, status, delivery_date, todo_list], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect("/");
    });
});

// 📌 Edit Milestone
app.post("/edit-milestone/:id", (req, res) => {
    const { name, description, status, delivery_date, todo_list } = req.body;
    const sql = "UPDATE milestones SET name=?, description=?, status=?, delivery_date=?, todo_list=? WHERE id=?";
    db.query(sql, [name, description, status, delivery_date, todo_list, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect("/");
    });
});

// 📌 Delete Milestone
app.get("/delete/:id", (req, res) => {
    db.query("DELETE FROM milestones WHERE id=?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect("/");
    });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
