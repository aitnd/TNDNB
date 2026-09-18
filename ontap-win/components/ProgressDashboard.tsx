import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ExamResult } from '../services/historyService';

export const ProgressDashboard = ({ history }: { history: ExamResult[] }) => {
  const data = useMemo(() => {
    const grouped: Record<string, { scores: number[] }> = {};
    history.forEach(h => {
      const title = h.quizTitle || 'Khác';
      if (!grouped[title]) grouped[title] = { scores: [] };
      grouped[title].scores.push(h.score);
    });
    return Object.entries(grouped).map(([name, val]) => ({
      name: name.length > 20 ? name.slice(0, 20) + '...' : name,
      highScore: Math.max(...val.scores)
    }));
  }, [history]);

  if (data.length === 0) {
    return <p>Chưa có dữ liệu — làm vài bài thi rồi quay lại nhé!</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="highScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
