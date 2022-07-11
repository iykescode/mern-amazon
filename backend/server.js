import express from 'express';
import data from "./data.js";

const app = express();

app.get('/api/products', (req, res) => {
    res.send(data.products);
});

app.get('/api/products/slug/:slug', (req, res) => {
    const product = data.products.find((x) => x.slug === req.params.slug);

    if (product) {
        res.send(product);
    } else {
        res.status(404).send({message: 'OOPS!!! Product Not Found, Please wait while we redirect you...'});
    }
});

// configure port to default free ports from env settings or 5000 if no free ports
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
});