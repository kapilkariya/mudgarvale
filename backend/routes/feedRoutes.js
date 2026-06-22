const express = require("express");
const Product = require("../models/Product"); // use the same model as controller

const router = express.Router();

router.get("/google-shopping-feed.xml", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).lean();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>MudgarVale Product Feed</title>
<link>https://mudgarvale.com</link>
<description>Product Feed</description>`;

    products.forEach((product) => {
      const prices = product.pricePerWeight || {};

      Object.entries(prices).forEach(([weight, price]) => {
        xml += `
<item>
<g:id>${product._id}-${weight}kg</g:id>
<g:title><![CDATA[${product.name}]]></g:title>
<g:description><![CDATA[${product.description}]]></g:description>
<g:link>https://mudgarvale.com/product/${product._id}</g:link>
<g:image_link>${product.image}</g:image_link>
<g:availability>in_stock</g:availability>
<g:condition>new</g:condition>
<g:price>${price} INR</g:price>
<g:brand>MudgarVale</g:brand>
<g:item_group_id>${product._id}</g:item_group_id>
<g:size>${weight} KG</g:size>
<g:product_type>${product.category}</g:product_type>
</item>`;
      });
    });

    xml += `
</channel>
</rss>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);

  } catch (err) {
    console.error("FEED ERROR:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
