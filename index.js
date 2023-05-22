require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Init server
require('./src/server')(app);

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
})