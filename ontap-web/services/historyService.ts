import { db } from './firebaseClient';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Quiz, UserAnswers } from '../types';

export interface ExamResult {
    id?: string;
    studentId?: string; // Add this
    userId: string; // Keep for compatibility or alias
    quizId: string;
    quizTitle: string;
    score: number;
    totalQuestions: number;
    timeTaken: number; // in seconds
    completedAt: Date;
    answers: UserAnswers;
    roomId?: string;
    type?: string;
}

export const saveExamResult = async (userId: string, quiz: Quiz, score: number, answers: UserAnswers, timeTaken: number) => {
    try {
        const result = {
            studentId: userId, // Use studentId to match main app
            quizId: quiz.id,
            quizTitle: quiz.title,
            score,
            totalQuestions: quiz.questions.length,
            timeTaken,
            completedAt: new Date(),
            answers
        };

        await addDoc(collection(db, 'exam_results'), {
            ...result,
            completedAt: Timestamp.fromDate(result.completedAt)
        });
        console.log("Exam result saved successfully");
    } catch (error) {
        console.error("Error saving exam result:", error);
        throw error;
    }
};

export const getExamHistory = async (userId: string): Promise<ExamResult[]> => {
    try {
        // Semantic Fix: Remove 'orderBy' to avoid "Missing Index" error.
        // We will sort in memory since the result set per student is small.
        const q = query(
            collection(db, 'exam_results'),
            where('studentId', '==', userId)
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Handle different timestamp fields (Online Exam uses submitted_at, Practice uses completedAt)
            const timestamp = data.submitted_at || data.completedAt;
            const completedDate = timestamp ? timestamp.toDate() : new Date();

            return {
                id: doc.id,
                ...data,
                userId: data.studentId, // Map back if needed
                completedAt: completedDate
            } as ExamResult;
        });

        // Client-side Sort
        return results.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    } catch (error) {
        console.error("Error fetching exam history:", error);
        return [];
    }
};
