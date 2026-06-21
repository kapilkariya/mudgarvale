import express from "express";
import Product from "../models/productModel.jsx";

const router = express.Router();

router.get("/google-shopping-feed.xml", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>`;

    products.forEach((product) => {
      const prices = Array.from(product.pricePerWeight.values());
      const minPrice = prices.length ? Math.min(...prices) : 0;

      xml += `
<item>
  <g:id>${product._id}</g:id>
  <g:title><![CDATA[${product.name}]]></g:title>
  <g:description><![CDATA[${product.description}]]></g:description>
  <g:link>https://mudgarvale.com/product/${product._id}</g:link>
  <g:image_link>${product.image}</g:image_link>
  <g:availability>in_stock</g:availability>
  <g:condition>new</g:condition>
  <g:price>${minPrice} INR</g:price>
  <g:brand>MudgarVale</g:brand>
</item>`;
    });

    xml += `
</channel>
</rss>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating feed");
  }
});

export default router;
