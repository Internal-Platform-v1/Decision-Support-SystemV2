// Static correction-code lookup used by the automatic output generator.
// Exact code selection is conservative; unmatched scenarios are sent for guide review.
window.CORRECTION_CODE_REFERENCE = [
  { terms: ["weight"], code: "YEAR" },
  { terms: ["service type"], code: "EPDC" },
  { terms: ["reference number", "pro"], code: "EREF" },
  { terms: ["accessorial"], code: "ACC" },
  { terms: ["pricing"], code: "PRCE" },
  { terms: ["account code", "account no", "account number"], code: "ECD" },
  { terms: ["terms"], code: "CAE" },
  { terms: ["debtor"], code: "ECD" },
  { terms: ["class", "nmfc"], code: "NACC" },
  { terms: ["description"], code: "EACC" },
  { terms: ["handling unit"], code: "EHUN" }
];
