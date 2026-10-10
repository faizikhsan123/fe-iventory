// KRA performance review (sesuai form PT Vando Teknik Solusi)
export const KRA = {
  safety: {
    label: "Safety",
    items: [
      "Zero Fatality",
      "Zero Accident",
      "Zero mobile Violance",
      "Completed all mandatory training within year",
      "Completed annual MCU",
      "Maintain tideness workshop & work area",
      "Following applicable SOP and JSA",
      "Dispose waste B3 in appropriate placed",
      "Maintain PPE",
      "Using PPE with appropriate procedure",
    ],
  },
  production: {
    label: "Production (Operation)",
    items: [
      "Maintain availibility equipment +95%",
      "Response to trouble < 15 minutes",
      "Maintain backlog < 10%",
      "Maintain all documents callibration in proper way",
      "Following all skill & knowledge training (provided by company)",
      "Maintain communication with all related department in daily",
      "Maintain and inspect tools frequently and in proper way",
      "Record all task given to the technician",
      "100% Attendance",
      "Actively inform with Spv & Planner to ensure availbility of critical spare parts",
      "Following up unfinished trouble from previoulsy shift",
    ],
  },
  cost: {
    label: "Cost",
    items: [
      "Replacement parts refer to maintenance plan schedule",
      "Maintain Tools",
      "Maintain cleanliness all instrument equipment",
    ],
  },
} as const;

export type KraKey = keyof typeof KRA;
export const KRA_KEYS = Object.keys(KRA) as KraKey[];

export const SCORE_REFERENCE: Record<number, string> = {
  1: "Poor Performance",
  2: "Below Normal Performance",
  3: "Normal Performance",
  4: "Above Performance",
  5: "Excellent",
};

export const average = (values: number[]) =>
  values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : 0;
