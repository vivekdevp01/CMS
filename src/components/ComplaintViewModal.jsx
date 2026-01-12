import React from "react";
import {
  X,
  User,
  Phone,
  Package,
  Shield,
  Users,
  Calendar,
  MapPin,
  ClipboardList,
  CheckCircle2,
  Truck,
  CreditCard,
  HardHat,
  Hash,
  Search,
  AlertCircle,
} from "lucide-react";

export const ComplaintViewModal = ({ complaint, onClose }) => {
  if (!complaint) return null;
  const d = complaint.complaintDetails || {};

  const InfoRow = ({ icon: Icon, label, value, color = "text-gray-400" }) => (
    <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
      <Icon size={14} className={`${color} mt-0.5`} />
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
          {label}
        </p>
        <p
          className={`text-sm font-medium ${
            value !== undefined && value !== null
              ? "text-gray-700"
              : "text-gray-300 italic"
          }`}
        >
          {value !== undefined && value !== null
            ? String(value)
            : "Not yet updated"}
        </p>
      </div>
    </div>
  );

  const StepCard = ({ title, icon: Icon, color, children, isCompleted }) => {
    return (
      <div className="relative pl-6 pb-6 last:pb-0">
        <div className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-gray-100 last:hidden"></div>

        {/* Step Icon - Grayed out if not completed */}
        <div
          className={`absolute left-0 top-0 p-1.5 rounded-full z-10 shadow-sm ${
            isCompleted ? color : "bg-gray-200"
          } text-white`}
        >
          {isCompleted ? <Icon size={12} /> : <AlertCircle size={12} />}
        </div>

        {/* Card Body - Faded if not completed */}
        <div
          className={`bg-white border rounded-xl p-4 shadow-sm transition-all ${
            isCompleted
              ? "border-gray-100 opacity-100"
              : "border-gray-50 opacity-60 bg-gray-50/30"
          }`}
        >
          <div className="flex justify-between items-center mb-2 border-b border-gray-50 pb-1">
            <h4 className="text-xs font-bold text-gray-800">{title}</h4>
            {!isCompleted && (
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                Inactive
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#f8fafc] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 flex justify-between items-center text-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500 text-[10px] px-2 py-0.5 rounded-full uppercase font-black">
                Master Lead Report
              </span>
              <h2 className="text-xl font-bold">Service Lifecycle View</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Ref ID: {complaint.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <section>
                <h3 className="text-[11px] font-black text-blue-600 uppercase mb-3 flex items-center gap-2">
                  <User size={14} /> Customer Profile
                </h3>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <InfoRow icon={User} label="Name" value={d.name} />
                  <InfoRow
                    icon={User}
                    label="Contact Person"
                    value={d.contactPerson}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Contact No"
                    value={d.registeredContactNo}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Site Address"
                    value={d.address}
                  />
                </div>
              </section>

              <section>
                <h3 className="text-[11px] font-black text-indigo-600 uppercase mb-3 flex items-center gap-2">
                  <Package size={14} /> Asset Information
                </h3>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <InfoRow
                    icon={Package}
                    label="Product Type"
                    value={d.product}
                  />
                  <InfoRow
                    icon={Shield}
                    label="Warranty Status"
                    value={d.warrantyStatus}
                    color="text-amber-500"
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Installation Date"
                    value={d.dateOfInstallation
                      ?.toDate?.()
                      .toLocaleDateString()}
                  />
                  <InfoRow
                    icon={ClipboardList}
                    label="Nature of Issue"
                    value={d.natureOfComplaint}
                  />
                </div>
              </section>
            </div>

            {/* All Steps Timeline */}
            <div className="lg:col-span-2">
              <h3 className="text-[11px] font-black text-emerald-600 uppercase mb-4 flex items-center gap-2">
                <HardHat size={14} /> Full Workflow Track
              </h3>

              <div className="space-y-1">
                <StepCard
                  title="Step 1: Engineer Assignment"
                  icon={HardHat}
                  color="bg-blue-500"
                  isCompleted={!!complaint.step1_assignEngineer?.actualTime}
                >
                  <InfoRow
                    icon={User}
                    label="Engineer"
                    value={complaint.step1_assignEngineer?.engineer}
                  />
                  <InfoRow
                    icon={CheckCircle2}
                    label="Status"
                    value={complaint.step1_assignEngineer?.status}
                  />
                  <InfoRow
                    icon={Users}
                    label="Division"
                    value={complaint.step1_assignEngineer?.division}
                  />
                  <InfoRow
                    icon={Hash}
                    label="ISO No"
                    value={complaint.step1_assignEngineer?.assignedIsoNo}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Assigned At"
                    value={complaint.step1_assignEngineer?.actualTime
                      ?.toDate()
                      ?.toLocaleString()}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Follow Up Date"
                    value={complaint.step1_assignEngineer?.nextFollowUpDate
                      ?.toDate()
                      ?.toLocaleDateString()}
                  />
                </StepCard>

                <StepCard
                  title="Step 2: Warranty Verification"
                  icon={Shield}
                  color="bg-indigo-500"
                  isCompleted={!!complaint.step2_warrantyCheck?.actualTime}
                >
                  <InfoRow
                    icon={Shield}
                    label="Warranty Status"
                    value={complaint.step2_warrantyCheck?.warrantyStatus}
                  />

                  <InfoRow
                    icon={CheckCircle2}
                    label="Enquiry Form"
                    value={
                      complaint.step2_warrantyCheck?.enquiryFormFilled
                        ? "Filled"
                        : "Not Filled"
                    }
                  />
                  <InfoRow
                    icon={CheckCircle2}
                    label="Status"
                    value={complaint.step3_siteVisit?.status}
                  />
                  <InfoRow
                    icon={CheckCircle2}
                    label="Offer Sent"
                    value={
                      complaint.step2_warrantyCheck?.offerSent ? "Yes" : "No"
                    }
                  />

                  <InfoRow
                    icon={Calendar}
                    label="Verified At"
                    value={complaint.step2_warrantyCheck?.actualTime
                      ?.toDate()
                      ?.toLocaleString()}
                  />

                  <InfoRow
                    icon={Calendar}
                    label="Follow Up Date"
                    value={complaint.step2_warrantyCheck?.nextFollowUpDate
                      ?.toDate()
                      ?.toLocaleString()}
                  />
                </StepCard>

                <StepCard
                  title="Step 3: Site Visit"
                  icon={Search}
                  color="bg-amber-500"
                  isCompleted={!!complaint.step3_siteVisit?.actualTime}
                >
                  <InfoRow
                    icon={CheckCircle2}
                    label="Status"
                    value={complaint.step3_siteVisit?.status}
                  />

                  <InfoRow
                    icon={Calendar}
                    label="Visited At"
                    value={complaint.step3_siteVisit?.actualTime
                      ?.toDate()
                      ?.toLocaleString()}
                  />

                  <InfoRow
                    icon={Calendar}
                    label="Next Follow Up"
                    value={complaint.step3_siteVisit?.nextFollowUpDate
                      ?.toDate()
                      ?.toLocaleDateString()}
                  />

                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Remarks
                    </p>
                    <p className="text-xs italic text-gray-700">
                      "{complaint.step3_siteVisit?.remarks || "N/A"}"
                    </p>
                  </div>
                </StepCard>

                <StepCard
                  title="Step 4: Material / Consumable Requirement"
                  icon={Truck}
                  color="bg-purple-500"
                  isCompleted={!!complaint.step4_consumable?.actualTime}
                >
                  <InfoRow
                    icon={Package}
                    label="Consumable Required"
                    value={
                      complaint.step4_consumable?.consumableRequired
                        ? "Yes"
                        : "No"
                    }
                  />

                  <InfoRow
                    icon={Calendar}
                    label="Next Follow Up"
                    value={complaint.step4_consumable?.nextFollowUpDate
                      ?.toDate()
                      ?.toLocaleDateString()}
                  />

                  <InfoRow
                    icon={Calendar}
                    label="Updated At"
                    value={complaint.step4_consumable?.actualTime
                      ?.toDate()
                      ?.toLocaleString()}
                  />

                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Remarks
                    </p>
                    <p className="text-xs italic text-gray-700">
                      "{complaint.step4_consumable?.remarks || "N/A"}"
                    </p>
                  </div>
                </StepCard>

                <StepCard
                  title="Step 5: Payment Collection"
                  icon={CreditCard}
                  color="bg-pink-500"
                  isCompleted={!!complaint.step5_payment?.actualTime}
                >
                  <InfoRow
                    icon={CreditCard}
                    label="Payment Collected"
                    value={
                      complaint.step5_payment?.paymentCollected ? "Yes" : "No"
                    }
                  />

                  <InfoRow
                    icon={Calendar}
                    label="Next Follow Up"
                    value={complaint.step5_payment?.nextFollowUpDate
                      ?.toDate()
                      ?.toLocaleDateString()}
                  />

                  <InfoRow
                    icon={Calendar}
                    label="Updated At"
                    value={complaint.step5_payment?.actualTime
                      ?.toDate()
                      ?.toLocaleString()}
                  />

                  <InfoRow
                    icon={CreditCard}
                    label="Receipt File"
                    value={complaint.step5_payment?.supportDocMeta?.fileName}
                  />

                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Payment Remarks
                    </p>
                    <p className="text-xs italic text-gray-700">
                      "{complaint.step5_payment?.remarks || "N/A"}"
                    </p>
                  </div>
                </StepCard>

                <StepCard
                  title="Step 6: Final Resolution"
                  icon={CheckCircle2}
                  color="bg-emerald-500"
                  isCompleted={!!complaint.step6_completion?.actualTime}
                >
                  <InfoRow
                    icon={CheckCircle2}
                    label="Final Status"
                    value={complaint.step6_completion?.status}
                  />

                  <InfoRow
                    icon={Calendar}
                    label="Closed At"
                    value={complaint.step6_completion?.actualTime
                      ?.toDate()
                      ?.toLocaleString()}
                  />

                  <InfoRow
                    icon={Package}
                    label="Final Report"
                    value={complaint.step6_completion?.siteUploadMeta?.fileName}
                  />

                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Completion Remarks
                    </p>
                    <p className="text-xs italic text-gray-700">
                      "{complaint.step6_completion?.remarks || "N/A"}"
                    </p>
                  </div>
                </StepCard>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 flex justify-end border-t shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
