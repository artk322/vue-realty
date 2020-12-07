/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const history = require('connect-history-api-fallback');
// const serveStatic = require('serve-static');

const users = require('./queries/users.queries');
const posts = require('./queries/posts.queries');

const PORT = process.env.VUE_APP_API_PORT || 3000;
const STATIC_DIR = path.join(__dirname, '../dist');

const app = express();
app.use(history());
app.use(express.static(STATIC_DIR));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Войдите в систему' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(403).send({ message: 'Ошибка пользователя' });
    req.user = user;
    next();
  });
}

// ===============================================================

console.log('NODE_ENV:', process.env.NODE_ENV);
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    res.sendFile(STATIC_DIR + '/index.html');
  } else {
    res.sendStatus(200).send({ message: 'API vue-realty.kz' });
  }
});

app.post('/api/token', authenticateToken, (req, res) => {
  res.status(200).send({ user: req.user });
});

// ======================= USERS =================================

app.get('/api/users', authenticateToken, users.fetchUsers);
app.put('/api/updateUser', authenticateToken, users.updateUser);
app.post('/api/deleteUser', authenticateToken, users.deleteUser);
app.post('/api/register', users.createUser);
app.post('/api/sendRecoveryEmail', users.sendRecoveryEmail);
app.put('/api/resetPassword', users.resetPassword);
app.post('/api/login', users.login);
app.post('/api/logout', (req, res) => {
  res.status(200).send({ message: 'Вы вышли из системы' });
});
app.post('/api/verifyEmail', users.verifyEmail);

// ======================= POSTS =================================

app.get('/api/posts', posts.fetchPosts);
app.post('/api/fetch-geometry', posts.fetchGeometry);
app.post('/api/create-post', authenticateToken, posts.createPost);
app.put('/api/update-post', authenticateToken, posts.updatePost);
app.post('/api/delete-post', authenticateToken, posts.deletePost);

app.listen(PORT, _ => {
  console.log(`App running on port: ${PORT}.`);
});
