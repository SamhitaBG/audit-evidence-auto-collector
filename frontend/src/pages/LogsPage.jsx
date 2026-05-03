import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { filterLogs, getActions, deleteAuditLog } from "../api";
import { Search, Eye, Edit, Trash2, Filter, Calendar, User, ArrowLeft } from "lucide-react";

function LogsPage() {
  const [data, setData] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [filters, setFilters] = useState({ u: "", act: "", s: "", e: "" });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    getActions().then(res => setAvailableActions(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (location.state) {
      if (location.state.s) {
        setFilters(prev => ({ ...prev, s: location.state.s }));
      }
      if (location.state.focus) {
        setTimeout(() => {
          document.getElementById(location.state.focus)?.focus();
        }, 100);
      }
    }
  }, [location.state]);

  useEffect(() => {
    loadFilteredLogs(page);
  }, [page, filters.act, filters.s, filters.e]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 0) setPage(0);
      else loadFilteredLogs(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.u]);

  const loadFilteredLogs = (p) => {
    setLoading(true);
    const params = {
      ...filters,
      page: p,
      size: pageSize,
      s: filters.s ? new Date(filters.s).toISOString() : null,
      e: filters.e ? new Date(filters.e).toISOString() : null
    };

    filterLogs(params).then((res) => {
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      deleteAuditLog(id).then(() => loadFilteredLogs(page));
    }
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Total Logs Directory</h1>
            <p className="text-gray-500 text-sm mt-1">Full-screen view of all system activities</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition font-semibold"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </header>

        {/* ADVANCED FILTER BAR */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-end gap-4 md:gap-6">
          <div className="flex-1 min-w-[280px]">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <User size={12} /> Search User
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                id="search-user-input"
                type="text"
                placeholder="Username..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={filters.u}
                onChange={(e) => handleFilterChange("u", e.target.value)}
              />
            </div>
          </div>

          <div className="w-64">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
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

        {/* DATA TABLE */}
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

export default LogsPage;
