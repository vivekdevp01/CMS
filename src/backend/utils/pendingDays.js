export const getPendingDays = (nextFollowUpDate) => {
  if (!nextFollowUpDate) return "—";

  const today = new Date();
  const followUp = nextFollowUpDate.toDate(); // Firestore Timestamp → Date

  const diffMs = followUp - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};
// export const getPendingDaysByStep = (complaint) => {
//   switch (complaint.currentStep) {
//     case 1:
//       return getPendingDays(complaint.step1_assignEngineer?.nextFollowUpDate);
//     case 2:
//       return getPendingDays(complaint.step2_warrantyCheck?.nextFollowUpDate);
//     case 3:
//       return getPendingDays(complaint.step3_siteVisit?.nextFollowUpDate);
//     case 4:
//       return getPendingDays(complaint.step4_consumable?.nextFollowUpDate);
//     case 5:
//       return getPendingDays(complaint.step5_payment?.nextFollowUpDate);
//     case 6:
//       return "—"; // No follow-up in completion step
//     default:
//       return "—";
//   }
// };
// export const getPendingDaysByStep = (complaint) => {
//   const stepMap = {
//     1: complaint.step1_assignEngineer,
//     2: complaint.step2_warrantyCheck,
//     3: complaint.step3_siteVisit,
//     4: complaint.step4_consumable,
//     5: complaint.step5_payment,
//     6: complaint.step6_completion,
//   };

//   return getPendingDays(stepMap[complaint.currentStep]?.nextFollowUpDate);
// };
export const getPendingDaysByStep = (complaint) => {
  if (!complaint) return "—";

  const stepMap = {
    1: complaint.step1_assignEngineer,
    2: complaint.step2_warrantyCheck,
    3: complaint.step3_siteVisit,
    4: complaint.step4_consumable,
    5: complaint.step5_payment,
    6: complaint.step6_completion,
  };

  return getPendingDays(stepMap[complaint.currentStep]?.nextFollowUpDate);
};
export const getStepState = (currentStep, stepNumber) => {
  if (currentStep > stepNumber) return "COMPLETED";
  if (currentStep === stepNumber) return "ACTIVE";
  return "PENDING";
};
