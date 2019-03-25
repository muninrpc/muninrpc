const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('client'))
// app.get('/', (req, res) => {
//   res.sendFile(path.resolve('app/client/index.html'))
// })

app.listen(3000, () => console.log('Listening on port 3000'))