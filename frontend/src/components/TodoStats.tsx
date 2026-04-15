import { useEffect, useState, type FC } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import '../styles/TodoStats.css';

interface MonthlyData {
  month: string;
  created: number;
  completed: number;
}

interface ConsistencyData {
  totalTodos: number;
  completedTodos: number;
  completionRate: number;
  todosInLast30Days: number;
  daysWithTodosInLast30Days: number;
  consistencyScore: number;
}

export const TodoStats: FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [consistencyData, setConsistencyData] = useState<ConsistencyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [monthlyRes, consistencyRes] = await Promise.all([
          fetch('http://localhost:3000/api/todos/stats/monthly'),
          fetch('http://localhost:3000/api/todos/stats/consistency'),
        ]);

        if (monthlyRes.ok) {
          const data = await monthlyRes.json();
          setMonthlyData(data);
        }

        if (consistencyRes.ok) {
          const data = await consistencyRes.json();
          setConsistencyData(data);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !monthlyData.length) {
    return <div className="todo-stats loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="todo-stats error">Error: {error}</div>;
  }

  return (
    <div className="todo-stats">
      <div className="stats-container">
        {consistencyData && (
          <div className="consistency-metrics">
            <h3>ðŸ“Š Your Consistency</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">Total Todos</span>
                <span className="metric-value">{consistencyData.totalTodos}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Completed</span>
                <span className="metric-value">{consistencyData.completedTodos}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Completion Rate</span>
                <span className="metric-value">{consistencyData.completionRate}%</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Days Active (Last 30)</span>
                <span className="metric-value">{consistencyData.daysWithTodosInLast30Days}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Todos (Last 30 Days)</span>
                <span className="metric-value">{consistencyData.todosInLast30Days}</span>
              </div>
              <div className="metric-card highlight">
                <span className="metric-label">Consistency Score</span>
                <span className="metric-value">{consistencyData.consistencyScore}/30</span>
              </div>
            </div>
          </div>
        )}

        {monthlyData.length > 0 && (
          <div className="monthly-chart">
            <h3>ðŸ“ˆ Monthly Todo Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" fill="#8884d8" name="Created" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
