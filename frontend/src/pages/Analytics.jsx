import { useEffect, useState } from "react";
import { getAnalytics } from "../api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowLeft, TrendingUp, Calendar, Activity, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Analytics() {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("7d");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAnalytics();
        // The backend returns [{date: '...', count: ...}]
        // We'll format the dates nicely
        const formatted = response.data.map(item => ({
          ...item,
          displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
        setData(formatted);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <Activity className="text-blue-600" size={32} />
                Security Analytics
              </h1>
              <p className="text-gray-500 text-sm font-medium mt-1">Deep-dive into audit patterns</p>
            </div>
          </div>

          <div className="bg-white p-1 rounded-2xl border border-gray-200 shadow-sm flex gap-1 w-full md:w-auto">
            <button 
              onClick={() => setPeriod("7d")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition ${period === '7d' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setPeriod("30d")}
              className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition ${period === '30d' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              30 Days
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Trend Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Activity Timeline</h3>
                    <p className="text-sm text-gray-400 font-medium">Total log occurrences per day</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                    <TrendingUp size={16} />
                    <span className="text-xs font-black uppercase">+12% Growth</span>
                </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="displayDate" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    itemStyle={{fontWeight: 800, color: '#2563eb'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-blue-50 p-4 rounded-2xl mb-4">
                    <ShieldCheck size={32} className="text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900">Compliance Score</h4>
                <p className="text-xs text-gray-400 mb-4 font-medium">System security health</p>
                <div className="text-4xl font-black text-blue-600">98.2%</div>
             </div>

             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-purple-50 p-4 rounded-2xl mb-4">
                    <Calendar size={32} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900">Peak Activity</h4>
                <p className="text-xs text-gray-400 mb-4 font-medium">Most active timeframe</p>
                <div className="text-4xl font-black text-purple-600">2:00 PM</div>
             </div>

             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-orange-50 p-4 rounded-2xl mb-4">
                    <Zap size={32} className="text-orange-600" />
                </div>
                <h4 className="font-bold text-gray-900">Response Time</h4>
                <p className="text-xs text-gray-400 mb-4 font-medium">Average log processing</p>
                <div className="text-4xl font-black text-orange-600">12ms</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
