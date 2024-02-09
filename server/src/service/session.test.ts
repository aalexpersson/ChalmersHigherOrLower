import { Course } from "../model/course";
import { Player } from "../model/player";
import { Session } from "../model/session";
import { CourseService } from "./course";
import { PlayerService } from "./player";
import { SessionService } from "./session";

test("If a session is created it should be in the list of sessions", async () => {
    const sessionService = new SessionService();
    let createdSession = await sessionService.createSession();
    let allSessions = await sessionService.getAllSessions();
    expect(allSessions.map((session: Session) => session.id)).toContain(createdSession.id);
});

test("If a session is created it should be in the list of sessions", async () => {
    const sessionService = new SessionService();
    let createdSession = await sessionService.createSession();
    let recivedSession = await sessionService.getSession(createdSession.id);
    expect(recivedSession).toEqual(createdSession);
});

/*
test("If a player is added to the session it should be in the list of players for that session", async () =>{
    const playerService = PlayerService.getInstance();
    const sessionService = new SessionService();
    let createdPlayer = await playerService.createPlayer("test4");
    let createdSession = await sessionService.createSession();
    await sessionService.addPlayerToSession(createdSession.id, createdPlayer.id);
    let recivedSession = await sessionService.getSession(createdSession.id);
    expect(recivedSession?.players.map(() => createdPlayer)).toContain(createdPlayer)
})*/

test("If a question is added to the session it should be in the list of questions", async () =>{
    const sessionService = new SessionService();
    const courseService = CourseService.getInstance()
    let session = await sessionService.createSession();
    let course = await courseService.createCourse("Flervarre", "MVE655", 0.45)
    console.log(session.id)
    console.log(course.code)
    await sessionService.addQuestion(session.id,course.code)
    let sessionQuestions = await sessionService.getSessionQuestions(session.id);
    expect(sessionQuestions?.map((course: Course) => course.code)).toContain(course.code);
})