import React, { useState, useEffect } from "react";
import { X, Lock, Check } from "lucide-react";
import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";
import { Step3Form } from "./Step3Form";
import { Step4Form } from "./Step4Form";
import { Step5Form } from "./Step5Form";
import { Step6Form } from "./Step6Form";
import toast from "react-hot-toast";

export const ComplaintUpdateModal = ({ complaint, onClose }) => {
  const [stepIndex, setStepIndex] = useState(1);

  useEffect(() => {
    if (complaint?.currentStep && typeof complaint.currentStep === "number") {
      setStepIndex(complaint.currentStep);
    }
  }, [complaint]);

  const handleStepSave = (nextStep) => {
    // Logic to move forward only
    setStepIndex(nextStep);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
        {/* FIXED HEADER */}
        <div className="bg-gradient-to-r from-[#f472b6] to-[#fb7185] px-5 py-4 flex justify-between items-center text-white shrink-0">
          <div>
            <h3 className="text-lg font-bold">Update Complaint</h3>
            <p className="text-[10px] opacity-90 leading-tight">
              Step by Step Update
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 transition rounded-full p-1"
          >
            <X size={22} strokeWidth={3} />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {/* COMPLAINT BASIC DETAILS */}
          <div className="bg-slate-50 p-3 rounded-lg text-sm space-y-1 border border-slate-200 text-slate-700">
            <p>
              <strong>Complaint ID:</strong> {complaint?.id || "—"}
            </p>
            <p>
              <strong>Customer:</strong>{" "}
              {complaint?.complaintDetails?.name || "—"}
            </p>
            <p>
              <strong>Product:</strong>{" "}
              {complaint?.complaintDetails?.product || "—"}
            </p>
            <p>
              <strong>Workflow Status:</strong> Step {stepIndex} of 6
            </p>
          </div>

          {/* STEP TABS: Strict Sequential Logic with Icons */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => {
              const isActive = stepIndex === i;
              const isPast = i < stepIndex;
              const isFuture = i > stepIndex;

              return (
                <button
                  key={i}
                  disabled={!isActive} // Only the current step is clickable
                  onClick={() => setStepIndex(i)}
                  className={`px-3 py-1.5 rounded text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
                    isActive
                      ? "bg-amber-600 text-white border-amber-600 ring-2 ring-amber-600/20"
                      : isPast
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 opacity-80 cursor-not-allowed"
                      : "bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed"
                  }`}
                >
                  {isPast && (
                    <Check
                      size={12}
                      strokeWidth={3}
                      className="text-emerald-600"
                    />
                  )}
                  {isFuture && <Lock size={10} />}
                  Step {i}
                </button>
              );
            })}
          </div>

          {/* FORM AREA */}
          <div className="mt-6">
            {stepIndex === 1 && (
              <Step1Form
                complaint={complaint}
                onSuccess={() => handleStepSave(2)}
              />
            )}
            {stepIndex === 2 && (
              <Step2Form
                complaint={complaint}
                onSuccess={() => handleStepSave(3)}
              />
            )}
            {stepIndex === 3 && (
              <Step3Form
                complaint={complaint}
                onSuccess={() => handleStepSave(4)}
              />
            )}
            {stepIndex === 4 && (
              <Step4Form
                complaint={complaint}
                onSuccess={() => handleStepSave(5)}
              />
            )}
            {stepIndex === 5 && (
              <Step5Form
                complaint={complaint}
                onSuccess={() => handleStepSave(6)}
              />
            )}
            {stepIndex === 6 && (
              <Step6Form
                complaint={complaint}
                onSuccess={() =>
                  toast.success("Workflow completed successfully 🎉")
                }
              />
            )}
          </div>
        </div>

        {/* FIXED FOOTER */}
        <div className="flex justify-end gap-3 p-4 border-t bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintUpdateModal;
