if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const router = express.Router();
const methodOverride = require("method-override");
const bodyParser = require ("body-parser");
const path = require ("path");


const todoRouter = require("./routes/todos");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//app.use(bodyParser.urlencoded)({
  // limit: "10mb",
   //extended: false
 //});

app.use(methodOverride("_method"));
  
mongoose.set("useUnifiedTopology", true);
mongoose.set("debug", true);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});
  
const db = mongoose.connection;
db.on("error", error => console.log);
db.once("open", () => console.log("Connected to Mongoose"));
  
app.use("/todos", todoRouter);

app.listen(process.env.PORT || 2000);

  
