const express = require("express");
const Product = require("../models/productModel");

const router = express.Router();

router.get("/google-shopping-feed.xml", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>MudgarVale Product Feed</title>
<link>https://mudgarvale.com</link>
<description>Product Feed</description>`;

    products.forEach((product) => {
      Object.entries(product.pricePerWeight).forEach(([weight, price]) => {
        xml += `
<item>
<g:id>${product._id}-${weight}kg</g:id>
<title>${product.name}</title>
<description><![CDATA[${product.description}]]></description>
<link>https://mudgarvale.com/product/${product._id}</link>
<g:image_link>${product.image}</g:image_link>
<g:availability>in stock</g:availability>
<g:price>${price} INR</g:price>
<g:brand>MudgarVale</g:brand>
<g:condition>new</g:condition>
<g:item_group_id>${product._id}</g:item_group_id>
<g:size>${weight} KG</g:size>
</item>`;
      });
    });

    xml += `
</channel>
</rss>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).send("Feed Error");
  }
});

module.exports = router;
