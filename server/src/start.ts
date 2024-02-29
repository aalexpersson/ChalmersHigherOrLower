import express from "express";
import { leaderboardRouter } from "./router/leaderboard";
import { playerRouter } from "./router/player";
import { courseRouter } from "./router/course";
import cors from "cors";
import { CourseService } from "./service/course";
import { singlePlayerRouter } from "./router/singlePlayer";
import { userService } from "./service/user";
import { userRouter } from "./router/user";
import { mpRouter } from "./router/multiplayer";
import { Server } from 'socket.io';
import { gameRouter } from "./router/game";





export const app = express();
app.use(express.json());
app.use(cors());
app.use("/leaderboard", leaderboardRouter);
app.use("/player", playerRouter);
app.use("/course", courseRouter);
app.use("/singlePlayer", singlePlayerRouter);
app.use("/user", userRouter)
app.use("/multiPlayer", mpRouter)
app.use("/game", gameRouter)

const http = require('http');
export const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin: "http://localhost:3000"
    }
});

//server.listen(process.env.PORT || 3000, () => console.log(`Server has started`))

io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });

io.on('connection', (socket) => {
    /*socket.on('room', (gamePin)=>{;
        console.log("Roooommmm: " + gamePin.data)
    })*/

    socket.on("join_room", (gamePin) => {
        console.log("Trying to join game: " + gamePin)
        socket.join(gamePin);
    });
    
    socket.on("alert_joined", (gamePin) => {
        console.log("Alert join game: " + gamePin)
        socket.to(gamePin).emit('user_joined')
    })

    socket.on("start_game", (data) =>{
        console.log(`Notify fetchRound for: ${data.gamePin} and gameId: ${data.gameId}`)
        socket.to(data.gamePin).emit("starting")
        socket.to(data.gamePin).emit("new_round_started", data.gameId);
    })

    socket.on("new_round", (data) =>{
        console.log(`Notify fetchRound for: ${data.gamePin} and gameId: ${data.gameId}`)
        socket.to(data.gamePin).emit("new_round_started", data.gameId);
    })

    socket.on("end_game", (gamePin) =>{
        console.log(`Notify endGame for: ${gamePin}`)
        socket.to(gamePin).emit("game_over");
    })
});



//TODO: Borde bryta ut
const courseService = CourseService.getInstance()
const UserService = new userService()

const url = "https://stats.ftek.se/courses?items=100"
        var XMLHttpRequest = require('xhr2');
        let a = new XMLHttpRequest;
        a.open("GET", url);
        a.send();
        a.onreadystatechange = async function(){


            if(a.readyState === 4 && a.status === 200){

                const obj = JSON.parse(a.responseText)
                const courses : Object[] = obj.courses

                let i = 0;
                courses.forEach(async data => {
                    let course = JSON.parse(JSON.stringify(data))
                    
                    let code = course.courseCode
                    let name = course.courseName
                    let prate : number = course.passRate * 100;
                    let failrate : number = 100 - prate;
                    let decimalPlaces = 2
                    let failrateRounded = Number(Math.round(parseFloat(failrate + 'e' + decimalPlaces)) + 'e-' + decimalPlaces)
                    let people = course.total

                    /*
                    console.log("Code for course: " + code + "\n");
                    console.log("Name of course: " + name + "\n");
                    console.log("Passrate of course: " + prate + " \n")
                    console.log("People in course: " + people + " \n")



                    console.log("-----------------\n")
                    i += 1
                    */
                    if(people >= 100){
                        await courseService.createCourse(code, name, failrateRounded)
                    }
                });
                //console.log("Finished with adding tasks")
                //let player = await UserService.createUser("test", "test")
                //console.log(JSON.stringify(player))
            }
        }

