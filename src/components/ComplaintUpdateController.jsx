import React, { useEffect } from "react";
import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";
import { Step3Form } from "./Step3Form";
import { Step4Form } from "./Step4Form";
import { Step5Form } from "./Step5Form";
import { Step6Form } from "./Step6Form";
import toast from "react-hot-toast";

/**
 * Props expected:
 * ------------------------------------
 * complaint  -> Firestore complaint document (live / refreshed)
 * onClose    -> function to close modal
 * onRefresh  -> function to refetch complaint data (or re-trigger snapshot)
 */
export const ComplaintUpdateController = ({
  complaint,
  onClose,
  onRefresh,
}) => {
  if (!complaint) return null;

  const activeStep = Number(complaint.currentStep) || 1;
  const isClosed = complaint.isClosed === true;

  /**
   * Called AFTER any step is successfully saved
   * We DO NOT close here directly
   * We refresh data and let Firestore decide next UI state
   */
  const handleSuccess = () => {
    onRefresh?.();
  };

  /**
   * 🔒 Auto-close modal once Firestore confirms closure
   * This avoids stale prop problems
   */
  useEffect(() => {
    if (isClosed) {
      toast.success("Workflow completed successfully 🎉");
      onClose?.();
    }
  }, [isClosed, onClose]);

  /**
   * 🔒 Hard UI lock (extra safety)
   * In case modal stays open briefly during refresh
   */
  if (isClosed) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
          <h2 className="text-xl font-black text-slate-800 mb-2">
            Workflow Completed
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            This complaint has been closed and cannot be edited.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  /**
   * 🟢 ACTIVE WORKFLOW
   * Exactly ONE step visible at a time
   */
  return (
    <>
      {activeStep === 1 && (
        <Step1Form complaint={complaint} onSuccess={handleSuccess} />
      )}

      {activeStep === 2 && (
        <Step2Form complaint={complaint} onSuccess={handleSuccess} />
      )}

      {activeStep === 3 && (
        <Step3Form complaint={complaint} onSuccess={handleSuccess} />
      )}

      {activeStep === 4 && (
        <Step4Form complaint={complaint} onSuccess={handleSuccess} />
      )}

      {activeStep === 5 && (
        <Step5Form complaint={complaint} onSuccess={handleSuccess} />
      )}

      {activeStep === 6 && (
        <Step6Form complaint={complaint} onSuccess={handleSuccess} />
      )}
    </>
  );
};

export default ComplaintUpdateController;
