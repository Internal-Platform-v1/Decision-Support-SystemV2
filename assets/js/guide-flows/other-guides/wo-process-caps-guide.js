/* =========================================================
   WRITE-OFF IN CAPS — STEP BY STEP PROCEDURE GUIDE
   FLOW CONFIG + NODES (14 steps)
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "wo-process-caps-guide",
  title: "Write-off in CAPS — Step by Step Procedure",
  startNode: "start",
  templateCollection: "wo_process_caps_guide_template"
};

const IMG_BASE = "guides/Other%20Guides/wo-process-caps-guide/images/";

window.GUIDE_NODES = {

  start: {
    text: "Write-off in CAPS — Step by Step Procedure",
    help: "Process write-offs in CAPS from Business Unit selection and PRO entry through comments, responses, and case closure.",
    note: "14 steps. Follow each step in order and click Continue when the step is complete.",
    choices: [
      {
        label: "Start Step 1",
        next: "step_01",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Write-off in CAPS workflow."
      }
    ]
  },

  /* ---------- STEP 1 ---------- */
  step_01: {
    text: "Step 1 — Select Business Unit",
    help: "From CAPS, select the correct Business Unit.",
    noteHtml: `
      <p>From CAPS, select <strong>ARFW</strong> or <strong>FXFC</strong> as the Business Unit depending on the invoice debtor BU.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}wo-in-caps1.png" alt="Step 1" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_02", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 2." }
    ]
  },

  /* ---------- STEP 2 ---------- */
  step_02: {
    text: "Step 2 — Navigate to Write-Off",
    help: "Under System, select Write-Off.",
    noteHtml: `
      <p>Under <strong>System</strong>, select <strong>Write-Off</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}wo-in-caps2.png" alt="Step 2" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_03", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 3." }
    ]
  },

  /* ---------- STEP 3 ---------- */
  step_03: {
    text: "Step 3 — Request Write-Off",
    help: "Under Menu, click Request Write-Off.",
    noteHtml: `
      <p>Under <strong>Menu</strong>, click <strong>Request Write-Off</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}wo-in-caps3.png" alt="Step 3" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_04", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 4." }
    ]
  },

  /* ---------- STEP 4 ---------- */
  step_04: {
    text: "Step 4 — Select Application",
    help: "Under Application, select By Pro With List.",
    noteHtml: `
      <p>Under <strong>Application</strong>, select <strong>By Pro With List</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}wo-in-caps4.png" alt="Step 4" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_05", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 5." }
    ]
  },

  /* ---------- STEP 5 ---------- */
  step_05: {
    text: "Step 5 — Add by PRO",
    help: "Click the Add by PRO (+) icon.",
    noteHtml: `
      <p>Click <strong>Add by PRO (+)</strong> icon.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}wo-in-caps5.png" alt="Step 5" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_06", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 6." }
    ]
  },

  /* ---------- STEP 6 ---------- */
  step_06: {
    text: "Step 6 — Enter PRO Number",
    help: "Enter the PRO number and press TAB to auto-populate the amount.",
    noteHtml: `
      <p>Enter the <strong>PRO number</strong>, press <strong>TAB</strong>. This will auto-populate the amount.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}wo-in-caps6.png" alt="Step 6" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_07", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 7." }
    ]
  },

  /* ---------- STEP 7 ---------- */
  step_07: {
    text: "Step 7 — Enter Reason Code",
    help: "Enter the Reason Code based on the reason for the write-off.",
    noteHtml: `
      <p>Enter the <strong>Reason Code</strong> based on the reason why you are writing off the PRO.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}wo-in-caps7.png" alt="Step 7" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_08", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 8." }
    ]
  },

  /* ---------- STEP 8 ---------- */
  step_08: {
    text: "Step 8 — Enter Requestor ID",
    help: "Enter the Affected Employee ID from Shine.",
    noteHtml: `
      <p>Enter <strong>Affected Employee ID</strong> that you will see in Shine in the <strong>Requestor ID</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}wo-in-caps8.png" alt="Step 8" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_09", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 9." }
    ]
  },

  /* ---------- STEP 9 ---------- */
  step_09: {
    text: "Step 9 — Enter Approver ID",
    help: "Enter the Approver ID below.",
    noteHtml: `
      <p>Enter below for <strong>Approver ID</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}wo-in-caps9.png" alt="Step 9" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_10", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 10." }
    ]
  },

  /* ---------- STEP 10 ---------- */
  step_10: {
    text: "Step 10 — Submit Entry",
    help: "Click ENTER to submit the entry.",
    noteHtml: `
      <p>Click <strong>ENTER</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}wo-in-caps10.png" alt="Step 10" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_11", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 11." }
    ]
  },

  /* ---------- STEP 11 ---------- */
  step_11: {
    text: "Step 11 — Add FBC Comment",
    help: "Put a comment in FBC and in the account using the provided template.",
    noteHtml: `
      <p>Put comment in <strong>FBC</strong> and in the <strong>account</strong> using the template below:</p>
      <pre style="white-space:pre-wrap; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; margin-top:10px; font-size:12.5px;">CN: (CASE#) ID: (FXF EMP ID) woff approved for (accessorial/other reason) due to total sat for one time courtesy total woff $00.00 1 total pro/s xxxxxx</pre>
      <p style="margin-top:12px;"><strong>SAMPLE:</strong></p>
      <pre style="white-space:pre-wrap; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; margin-top:6px; font-size:12.5px;">CN: 26680686 ID: 3868597 woff approved for inside delivery due to total sat for one time courtesy total woff $496.46 1 total PRO 8312975801.</pre>`,
    choices: [
      { label: "Continue", next: "step_12", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 12." }
    ]
  },

  /* ---------- STEP 12 ---------- */
  step_12: {
    text: "Step 12 — Respond to Sales Rep",
    help: "Respond to the Sales Rep using the provided template.",
    noteHtml: `
      <p>RESPOND TO THE SALES REP USING THE TEMPLATE BELOW:</p>
      <pre style="white-space:pre-wrap; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; margin-top:10px; font-size:12.5px;">Case Number:
Customer Number:
Customer Name:
Pro count:
Pro number:
Write off amount:

This request was approved as a One-Time Courtesy due to xxxxxx, which means we will not approve another write off for this same reason for this customer in the future.

A note has been added at account level. Please advise the customer this is a onetime courtesy.
Thank you.

The write off request attachment has been approved and processed today.
The system will update tonight and you will be able to view the write off on the Freight Bill Inquiry screen tomorrow morning.

If there is still an open balance left on the invoice a new statement will be sent to the customer with the new balance due.

Imaging,
Please image email for write off.

Thank you,
(Your Name)</pre>`,
    choices: [
      { label: "Continue", next: "step_13", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 13." }
    ]
  },

  /* ---------- STEP 13 ---------- */
  step_13: {
    text: "Step 13 — Email Write-Off Team",
    help: "Send the same template to the write-off imaging team.",
    noteHtml: `
      <p>Send the same template to <strong>imagewriteoffs@fedexfreight.com</strong>.</p>
      <p style="margin-top:8px;"><strong>Note:</strong> No need to fill out a write-off form.</p>`,
    choices: [
      { label: "Continue", next: "step_14", icon: "fa-solid fa-arrow-right", desc: "Proceed to final step." }
    ]
  },

  /* ---------- STEP 14 (FINAL) ---------- */
  step_14: {
    text: "Step 14 — Close the Case",
    help: "Update status, disposition, case count, and WO amount.",
    noteHtml: `
      <p>After you send the email, change your:</p>
      <ul style="margin:8px 0 0 18px;">
        <li>Status to <strong>"CLOSED"</strong></li>
        <li>Disposition to <strong>"APPROVED"</strong></li>
        <li>Update <strong>"CASE COUNT"</strong> and <strong>"WO AMT"</strong> to how many PROs were on this request.</li>
      </ul>`,
    choices: []
  }

};
