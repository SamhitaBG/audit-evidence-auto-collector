import { useState } from "react";
import { Sparkles, Loader2, TrendingUp, AlertTriangle, UserCheck, Shield } from "lucide-react";

function AIInsightsPanel() {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);

  const generateInsight = () => {
    setLoading(true);
    setInsight(null);
    
    // Simulate AI Processing
    setTimeout(() => {
      setInsight({
        summary: "Detected unusual deletion spike from user 'admin' between 2:00 PM and 3:00 PM.",
        score: "Medium",
        recommendations: [
          "Verify the intentionality of bulk deletions.",
          "Check admin session logs for IP consistency.",
          "Enable dual-authorization for deletion actions."
        ],
        stats: {
          riskIndex: 68,
          anomalyCount: 4
        }
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg">
                <Sparkles size={20} className="text-purple-600" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">AI Security Insights</h3>
                <p className="text-xs text-gray-500 font-medium">Predictive anomaly detection powered by ML</p>
            </div>
        </div>
        <button 
          onClick={generateInsight}
          disabled={loading}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-100 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <TrendingUp size={18} />}
          {loading ? "Analyzing..." : "Generate Insights"}
        </button>
      </div>

      {!insight && !loading && (
        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-gray-400 font-medium">Click the button above to run security analysis on recent logs.</p>
        </div>
      )}

      {insight && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-purple-50/50 rounded-2xl border border-purple-100 p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-purple-100">
                        <AlertTriangle className="text-orange-500" size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded uppercase tracking-tighter">
                                {insight.score} Risk Level
                            </span>
                        </div>
                        <p className="text-gray-800 font-medium leading-relaxed">{insight.summary}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Shield size={14} />
                            <span className="text-xs font-bold uppercase tracking-widest">Risk Index</span>
                        </div>
                        <p className="text-2xl font-black text-purple-600">{insight.stats.riskIndex}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <UserCheck size={14} />
                            <span className="text-xs font-bold uppercase tracking-widest">Anomalies</span>
                        </div>
                        <p className="text-2xl font-black text-purple-600">{insight.stats.anomalyCount} Found</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-xs font-black text-purple-400 uppercase tracking-widest">Recommended Actions</p>
                    {insight.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-gray-700 bg-white/50 p-2 rounded-lg border border-purple-50">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            {rec}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default AIInsightsPanel;
