const express = require("express");
const Product = require("../models/product");
const router = express.Router();

router.get("/new", (req, res) => res.render("new", { product: new Product() }));

router.get("/edit/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("edit", { product });
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.render("product", { product });
    else res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(404);
  }
});

router.post("/", async (req, res) => {
  const { title, image, description } = req.body;
  let product = new Product({ title, image, description });
  try {
    product = await product.save();
    res.redirect(`/products/${product.id}`);
  } catch (err) {
    console.error(err);
    res.render("new", { product });
  }
});

router.put("/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  const { title, description, image } = req.body;
  product.title = title;
  product.description = description;
  product.image = image;
  try {
    product = await product.save();
    res.redirect(`/products/${product.id}`);
  } catch (err) {
    console.error(err);
    res.render("edit", { product });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(404);
  }
});

module.exports = router;
