import React, { useEffect, useState } from 'react';
import './singleplayer.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

interface Course {
    code: string;
    name: string;
    failrate: number;
}
//Ta bort sen
let gameId = 0;

function Singleplayer() {

    const [courseList, setCourseList] = useState<[Course, Course]>([{code : "Abc", name: "placeholder", failrate : 1 },{code : "Abc", name: "placeholder", failrate : 2 }]);

    async function initGame() {
            try {
                console.log("hej")
                const response1 = await axios.post<number>('http://localhost:8080/singleplayer', {
                    playerId : 1
                }); 

                gameId = response1.data
                console.log(gameId)
                

                const response = await axios.get<[Course, Course]>("http://localhost:8080/singlePlayer/" + response1.data)
                const newCourse: [Course, Course] = response.data;
                // TODO Check that courses is a list of Courses
                setCourseList(newCourse);
            } catch (error: any) {
                console.log(error)
            }
    }

    useEffect(() => {
        console.log("ahgakwdjka")
        initGame();
    }, []);

    return (
        <div>
            <div className="container-fluid h-100">
                    <DisplayCourses courses={courseList} newCourse={async() => await initGame()} />
            </div>
            <div className="align-center">
                <h2>10s</h2>
            </div>
        </div>
    )
}

function DisplayCourses({ courses, newCourse }: { courses: [Course, Course], newCourse: () => void }) {
    return (
        <div className="row justify-content-center fitContent">
            {
                createButton(courses[0])
            }
            {
                createButton(courses[1])
            }
        </div>

    )

    function createButton(course: Course) {
        return <button className="col-md-6 noPadding fitContent buttonPlay" style={{ backgroundColor: "aqua" }} onSubmit={
            async (e) => {
                postAnswer(e);
            } }>
            <div className="col-8 mx-auto">
                <p className="course-code pPlay">
                    <strong>{course.code}</strong>
                </p>
                <p className='pPlay'>{course.name}</p>
                <p className='pPlay'>{course.failrate}</p>
            </div>
        </button>;

        function postAnswer(e: React.FormEvent<HTMLButtonElement>) {
            e.preventDefault();
            //Fix post
            axios.post('http://localhost:8080/course', {
                courseCode: course.code
            }); //TODO: Handle error
            newCourse();
        }
    }
}



export default Singleplayer