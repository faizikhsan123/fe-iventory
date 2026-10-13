// Nilai API tetap "active" / "inactive"; hanya tampilan "inactive" yang diberi label "Deactive".
export const EMPLOYEE_STATUS_LABEL: Record<string, string> = {
  active: "Active",
  inactive: "Deactive",
};

export const employeeStatusLabel = (status?: string | null) =>
  status ? (EMPLOYEE_STATUS_LABEL[status.toLowerCase()] ?? status) : "-";
