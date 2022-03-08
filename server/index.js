const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json")
const { Server } = require("socket.io");
const { setIO, initSocket, startGameLoop } = require("./gameServer");
const cors = require('cors');
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://arjunio-default-rtdb.firebaseio.com"
});
const csrfMiddleware = csrf({cookie: true});
const PORT = 3001;
const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
}});

//socket behavior
setIO(io);
startGameLoop();

io.on('connection', function(socket) {
    initSocket(socket);
});
//authentication stuff
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);
app.use(cors(corsOptions));
app.all("*", (req, res, next) =>{
    res.cookie("XSRF-TOKEN", token = req.csrfToken());
    console.log(token);
    next();
});
//API response
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});
app.use("/login", (req, res) => {
    res.send({
        token: 'test123',
      });
});
app.get("/", (req, res) => {
    res.send("This is some text!").status(200);
});
//postHandler for Cookie
app.post("/sessionLogin", (req,res) => {
    const idToken = req.body.idToken.toString();
    //expires in 5 days
    const expiresIn = 60 * 60 * 24 * 5 *1000; 
    admin
        .auth()
        .createSessionCookie(idToken,{expiresIn})
        .then(
            (sessionCookie) => {
            const options = {maxAge: expiresIn, httpOnly: true};
            res.cookie("sessionID", sessionCookie, options);
            res.end(JSON.stringify({status: "success"}));
        },
        (error) => {
            res.status(401).send("UNAUTHORIZED REQUEST");
        }
        );
})
app.get("/sessionLogout", (req,res) =>{
    res.clearCookie("sessionID");
});
//Finalize Express
server.listen(PORT, function() {
    console.log(`Listening on ${server.address().port}`);
});

//Finalize Socket.IO

