export class QCM implements Question{
    id : string;
    desciription: string;
    options : string[];
    acceptedAnswer : string;
    duration : number;
    score : number; //max score of the question
    topics : string[];
    difficulty : Difficulty;

    constructor(id : string, desciription: string,options : string[], acceptedAnswer : string, duration : number, score : number,  topics : string[], difficulty : Difficulty ){
        this.id = id;
        this.desciription = desciription;
        this.options = options;
        this.acceptedAnswer = acceptedAnswer;
        this.duration = duration;
        this.score = score; //max score of the question
        this.topics = topics;
        this.difficulty =difficulty;
    }
}


export class OpenQuestion implements Question{
    id : string;
    description : string;
    duration : number;
    score : number;
    topics : string[];
    difficulty : Difficulty;

    conctructor(id : string, description: string, duration: number, score: number, topics : string[], difficulty: Difficulty){
        this.id = id;
        this.description = description;
        this.duration = duration;
        this.score = score;
        this.topics = topics;
        this.difficulty = difficulty;
    }
}

export class CodingQuestion implements Question{
    id : string;
    description : string;
    langage : Langage;
    expectedOutput: string;
    duration : number;
    score : number;
    topics : string[];
    difficulty : Difficulty;

    constructor(id : string, desciription: string,expectedOutput : string, duration : number, score : number,  topics : string[], difficulty : Difficulty ){
        this.id = id;
        this.description = desciription;
        this.expectedOutput = expectedOutput;
        this.duration = duration;
        this.score = score; //max score of the question
        this.topics = topics;
        this.difficulty =difficulty;
    }
}


export interface Question{
    id : string;
}

export class Challenge{
    id : string;
    jobId : string;
    questions : Question[];
    duration : number;
    score : number; 

    constructor( id: string, jobId : string, questions : Question[], duration : number, score: number){
        this.id=id;
        this.jobId= jobId;
        this.questions= questions;
        this.duration=duration;
        this.score=score;
    }
}


export class CandidateAnswer{
    id : string;
    candidateId : string;
    challengeId: string;
    answers : Answer[];
    totalScore : number;

    constructor(id : string, candidateId : string, challengeId: string, answers : Answer[], totalScore : number){
        this.id= id;
        this.candidateId=candidateId;
        this.challengeId=challengeId;
        this.answers=answers;
        this.totalScore=totalScore;
    }
    
}

export class Answer{
    id : string;
    challengeId : string;
    answer : string;
    score : number;

    constructor(id : string, challengeId : string, answer: string, score: number){
        this.id=id;
        this.challengeId=challengeId;
        this.answer=answer;
        this.score=score;
    }
}



export enum Difficulty{
    FACILE, MOYEN, DIFFICILE
}

export enum Langage{
    PYTHON,
    C,
    JAVA,
    CPP,
    JAVASCRIPT,
}



//base pour les questions 
export interface CompanyQuestions{}


