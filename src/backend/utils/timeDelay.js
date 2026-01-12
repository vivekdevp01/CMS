export const getTimeDelay = (plannedTime, actualTime) => {
  if (!plannedTime || !actualTime) return "—";

  const diffMs = actualTime.toDate() - plannedTime.toDate();

  if (diffMs <= 0) return "0h"; // completed on time or early

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  return diffDays > 0 ? `${diffDays}d ${diffHours % 24}h` : `${diffHours}h`;
};

export const getTimeDelayByStep = (complaint) => {
  const stepMap = {
    1: complaint.step1_assignEngineer,
    2: complaint.step2_warrantyCheck,
    3: complaint.step3_siteVisit,
    4: complaint.step4_consumable,
    5: complaint.step5_payment,
    6: complaint.step6_completion,
  };

  const step = stepMap[complaint.currentStep];
  return getTimeDelay(step?.plannedTime, step?.actualTime);
};
