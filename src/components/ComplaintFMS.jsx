import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../backend/config/firebase";
// Ensure you are using the Modular (v9+) SDK syntax
import { onSnapshot } from "firebase/firestore";
import {
  Eye,
  Edit2,
  Search,
  Filter,
  Calendar as CalendarIcon,
  ClipboardList,
  RefreshCw,
} from "lucide-react";
// Component Imports
import { ComplaintViewModal } from "./ComplaintViewModal";
// import { ComplaintUpdateController } from "./ComplaintUpdateController";
import { STEPSS } from "../backend/constants/stepsConstant";
import { ComplaintUpdateModal } from "./ComplaintUpdateModal";

const ComplaintFMS = () => {
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    contactPerson: "",
    contactNo: "",
    address: "",
    product: "",
    natureOfComplaint: "",
    complaintReceivedFrom: "",
    warrantyStatus: "",
    assignedTo: "",
    sortByLatest: true, // NEW
  });

  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null); // For View
  const [updatingComplaint, setUpdatingComplaint] = useState(null); // For Step Update

  // Load data from Firebase
  const loadData = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "complaints"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComplaints(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };
  // filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      contactPerson: "",
      contactNo: "",
      address: "",
      product: "",
      natureOfComplaint: "",
      complaintReceivedFrom: "",
      warrantyStatus: "",
      assignedTo: "",
      sortByLatest: true,
    });
  };

  const filteredComplaints = complaints
    .filter((c) => {
      const cd = c.complaintDetails || {};

      return (
        (!filters.name ||
          (c.name || cd.name || "")
            .toLowerCase()
            .includes(filters.name.toLowerCase())) &&
        (!filters.contactPerson ||
          (c.contactPerson || cd.contactPerson || "")
            .toLowerCase()
            .includes(filters.contactPerson.toLowerCase())) &&
        (!filters.contactNo ||
          (c.registeredContactNo || cd.registeredContactNo || "").includes(
            filters.contactNo
          )) &&
        (!filters.address ||
          (c.address || cd.address || "")
            .toLowerCase()
            .includes(filters.address.toLowerCase())) &&
        (!filters.product ||
          (c.product || cd.product || "")
            .toLowerCase()
            .includes(filters.product.toLowerCase())) &&
        (!filters.natureOfComplaint ||
          (c.natureOfComplaint || cd.natureOfComplaint || "")
            .toLowerCase()
            .includes(filters.natureOfComplaint.toLowerCase())) &&
        (!filters.complaintReceivedFrom ||
          (c.complaintReceivedFrom || "")
            .toLowerCase()
            .includes(filters.complaintReceivedFrom.toLowerCase())) &&
        (!filters.warrantyStatus ||
          (cd.warrantyStatus || c.warrantyStatus || "").toLowerCase() ===
            filters.warrantyStatus.toLowerCase()) &&
        (!filters.assignedTo ||
          (c.step1_assignEngineer?.engineer || "")
            .toLowerCase()
            .includes(filters.assignedTo.toLowerCase()))
      );
    })
    // ✅ SORT BY LATEST DATE
    .sort((a, b) => {
      if (!filters.sortByLatest) return 0;

      const ad = a.complaintDetails || {};
      const bd = b.complaintDetails || {};

      const dateA =
        ad.createdAt?.toDate?.() ||
        ad.dateOfInstallation?.toDate?.() ||
        new Date(0);

      const dateB =
        bd.createdAt?.toDate?.() ||
        bd.dateOfInstallation?.toDate?.() ||
        new Date(0);

      return dateB - dateA; // ✅ Latest first
    });

  useEffect(() => {
    const q = collection(db, "complaints");
    // This listener stays open and updates the table the second data changes in Firebase
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComplaints(data);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Helper to determine the latest step reached for the 'Status' Column
  // const getCurrentStep = (complaint) => {
  //   if (complaint.step6_completion) return { label: "Completed", color: "bg-green-100 text-green-700 border-green-200" };
  //   if (complaint.step5_payment) return { label: "Step 5: Payment", color: "bg-pink-100 text-pink-700 border-pink-200" };
  //   if (complaint.step4_material) return { label: "Step 4: Material", color: "bg-purple-100 text-purple-700 border-purple-200" };
  //   if (complaint.step3_inspection) return { label: "Step 3: Inspection", color: "bg-orange-100 text-orange-700 border-orange-200" };
  //   if (complaint.step2_warrantyCheck) return { label: "Step 2: Warranty", color: "bg-blue-100 text-blue-700 border-blue-200" };
  //   if (complaint.step1_assignEngineer) return { label: "Step 1: Assigned", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
  //   return { label: "Pending", color: "bg-gray-100 text-gray-700 border-gray-200" };
  // };
  const getCurrentStepBadge = (currentStep) => {
    if (currentStep >= 6) {
      return {
        label: "Completed",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      };
    }

    return {
      label: `Step ${currentStep}: ${STEPSS[currentStep]}`,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* 1. VIEW MODAL (Deep-Dive Report) */}
      {selectedComplaint && (
        <ComplaintViewModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}

      {/* 2. UPDATE MODAL (The Step-by-Step Controller) */}
      {updatingComplaint && (
        <ComplaintUpdateModal
          complaint={updatingComplaint}
          onClose={() => setUpdatingComplaint(false)}
          onRefresh={loadData}
        />
      )}

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Complaint Management System
          </h1>
          <p className="text-sm text-slate-500">
            End-to-end service tracking and operational management.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadData}
            className="p-2 bg-white border rounded-lg hover:bg-gray-50 text-slate-600 transition-colors shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-3">
            <ClipboardList className="text-blue-500" size={20} />
            <span className="text-sm font-bold text-slate-700">
              Total Records: {filteredComplaints.length} / {complaints.length}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Filter size={18} />
            <h2>Filter Leads</h2>
          </div>

          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <input
                type="checkbox"
                checked={filters.sortByLatest}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortByLatest: e.target.checked,
                  }))
                }
              />
              Latest First
            </label>

            <button
              onClick={clearFilters}
              className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-50"
            >
              <RefreshCw size={14} /> Clear Filters
            </button>

            <div className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
              Showing {filteredComplaints.length} leads
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { label: "Customer Name", name: "name" },
            { label: "Contact Person", name: "contactPerson" },
            { label: "Contact No.", name: "contactNo" },
            { label: "Address", name: "address" },
            { label: "Product", name: "product" },
            { label: "Nature of Complaint", name: "natureOfComplaint" },
            { label: "Received From", name: "complaintReceivedFrom" },
            { label: "Warranty Status", name: "warrantyStatus" },
            { label: "Assigned Engineer", name: "assignedTo" },
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                {field.label}
              </label>

              {field.name === "warrantyStatus" ? (
                <select
                  name={field.name}
                  value={filters[field.name]}
                  onChange={handleFilterChange}
                  className="w-full p-2 text-xs border border-slate-200 rounded-md bg-white"
                >
                  <option value="">All</option>
                  <option value="In-Warranty">In Warranty</option>
                  <option value="Out-of-Warranty">Out of Warranty</option>
                </select>
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={filters[field.name]}
                  onChange={handleFilterChange}
                  placeholder={`Search ${field.label}`}
                  className="w-full p-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* Min-width 2200px ensures all 15+ columns show full data without compression */}
          <table className="w-full text-[11px] text-left border-collapse min-w-[2400px]">
            <thead className="bg-slate-800 text-slate-200 sticky top-0 z-10">
              <tr className="uppercase tracking-tighter">
                <th className="p-4 border-r border-slate-700">ID</th>
                <th className="p-4 border-r border-slate-700">Status</th>
                {/* CUSTOMER SECTION */}
                <th className="p-4 bg-slate-700 border-r border-slate-600">
                  Customer Name
                </th>
                <th className="p-4 bg-slate-700 border-r border-slate-600">
                  Contact Person
                </th>
                <th className="p-4 bg-slate-700 border-r border-slate-600">
                  Phone No
                </th>
                <th className="p-4 bg-slate-700 border-r border-slate-600">
                  Site Address
                </th>
                {/* PRODUCT SECTION */}
                <th className="p-4 border-r border-slate-700">Product</th>
                <th className="p-4 border-r border-slate-700">
                  Complaint Nature
                </th>
                <th className="p-4 border-r border-slate-700">
                  Initial Warranty
                </th>
                <th className="p-4 border-r border-slate-700">
                  Installation Date
                </th>
                {/* WORKFLOW DATA */}
                <th className="p-4 bg-blue-900/40 border-r border-slate-700">
                  Engineer (S1)
                </th>
                <th className="p-4 bg-indigo-900/40 border-r border-slate-700">
                  Verify Warranty (S2)
                </th>
                <th className="p-4 bg-amber-900/40 border-r border-slate-700">
                  Inspection Findings (S3)
                </th>
                <th className="p-4 bg-purple-900/40 border-r border-slate-700">
                  Material Required (S4)
                </th>
                <th className="p-4 bg-pink-900/40 border-r border-slate-700">
                  Payment Status (S5)
                </th>
                <th className="p-4 bg-emerald-900/40 border-r border-slate-700">
                  Final Resolution (S6)
                </th>
                <th className="p-4 sticky right-0 bg-slate-800 text-center shadow-[-4px_0px_10px_rgba(0,0,0,0.2)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan="17"
                    className="p-20 text-left text-slate-400 italic"
                  >
                    Synchronizing with ledger...
                  </td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="17" className="p-20 text-center text-slate-400">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const cd = c.complaintDetails || {};
                  const step = getCurrentStepBadge(c.currentStep || 0);

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-blue-50/50 transition-colors whitespace-nowrap group"
                    >
                      <td className="p-4 border-r font-mono font-bold text-blue-600 bg-slate-50/30">
                        {c.id.slice(0, 8)}
                      </td>
                      <td className="p-4 border-r">
                        <span
                          className={`px-2.5 py-1 rounded-full font-black text-[9px] border shadow-sm ${step.color}`}
                        >
                          {step.label}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="p-4 border-r font-bold text-slate-800">
                        {c.name || cd.name || "—"}
                      </td>
                      <td className="p-4 border-r text-slate-600">
                        {c.contactPerson || cd.contactPerson || "—"}
                      </td>
                      <td className="p-4 border-r text-slate-600">
                        {c.registeredContactNo || cd.registeredContactNo || "—"}
                      </td>
                      <td
                        className="p-4 border-r truncate max-w-[200px] text-slate-500"
                        title={c.address || cd.address}
                      >
                        {c.address || cd.address || "—"}
                      </td>

                      {/* Product Info */}
                      <td className="p-4 border-r font-medium">
                        {c.product || cd.product || "—"}
                      </td>
                      <td className="p-4 border-r italic text-slate-500 truncate max-w-[150px]">
                        {c.natureOfComplaint || cd.natureOfComplaint || "—"}
                      </td>
                      <td className="p-4 border-r">
                        <span
                          className={
                            (c.warrantyStatus || cd.warrantyStatus) ===
                            "In Warranty"
                              ? "text-green-600 font-bold"
                              : "text-rose-500 font-bold"
                          }
                        >
                          {c.warrantyStatus || cd.warrantyStatus || "—"}
                        </span>
                      </td>
                      <td className="p-4 border-r text-slate-500">
                        {(c.dateOfInstallation || cd.dateOfInstallation)?.toDate
                          ? (c.dateOfInstallation || cd.dateOfInstallation)
                              .toDate()
                              .toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Step Detailed Data */}
                      <td className="p-4 border-r text-blue-700">
                        {c.currentStep > 1
                          ? c.step1_assignEngineer?.engineer || "—"
                          : "Pending"}
                      </td>

                      <td>
                        {c.currentStep > 2
                          ? c.step2_warrantyCheck?.warrantyStatus || "—"
                          : "Pending"}
                      </td>

                      <td>
                        {c.currentStep > 3
                          ? c.step3_siteVisit?.remarks || "—"
                          : "Pending"}
                      </td>

                      <td>
                        {c.currentStep > 4
                          ? c.step4_consumable?.consumableRequired
                            ? "Yes"
                            : "No"
                          : "Pending"}
                      </td>

                      <td>
                        {c.currentStep > 5
                          ? c.step5_payment?.paymentCollected
                            ? "Yes"
                            : "No"
                          : "Pending"}
                      </td>

                      <td>{c.currentStep >= 6 ? "Done" : "Pending"}</td>

                      {/* Actions */}
                      <td className="p-4 sticky right-0 bg-white border-l shadow-[-6px_0px_15px_rgba(0,0,0,0.05)] z-20">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-bold transition-all"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            onClick={() => setUpdatingComplaint(c)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg font-bold transition-all"
                          >
                            <Edit2 size={14} /> Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
        Complaint Management System{" "}
      </p>
    </div>
  );
};

export default ComplaintFMS;
