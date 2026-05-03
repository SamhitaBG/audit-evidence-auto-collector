import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuditLogById, deleteAuditLog } from "../api";
import { ArrowLeft, Trash2, Edit, AlertCircle, CheckCircle, Info } from "lucide-react";

function LogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogById(id)
      .then(res => {
        setLog(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Delete this log?")) {
      deleteAuditLog(id).then(() => navigate("/"));
    }
  };

  const getScoreBadge = (action) => {
    const act = action?.toUpperCase();
    if (act?.includes("DELETE")) {
      return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold"><AlertCircle size={14}/> HIGH RISK</span>;
    }
    if (act?.includes("UPDATE")) {
      return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold"><Info size={14}/> MEDIUM RISK</span>;
    }
    return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold"><CheckCircle size={14}/> LOW RISK</span>;
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!log) return <div className="p-8 text-center text-red-500">Not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Log Details</h1>
            <p className="text-gray-500">ID: #{log.id}</p>
          </div>
          {getScoreBadge(log.action)}
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Username</label>
              <p className="text-xl font-medium text-gray-800">{log.username}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Timestamp</label>
              <p className="text-xl font-medium text-gray-800">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Action</label>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-gray-700">{log.action}</div>
          </div>

          <div className="flex gap-4 pt-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md">
              <Edit size={18} /> Edit
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white text-red-600 border border-red-100 py-3 rounded-xl font-semibold hover:bg-red-50 transition" onClick={handleDelete}>
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogDetails;
