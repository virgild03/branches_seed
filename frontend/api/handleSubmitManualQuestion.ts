import { addQuestionToFirestore } from "../../backend/firebase/manualQuestion";
import {Difficulty, Type, Language} from "../../backend/commun/types/firebase";
import React from 'react';

const handleSubmitManualQuestion = async (data:any,setChallengeInProgress: React.Dispatch<React.SetStateAction<any>>
) => {
  try{
    const questionData ={
        description: data.description,
        duration: data.duration,
        score: data.score,
        topics: data.topics,
        difficulty:data.difficulty as Difficulty,
        type: data.type as Type,

    };
    
    let question;

    switch(data.type){
        case "QCM":
            question={...questionData,
                options: data.options,
                acceptedAnswer: data.acceptedAnswer
            };
            break;

        case "CodingQuestion":
            question={...questionData,
                expectedOutput: data.expectedOutput,
                language: data.language as Language,
            };
            break;
        
        case "OpenQuestion":
            question={...questionData};
            break;
        
        default: throw new Error("Type inconnu");
    }

    // on ajoute la question a firestore
    const manualQuestionId= await addQuestionToFirestore(question);

    //on ajoute la question au challenge en cours de création
    setChallengeInProgress((prev)=>({
        ...prev,
        score:prev.score+question.score,
        duration: prev.duration+question.duration,
        questions:[...prev.questions, {id: manualQuestionId}],
    }));

  }catch(e){
    console.error("erreur lors de la soumission de la question :", e);
  }
};
export default handleSubmitManualQuestion;
  

