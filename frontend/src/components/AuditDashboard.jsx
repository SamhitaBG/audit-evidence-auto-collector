import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuditLogs, filterLogs, getActions, createAuditLog, updateAuditLog, deleteAuditLog, getStats, exportLogs, uploadLogs } from "../api";
import { useAuth } from "../context/AuthContext";
import KPISection from "./KPISection";
import AuditChart from "./AuditChart";
import AIInsightsPanel from "./AIInsightsPanel";
import { LogOut, Plus, Search, Eye, Edit, Trash2, Filter, Calendar, User, Zap, Download, Upload, FileText, Activity } from "lucide-react";

function AuditDashboard() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [availableActions, setAvailableActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Filters State
  const [filters, setFilters] = useState({
    u: "",
    act: "",
    s: "",
    e: ""
  });

  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  // Form State
  const [formData, setFormData] = useState({ username: "", action: "" });
  const [editingId, setEditingId] = useState(null);

  const { logout } = useAuth();

  // Load Initial Data
  useEffect(() => {
    loadStats();
    loadActions();
  }, []);

  // Load Logs on page or filter change (non-debounced filters)
  useEffect(() => {
    loadFilteredLogs(page);
  }, [page, filters.act, filters.s, filters.e]);

  // Debounce Search for Username
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 0) setPage(0);
      else loadFilteredLogs(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.u]);

  const loadFilteredLogs = (p) => {
    setLoading(true);
    // Convert empty strings to null for API
    const params = {
      ...filters,
      page: p,
      size: pageSize,
      s: filters.s ? new Date(filters.s).toISOString() : null,
      e: filters.e ? new Date(filters.e).toISOString() : null
    };

    filterLogs(params)
      .then((res) => {
        setData(res.data.content);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const loadStats = () => {
    getStats().then(res => setStats(res.data)).catch(console.error);
  };

  const loadActions = () => {
    getActions().then(res => setAvailableActions(res.data)).catch(console.error);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleKpiClick = (title) => {
    if (title === "Total Logs") {
      navigate('/logs');
    } else if (title === "Recent Logs (24h)") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      navigate('/logs', { state: { s: yesterday.toISOString().split('T')[0] } });
    } else if (title === "Unique Users") {
      navigate('/logs', { state: { focus: 'search-user-input' } });
    } else if (title === "Active Actions") {
      navigate('/logs', { state: { focus: 'action-type-select' } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editingId ? updateAuditLog(editingId, formData) : createAuditLog([formData]);
    action.then(() => {
      setEditingId(null);
      setFormData({ username: "", action: "" });
      loadFilteredLogs(page);
      loadStats();
      loadActions();
    });
  };
  const handleExport = async () => {
    try {
      const response = await exportLogs();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audit_logs.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export logs.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      await uploadLogs(file);
      alert("File uploaded and logs imported successfully!");
      fetchLogs();
      fetchStats();
    } catch (err) {
      console.error("Upload failed", err);
      alert(err.response?.data || "Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (log) => {
    setEditingId(log.id);
    setFormData({ username: log.username, action: log.action });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteAuditLog(id).then(() => {
        loadFilteredLogs(page);
        loadStats();
      });
    }
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 xl:gap-8 mb-8 md:mb-10 xl:mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                <Zap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Audit Insight</h1>
              <p className="text-gray-500 text-sm mt-0.5">Intelligent monitoring & automated logging</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition border border-blue-100 shadow-sm"
            >
              <Activity size={18} />
              Analytics
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-100 transition border border-emerald-100 shadow-sm"
            >
              <Download size={18} />
              Export
            </button>
            <label className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition border border-blue-100 shadow-sm cursor-pointer">
              <Upload size={18} />
              Import
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
            <button 
              onClick={logout}
              className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition font-semibold"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        <KPISection stats={stats} onKpiClick={handleKpiClick} />

        <AIInsightsPanel />

        {/* ADVANCED FILTER BAR */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-end gap-4 md:gap-6">
          <div className="flex-1 min-w-[280px]">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
              <User size={12} /> Search User
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                id="search-user-input"
                type="text"
                placeholder="Username (debounced)..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={filters.u}
                onChange={(e) => handleFilterChange("u", e.target.value)}
              />
            </div>
          </div>

          <div className="w-64">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
              <Filter size={12} /> Action Type
            </label>
            <select
              id="action-type-select"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none cursor-pointer"
              value={filters.act}
              onChange={(e) => handleFilterChange("act", e.target.value)}
            >
              <option value="">All Actions</option>
              {availableActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                <Calendar size={12} /> Start Date
              </label>
              <input
                type="date"
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={filters.s}
                onChange={(e) => handleFilterChange("s", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                <Calendar size={12} /> End Date
              </label>
              <input
                type="date"
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={filters.e}
                onChange={(e) => handleFilterChange("e", e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={() => setFilters({ u: "", act: "", s: "", e: "" })}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 pb-3"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <AuditChart data={stats?.actionDistribution} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Plus size={20} className="text-blue-500" /> {editingId ? "Edit Entry" : "Manual Log Entry"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1.5">Username</label>
                <input
                  type="text"
                  placeholder="e.g. admin"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1.5">Action</label>
                <input
                  type="text"
                  placeholder="e.g. SYSTEM_CHECK"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                {editingId ? "Update Record" : "Save Log"}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {setEditingId(null); setFormData({username:"", action:""})}}
                  className="w-full text-gray-400 text-sm hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </form>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    <span className="font-bold">Tip:</span> Your backend is now using <span className="font-bold">Spring AOP</span>. Logs are automatically created whenever you save, update, or delete!
                </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-5">Ref ID</th>
                  <th className="px-6 py-5">Actor</th>
                  <th className="px-6 py-5">Event</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 animate-pulse font-medium">Scanning activity stream...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">No logs match your filter criteria</td></tr>
                ) : data.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-6 py-5 text-sm text-gray-400 font-mono">#{item.id}</td>
                    <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
                                {item.username.charAt(0)}
                            </div>
                            <span className="font-bold text-gray-800">{item.username}</span>
                        </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                          item.action.includes('DELETE') ? 'bg-red-50 text-red-600 border-red-100' : 
                          item.action.includes('UPDATE') ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {item.action}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-1 font-medium">{new Date(item.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                        <button 
                          onClick={() => navigate(`/log/${item.id}`)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm" 
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition shadow-sm" 
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm" 
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Displaying <span className="text-gray-900">{data.length}</span> entries • Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 disabled:opacity-50 transition shadow-sm"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 disabled:opacity-50 transition shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditDashboard;
