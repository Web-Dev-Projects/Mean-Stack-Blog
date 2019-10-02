const express = require('express');
const cors = require('./middlewares/cors')
const delay = require('./middlewares/delay')
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const sidRouter = require('./routes/sid');
require('./db').connect('blog');

const app = express();

app.use(express.json());
app.use(cors);
app.use(delay);

app.use('/api/sid', sidRouter);

postsRouter.use(require('./middlewares/check-session'))
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})
const port = process.env.PORT || 5000;

let server = app.listen(port, () => {
    console.log("listening to port " + port)
})

process.on('SIGINT', () => { console.log("Bye bye!"); server.close(); process.exit(); });