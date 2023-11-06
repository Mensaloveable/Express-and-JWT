const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");

// middleware
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

// Specify the directory where your views (templates) are located
app.set("views", path.join(__dirname, "views"));

// database connection
const dbURI =
  "mongodb+srv://mongodb:loveable@cluster0.dko2ncp.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
