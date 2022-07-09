import express from 'express';
import data from "./data.js";

const app = express();

app.get('/api/products', (req, res) => {
    res.send(data.products);
});

// configure port to default free ports from env settings or 5000 if no free ports
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
});