import axios from 'axios';
import Course from '../ICourse';
import React, { useEffect, useState } from 'react';
import CurrentUser from '../CurrentUser';
import { hostPort } from '../hostPort';
import img from '../Image/coursesbg/bg1.jpg';



function DisplayCourses({ courses, nextRound, errorHandler, handleGameOver, stopTimer }
    : { courses: [Course, Course], nextRound: () => void, errorHandler: (error: any) => void, handleGameOver: () => void, stopTimer: () =>void }) {

    const [course2Failrate, setcourse2Failrate] = useState<number | string>("?")

    useEffect(() => {
        setcourse2Failrate("?")
    }, [courses]);

    async function showResults() {
        setcourse2Failrate(courses[1].failrate)
    }

    return (
        <div className="row justify-content-center fitContent">
            <CreateButton 
                course={courses[0]}
                courseFailrate={courses[0].failrate}
                showResult={() => showResults()}/>
            <CreateButton 
                course={courses[1]}
                courseFailrate={course2Failrate}
                showResult={() => showResults()}/>
        </div>
    )

    function getRandomBg() {
        const rndInt = Math.floor(Math.random() * 6) + 1;
        const dynamicFile = require('../Image/coursesbg/bg' + rndInt + '.jpg');
        return dynamicFile;
    }

    function CreateButton({course, courseFailrate, showResult} : {course : Course, courseFailrate : number | string, showResult : () => void}) {
        const courseBg = getRandomBg();

        return (
            <button className="col-md-6 noPadding fitContent buttonPlay" style={{ 
                background: `linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url(${courseBg})`,  
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat', }} onClick={
                async (e) => {
                    postAnswer(e);
                }}>
                <div className="col-8 mx-auto">
                    <p className="course-code pPlay">
                        <strong style={{color: 'white'}}>{course.code}</strong>
                    </p>
                    <p className='pPlay' style={{color: 'white'}}>{course.name}</p>
                    <p className='pPlay' style={{color: 'white'}}>{courseFailrate}</p>
                </div>
            </button>
        )



        async function postAnswer(e: React.FormEvent<HTMLButtonElement>) {
            e.preventDefault();
            stopTimer();
            showResult()
                try {
                    const answer = await checkAnswer();
                    if (answer.data === true) {
                        nextRound();
                    }
                    else {
                        handleGameOver();
                    }
                    console.log("Answer posted " + answer.data)
                } catch (e: any) {
                    errorHandler(e)
                }
        }

        async function checkAnswer() {
            let otherCourse = courses[0].code === course.code ? courses[1].code : courses[0].code;
            console.log("Other course: " + otherCourse);
            const answer = await axios.post<boolean>(`http://${hostPort}:8080/course/answer`, {
                codeClicked: course.code,
                otherCode: otherCourse, 
                playerId: CurrentUser.getId()
            });
            return answer;
        }
    }
}

export default DisplayCourses;