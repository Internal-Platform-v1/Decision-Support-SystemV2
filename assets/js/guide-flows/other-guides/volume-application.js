/* =========================================================
   VOLUME APPLICATION GUIDE — FLOW CONFIG + NODES
   Step-by-step walkthrough (13 steps) loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "volume-application",
  title: "Volume Application Guide",
  startNode: "start",
  templateCollection: "volume_application_guide_template"
};

const IMG_BASE = "guides/Other%20Guides/volume-application/images/";

window.GUIDE_NODES = {

  start: {
    text: "Volume Application Guide",
    help: "Review, validate, and process volume application requests using the correct workflow.",
    note: "13 steps. Follow each step in order and click Continue when the step is complete.",
    choices: [
      {
        label: "Start Step 1",
        next: "step_01",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Volume Application workflow."
      }
    ]
  },

  /* ---------- STEP 1 ---------- */
  step_01: {
    text: "Step 1 — Adjust Freight Charges",
    help: "Change the rate line to FLAT and apply the volume quote amount.",
    noteHtml: `
      <p>On the freight charges line, change the rate line to <strong>FLAT</strong> and apply the volume quote amount in the charge line.</p>
      <div style="display:flex; flex-direction:column; gap:10px; margin-top:12px;">
        <img src="${IMG_BASE}Step1.jpg" alt="Step 1" style="max-width:100%; border-radius:10px;">
        <img src="${IMG_BASE}Step1v2.jpg" alt="Step 1 (v2)" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_02", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 2." }
    ]
  },

  /* ---------- STEP 2 ---------- */
  step_02: {
    text: "Step 2 — Remove Rate Keywords",
    help: "Remove all rate keywords listed in the step.",
    noteHtml: `
      <p>Remove all rate keywords:</p>
      <ul style="margin:6px 0 0 18px;">
        <li>FSCL</li>
        <li>DEWT</li>
        <li>RAZ</li>
        <li>LEDI</li>
        <li>PRAU</li>
        <li>BRAP</li>
      </ul>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}Step2.png" alt="Step 2" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_03", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 3." }
    ]
  },

  /* ---------- STEP 3 ---------- */
  step_03: {
    text: "Step 3 — Add RMK: CAPL NOT APPLICABLE PER TRUCKLOAD",
    help: "Add the RMK line and leave capacity load keywords in place.",
    noteHtml: `
      <ul style="margin:0 0 0 18px;">
        <li>Capacity load keywords do <strong>NOT</strong> need to be removed.</li>
        <li>Add RMK line stating: <em>"CAPL NOT APPLICABLE PER TRUCKLOAD."</em></li>
      </ul>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}Step3.png" alt="Step 3" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_04", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 4." }
    ]
  },

  /* ---------- STEP 4 ---------- */
  step_04: {
    text: "Step 4 — Zero Out Surcharges",
    help: "Zero out the listed surcharges.",
    noteHtml: `
      <p>Zero out any of the following surcharges:</p>
      <ul style="margin:6px 0 0 18px;">
        <li>VICH</li>
        <li>VWCH</li>
        <li>OVRL</li>
        <li>Extreme Length</li>
        <li>High Cost</li>
        <li>California Compliance Fee</li>
        <li>Demand Surcharge</li>
      </ul>
      <div style="display:flex; flex-direction:column; gap:10px; margin-top:12px;">
        <img src="${IMG_BASE}Step4.png" alt="Step 4" style="max-width:100%; border-radius:10px;">
        <img src="${IMG_BASE}Step4v2.png" alt="Step 4 (v2)" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_05", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 5." }
    ]
  },

  /* ---------- STEP 5 ---------- */
  step_05: {
    text: "Step 5 — Validate Additional Surcharges",
    help: "Check COMMENTS / ADDITIONAL SERVICES dropdown for included surcharges.",
    noteHtml: `
      <ul style="margin:0 0 0 18px;">
        <li>Check <strong>COMMENTS / ADDITIONAL SERVICES</strong> dropdown.</li>
        <li>If surcharges with checkmarks are the only ones included in the quote, remove surcharge on FBC.</li>
        <li>No checkmark = not included in quote.</li>
      </ul>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}Step5.jpg" alt="Step 5" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_06", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 6." }
    ]
  },

  /* ---------- STEP 6 ---------- */
  step_06: {
    text: "Step 6 — Add CONT Keyword",
    help: "Add the keyword CONT.",
    noteHtml: `
      <p>Add keyword <strong>"CONT"</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}Step6.png" alt="Step 6" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_07", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 7." }
    ]
  },

  /* ---------- STEP 7 ---------- */
  step_07: {
    text: "Step 7 — Add Full Quote Number into CONT Number Field",
    help: "Enter the full quote number and handle any prompts that appear.",
    noteHtml: `
      <ul style="margin:0 0 0 18px;">
        <li>Add full quote number into <strong>"CONT Number"</strong> field.</li>
        <li>If error appears, click <strong>OK</strong>.</li>
        <li>If <strong>"CM Option"</strong> dropdown appears, select service option noted on BOL (TLX, TLS, EXCL).</li>
        <li>If none is noted, choose <strong>TLX</strong>. Click <strong>OK</strong>.</li>
      </ul>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}Step7.jpg" alt="Step 7" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_08", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 8." }
    ]
  },

  /* ---------- STEP 8 ---------- */
  step_08: {
    text: "Step 8 — System Auto Adds Keywords",
    help: "After the system adds CONT and TLX, add SLCU and NOAR below.",
    noteHtml: `
      <p>System will automatically add:</p>
      <ul style="margin:6px 0 0 18px;">
        <li>CONT</li>
        <li>TLX</li>
      </ul>
      <p style="margin-top:8px;">Below this point, add:</p>
      <ul style="margin:6px 0 0 18px;">
        <li>SLCU</li>
        <li>NOAR</li>
      </ul>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}Step8.png" alt="Step 8" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_09", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 9." }
    ]
  },

  /* ---------- STEP 9 ---------- */
  step_09: {
    text: "Step 9 — Add PRAU & Agreement Details",
    help: "Add keyword PRAU below NOAR.",
    noteHtml: `
      <p>Below <strong>NOAR</strong>, add keyword <strong>PRAU</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}Step9.png" alt="Step 9" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_10", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 10." }
    ]
  },

  /* ---------- STEP 10 ---------- */
  step_10: {
    text: "Step 10 — Add PRAU & Agreement Details (Step 2)",
    help: "Fill in Agreement Type, Tariff, quote number, Base Type, and AP1.",
    noteHtml: `
      <ul style="margin:0 0 0 18px;">
        <li>In <strong>Agreement Type</strong> dropdown, choose <strong>"CONT"</strong>.</li>
        <li>In <strong>Tariff</strong> dropdown, choose service type from BOL (TLX, TLS, EXCL).</li>
        <li>Enter 7 numbers between F and CM in quote number.</li>
        <li>In <strong>Base Type</strong> dropdown, select <strong>"CUST"</strong>.</li>
        <li>In <strong>AP1</strong> dropdown, select who the PRO is billed to.</li>
        <li>Click <strong>OK</strong> when finished.</li>
      </ul>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}Step10.jpg" alt="Step 10" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_11", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 11." }
    ]
  },

  /* ---------- STEP 11 ---------- */
  step_11: {
    text: "Step 11 — Clean Description Field",
    help: "Delete all blank lines in the description field.",
    noteHtml: `
      <p>Delete all blank lines in the description field.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}Step11.jpg" alt="Step 11" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_12", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 12." }
    ]
  },

  /* ---------- STEP 12 ---------- */
  step_12: {
    text: "Step 12 — Add Correction Code",
    help: "Add the correction code that matches the reason.",
    noteHtml: `
      <p>Add correction code based on reason:</p>
      <ul style="margin:6px 0 0 18px;">
        <li><strong>EADL</strong> — Volume quote listed on BOL but biller did not bill.</li>
        <li><strong>SYSM</strong> — Volume quote noted but automation didn't recognize it.</li>
        <li><strong>CMID</strong> — Shipper/consignee/BT did not provide volume quote on BOL.</li>
      </ul>`,
    choices: [
      { label: "Continue", next: "step_13", icon: "fa-solid fa-arrow-right", desc: "Proceed to final step." }
    ]
  },

  /* ---------- STEP 13 (FINAL) ---------- */
  step_13: {
    text: "Step 13 — Final Step",
    help: "Click ACCEPT ALL to complete the volume application.",
    noteHtml: `
      <p>At last, click <strong>ACCEPT ALL</strong>.</p>`,
    choices: []
  }

};
