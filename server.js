const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product");
const ejs = require("ejs");
const morgan = require("morgan");
const methodOverride = require("method-override");

const productRouter = require("./routes/products");

const app = express();
const port = process.env.PORT || 3000;

const dbURI = "mongodb+srv://george-bacalu:" + process.env.MONGO_ATLAS_PASSWORD + "@storage.isc7p.mongodb.net/market?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log("Successfully connected to db");
    app.listen(port, () => console.log(`Server running on port ${port}!`));
  })
  .catch(err => console.error("Connection to db failed", err));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(methodOverride("_method"));

app.use("/products", productRouter);

app.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render("index", { products });
  } catch (err) {
    console.error(err);
    res.sendStatus(404);
  }
});

app.use((req, res) => res.status(404).render("404", { message: "404 - Page Not Found!" }));
