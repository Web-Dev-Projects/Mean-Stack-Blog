const express = require('express');
const cors = require('./middlewares/cors')
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
require('./db').connect('blog');

const app = express();

app.use(express.json());
app.use(cors);

app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("listening to port " + port)
})


