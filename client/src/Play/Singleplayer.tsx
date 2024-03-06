import React, { useEffect, useState } from 'react';
import './singleplayer.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import DisplayCourses from './DisplatCourse';
import Course from '../ICourse';
import CurrentUser from '../CurrentUser';

import Gameover from './Gameover';
import PlayScreen from './PlayScreen';
import { hostPort } from '../hostPort';

enum PlayScreens {
    PLAYING,
    GAMEOVER
}

let gameId = 0;

function Singleplayer({errorHandler} : {errorHandler: (error : any) => void}){

    const [courseList, setCourseList] = useState<[Course, Course]>([{ code: "Abc", name: "placeholder", failrate: 1 }, { code: "Abc", name: "placeholder", failrate: 2 }]);
    const [playState, setPlayState] = useState<PlayScreens>(PlayScreens.PLAYING);

    async function startNextRound(){
        try{
            const response = await axios.post<[Course, Course]>(`http://${hostPort}:8080/game/update`, {
                    gameId: gameId,
                });
            updateDisplayedCourses(response)
        }catch (error: any) {
            errorHandler(error)
        }

    }

    async function updateDisplayedCourses(response: { data: [Course, Course]; }){
        const newCourse: [Course, Course] = response.data;
        // TODO Check that courses is a list of Courses
        console.log("Updating displayed Courses")
        console.log(newCourse)
        setCourseList(newCourse);
    }

    async function setGameOver(){
        try{
            //TODO: fix error handling and post/put beroende på om personen redan finns
            console.log(CurrentUser.getId())
            const response = await axios.post(`http://${hostPort}:8080/leaderboard`, {
                 id: CurrentUser.getId()
                })
            console.log("Player added to leaderboard")
            setPlayState(PlayScreens.GAMEOVER);
            console.log("Wrong answer")
            }
            catch(error: any){
                errorHandler(error)
            }
    }

    async function initGame() {
        try {
            const response1 = await axios.post<number>(`http://${hostPort}:8080/singleplayer`, {
                playerId: CurrentUser.getId()
            });

            gameId = response1.data
            console.log(gameId)

            const response = await axios.get<[Course, Course]>(`http://${hostPort}:8080/game/` + gameId)
            updateDisplayedCourses(response)

        } catch (error: any) {
            errorHandler(error)
        }
    }

    useEffect(() => {
        console.log("Setting up game")
        initGame();
    }, []);

    switch (playState) {
        case PlayScreens.PLAYING:
            return <PlayScreen
                courseList={courseList}
                handleCorrectGuess = {async () => await startNextRound()}
                errorHandler = {(error : any) => errorHandler(error)}
                handleWrongGuess = {async () => await setGameOver()}
            />

        case PlayScreens.GAMEOVER:
            return <Gameover/>
    }
}

export default Singleplayer
