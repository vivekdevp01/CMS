import React, { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../backend/config/firebase";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { logoutUser } from "../backend/services/authService";
import { LayoutDashboard, FilterX, PlusCircle, LogOut, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterDivision, setFilterDivision] = useState("");
  const [filterEngineer, setFilterEngineer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  /* ================= REAL-TIME FIREBASE LISTENER ================= */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "complaints"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          // Using currentStep directly as per your FMS logic
          currentStep: d.currentStep || 0, 
          product: d.complaintDetails?.product || d.product || "UNKNOWN",
          engineer: d.step1_assignEngineer?.engineer || "Unassigned",
          // Hold logic: check boolean or specific status string
          hold: d.hold === true || d.status === "Hold", 
          installDate: d.complaintDetails?.dateOfInstallation?.toDate?.() || 
                       d.dateOfInstallation?.toDate?.() || null,
        };
      });
      setAllComplaints(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ================= COMPUTED DATA (Logic synced with FMS) ================= */
  const { filteredData, stats, chartData } = useMemo(() => {
    const filtered = allComplaints.filter((c) => {
      if (filterDivision && c.product !== filterDivision) return false;
      if (filterEngineer && c.engineer !== filterEngineer) return false;
      if (filterDateFrom && c.installDate < new Date(filterDateFrom)) return false;
      if (filterDateTo && c.installDate > new Date(filterDateTo + "T23:59:59")) return false;

      // Status Filter Logic
      if (filterStatus === "Completed") return c.currentStep >= 6 && !c.hold;
      if (filterStatus === "Hold") return c.hold;
      if (filterStatus === "Pending") return c.currentStep < 6 && !c.hold;

      return true;
    });

    // Exact Detail Calculations for Stats Cards
    const completed = filtered.filter((c) => c.currentStep >= 6 && !c.hold).length;
    const pending = filtered.filter((c) => c.currentStep < 6 && !c.hold).length;
    const hold = filtered.filter((c) => c.hold).length;

    const statsArray = [
      { label: "Completed", value: completed, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Pending", value: pending, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "On Hold", value: hold, color: "text-rose-600", bg: "bg-rose-50" },
      { label: "Total Leads", value: filtered.length, color: "text-slate-700", bg: "bg-slate-50" },
    ];

    // Chart Data Generation (Division-wise)
    const divisions = [...new Set(allComplaints.map((c) => c.product))].sort();
    const chartArray = divisions.map((d) => {
      const items = filtered.filter((c) => c.product === d);
      return {
        name: d,
        Completed: items.filter((i) => i.currentStep >= 6 && !i.hold).length,
        Pending: items.filter((i) => i.currentStep < 6 && !i.hold).length,
        Hold: items.filter((i) => i.hold).length,
      };
    });

    return { filteredData: filtered, stats: statsArray, chartData: chartArray };
  }, [allComplaints, filterDivision, filterEngineer, filterStatus, filterDateFrom, filterDateTo]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 font-sans text-slate-900">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" size={20} />
          <h1 className="text-xl font-black tracking-tight text-slate-800">Complaint Management Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/complaint-form")} className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-sm transition-all">+ New Complaint</button>
          <button onClick={() => navigate("/complaintFMS")} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm transition-all">📊 FMS View</button>
          <button onClick={handleLogout} className="bg-white text-rose-600 border border-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-50 transition-all shadow-sm">Logout</button>
        </div>
      </header>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Start</label>
            <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Date End</label>
            <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Division</label>
            <select value={filterDivision} onChange={(e) => setFilterDivision(e.target.value)} className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none">
              <option value="">All Divisions</option>
              {[...new Set(allComplaints.map(c => c.product))].sort().map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none">
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Hold">On Hold</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setFilterDateFrom(""); setFilterDateTo(""); setFilterDivision(""); setFilterEngineer(""); setFilterStatus(""); }} className="w-full flex items-center justify-center gap-1.5 p-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"><FilterX size={14} /> Clear Filters</button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${item.color.replace('text', 'bg')}`}></div>
            <h3 className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">{item.label}</h3>
            <div className={`text-3xl font-black tracking-tighter ${item.color}`}>
              {loading ? "..." : item.value}
            </div>
            <div className={`mt-2 px-2 py-0.5 rounded-full text-[8px] font-bold ${item.bg} ${item.color}`}>
              {item.label === "Total Leads" ? "100% BASELINE" : `${((item.value / (filteredData.length || 1)) * 100).toFixed(0)}% OF VIEW`}
            </div>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Division Breakdown</h3>
          <div className="flex gap-3 text-[8px] font-bold text-slate-700 uppercase">
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div> Done</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></div> Active</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></div> Hold</span>
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 10, left: -25, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 9, fontWeight: 700 }} angle={-45} textAnchor="end" interval={0} axisLine={true} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 9 }} allowDecimals={false} axisLine={true} tickLine={false} />
              <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: '10px', border: 'black', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }} />
              <Bar dataKey="Completed" fill="#10b981" barSize={12} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Pending" fill="#f59e0b" barSize={12} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Hold" fill="#ef4444" barSize={12} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;