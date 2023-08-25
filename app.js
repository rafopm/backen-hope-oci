const createError = require('http-errors');
const express = require('express');
const Database = require("./config/database");
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/postsRoutes');
const postServiceModule = require('./services/post-service'); // Cambio en esta línea

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/posts', postsRouter);

app.get('./views/favicon.ico', (req, res) => res.status(204));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Dentro de tu bloque `app.listen` después de las configuraciones
Database.init()
  .then(() => {
    const postService = new postServiceModule(); // Cambio en esta línea
    app.set("postService", postService);
    
    // app.listen(3000, () => {
    //   console.log("Servidor escuchando en el puerto 3000");
    // });
  })
  .catch((err) => {
    console.error("Error al inicializar la base de datos:", err);
  });

// Agrega un manejador para el evento 'exit' para cerrar la conexión
process.on("exit", () => {
  Database.close();
});

module.exports = app;
