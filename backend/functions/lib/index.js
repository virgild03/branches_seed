"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCandidateScore = exports.correctAnswer = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// Correction automatique d’une réponse
exports.correctAnswer = functions.firestore
    .document("Answers/{answerId}")
    .onCreate(async (snap, context) => {
    const answer = snap.data();
    if (!answer)
        return;
    if (answer.corrected)
        return "Already corrected";
    const qSnap = await answer.questionId.get();
    if (!qSnap.exists)
        return;
    const question = qSnap.data();
    if (!question)
        return;
    let score = 0;
    if (answer.type === "QCM") {
        const correct = question.correctAnswer;
        if (answer.selectedOption &&
            correct &&
            answer.selectedOption === correct) {
            score = 1;
        }
    }
    else if (answer.type === "CodingQuestion") {
        const candidateOutput = answer.value?.trim();
        const expectedOutput = question.expectedOutput?.trim();
        if (candidateOutput && expectedOutput && candidateOutput === expectedOutput) {
            score = 1;
        }
    }
    await snap.ref.update({
        score,
        corrected: true,
    });
});
// Mise à jour du score global d’un test après soumission
exports.updateCandidateScore = functions.firestore
    .document("CandidateAnswer/{docId}")
    .onUpdate(async (change, context) => {
    const after = change.after.data();
    if (!after.answers || after.answers.length === 0)
        return;
    let sum = 0;
    for (const ref of after.answers) {
        try {
            const snap = await ref.get();
            if (!snap.exists)
                continue;
            const data = snap.data();
            if (data?.corrected) {
                sum += data.score || 0;
            }
        }
        catch (e) {
            console.warn("Erreur lecture answer:", e);
        }
    }
    await change.after.ref.update({
        score: sum,
    });
});
