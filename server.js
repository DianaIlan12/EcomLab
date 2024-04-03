const morgan = require('morgan')
const express = require("express");
const bodyParser = require('body-parser')
const cron = require('node-cron');
const fs = require('fs')
const path = require('path')
const os = require('os')
const cookieParser = require("cookie-parser");
const socket = require('./socket')
const app = express();

var privateKey = fs.readFileSync('sslcert/private.key', 'utf8');
var certificate = fs.readFileSync('sslcert/certificate.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

const server = require('https').Server(credentials, app);


require('dotenv').config();

const paymentRouter = require('./routes/payments')
const cardRouter = require('./routes/card')
const siteRouter = require('./routes/index')
const authRouter = require('./routes/user')

const db = require("./config/db");
const _TBC_METHODS = require('./controller/TBC');


function setEnvValue(key, value) {

  // read file from hdd & split if from a linebreak to a array
  const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

  // find the env we want based on the key
  const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
    return line.match(new RegExp(key));
  }));

  // replace the key/value with the new value
  ENV_VARS.splice(target, 1, `${key}=${value}`);

  // write everything back to the file system
  fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));

}

//Cron tasks
cron.schedule('* */12 * * *', async () => {
  const token = await _TBC_METHODS.getToken();
  process.env.ACCESS_TOKEN = token
  setEnvValue("ACCESS_TOKEN", token);
});

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.enable("trust proxy");

//BodyParser
app.use(bodyParser.json());

//Morgan
const log = fs.createWriteStream(
  path.join(__dirname, "logs", "express.log"), { flags: "a" }
);

morgan.token('req-headers', function (req, res) {
  return JSON.stringify(req.headers)
})

app.use(morgan('-------------------------\n :method\n :url\n :status\n :req-headers', { stream: log }));

//Sync
db.sequelize.sync();

//View engine
app.use('/static', express.static('static'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//Define Routes
app.use('/', siteRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/card', cardRouter)
app.use('/api/auth', authRouter)

// set port, listen for requests
const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`server at port ${PORT}`);
});

socket.connect(server);