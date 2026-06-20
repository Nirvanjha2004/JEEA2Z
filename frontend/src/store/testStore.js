import { create } from 'zustand';
import api from '../api';

const useTestStore = create((set, get) => ({
  currentTest: null,
  answers: {}, // { questionId: userAnswer }
  markedForReview: new Set(),
  loading: false,

  fetchTest: async (testId) => {
    set({ loading: true });
    try {
      const res = await api.get(`/api/tests/${testId}`);
      const test = res.data.data;

      const initialAnswers = {};
      test.questions.forEach((q) => {
        if (q.user_answer !== null && q.user_answer !== undefined) {
          initialAnswers[q.id] = q.user_answer;
        }
      });

      set({
        currentTest: test,
        answers: initialAnswers,
        markedForReview: new Set(),
        loading: false,
      });
    } catch (err) {
      console.error('Failed to fetch test:', err);
      set({ loading: false });
    }
  },

  setAnswer: (qId, ans) => {
    set((state) => {
      const nextAnswers = { ...state.answers };
      if (ans === null || ans === undefined || ans === '') {
        delete nextAnswers[qId];
      } else {
        nextAnswers[qId] = ans;
      }
      return { answers: nextAnswers };
    });
  },

  toggleMark: (qId) => {
    set((state) => {
      const nextMarks = new Set(state.markedForReview);
      if (nextMarks.has(qId)) {
        nextMarks.delete(qId);
      } else {
        nextMarks.add(qId);
      }
      return { markedForReview: nextMarks };
    });
  },

  submitTest: async (timeTaken) => {
    const { currentTest, answers } = get();
    if (!currentTest) return null;

    try {
      const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
        questionId: parseInt(qId, 10),
        userAnswer: ans,
      }));

      const res = await api.post(`/api/tests/${currentTest.id}/submit`, {
        answers: formattedAnswers,
        timeTaken,
      });

      set({ currentTest: null, answers: {}, markedForReview: new Set() });
      return res.data;
    } catch (err) {
      console.error('Failed to submit test:', err);
      throw err;
    }
  },
}));

export default useTestStore;
