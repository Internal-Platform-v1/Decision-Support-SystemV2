/* =========================================================
   ISPI — MASS ADJUSTMENT GUIDE — FLOW CONFIG + NODES
   Step-by-step walkthrough (24 steps) loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "ispi-guide",
  title: "ISPI — Mass Adjustment Guide",
  startNode: "start",
  templateCollection: "ispi_guide_template"
};

const IMG_BASE = "guides/Other%20Guides/ispi-guide/images/";

window.GUIDE_NODES = {

  start: {
    text: "ISPI — Mass Adjustment Guide",
    help: "Process mass adjustments in iSPI from PRO entry and account changes through approval checks, comments, and final processing.",
    note: "24 steps. Follow each step in order and click Continue when the step is complete.",
    choices: [
      {
        label: "Start Step 1",
        next: "step_01",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the iSPI Mass Adjustment workflow."
      }
    ]
  },

  /* ---------- STEP 1 ---------- */
  step_01: {
    text: "Step 1 — iSPI for Mass Adjustments",
    help: "Review the reminder before starting.",
    noteHtml: `
      <p><strong>REMINDER:</strong> Review the following image before starting the mass adjustment process.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image1.png" alt="Step 1" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_02", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 2." }
    ]
  },

  /* ---------- STEP 2 ---------- */
  step_02: {
    text: "Step 2 — Open ISPI using the FedEx Sharepoint",
    help: "Open iSPI from the FedEx Sharepoint.",
    noteHtml: `
      <p>Open ISPI using the FedEx Sharepoint.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image2.png" alt="Step 2" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_03", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 3." }
    ]
  },

  /* ---------- STEP 3 ---------- */
  step_03: {
    text: "Step 3 — iSPI Main Page Appears",
    help: "Confirm the iSPI main page loaded.",
    noteHtml: `
      <p>iSPI Main Page Appears.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image3.png" alt="Step 3" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_04", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 4." }
    ]
  },

  /* ---------- STEP 4 ---------- */
  step_04: {
    text: "Step 4 — Click Adjustment (Wrench icon)",
    help: "Click the Adjustment wrench icon.",
    noteHtml: `
      <p>Click the <strong>Adjustment</strong> (Wrench icon).</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image4.png" alt="Step 4" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_05", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 5." }
    ]
  },

  /* ---------- STEP 5 ---------- */
  step_05: {
    text: "Step 5 — Click Mass Adjustment",
    help: "Click Mass Adjustment.",
    noteHtml: `
      <p>Click <strong>Mass Adjustment</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image5.png" alt="Step 5" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_06", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 6." }
    ]
  },

  /* ---------- STEP 6 ---------- */
  step_06: {
    text: "Step 6 — Enter Tracking Numbers Box Appears",
    help: "A new box will appear to enter tracking numbers.",
    noteHtml: `
      <p>New <em>Enter Tracking Numbers to be Loaded (1 Tracking Number per line)</em> box will appear.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image6.png" alt="Step 6" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_07", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 7." }
    ]
  },

  /* ---------- STEP 7 ---------- */
  step_07: {
    text: "Step 7 — Type or Paste UP TO 500 PROs",
    help: "Enter up to 500 PROs and click Continue.",
    noteHtml: `
      <p>Type or paste <strong>UP TO 500 PROs</strong> for Mass Adjustment in the box. When PROs are entered, a Continue button will appear. Click <strong>Continue</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image7.png" alt="Step 7" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_08", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 8." }
    ]
  },

  /* ---------- STEP 8 ---------- */
  step_08: {
    text: "Step 8 — The Below Screen Will Populate",
    help: "The screen will populate with the entered PROs.",
    noteHtml: `
      <p>The below screen will populate with the entered PROs.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image8.png" alt="Step 8" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_09", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 9." }
    ]
  },

  /* ---------- STEP 9 ---------- */
  step_09: {
    text: "Step 9 — Remove RED (Invalid Tracking Number) PROs",
    help: "Scroll down and remove PROs highlighted in RED.",
    noteHtml: `
      <p>Scroll down. Any PROs that are highlighted in <strong style="color:#dc2626;">RED</strong> stating <em>Invalid Tracking Number</em> will need to be written down for Manual Update in FBC. Remove these PROs from iSPI by clicking the <strong>Red Minus Button</strong> to the left of the highlighted PRO number.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image9.png" alt="Step 9" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_10", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 10." }
    ]
  },

  /* ---------- STEP 10 ---------- */
  step_10: {
    text: "Step 10 — Scroll to Bottom and Click Account",
    help: "Scroll to the bottom and click Account.",
    noteHtml: `
      <p>Scroll to the bottom of the iSPI form and click <strong>"Account"</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image10.png" alt="Step 10" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_11", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 11." }
    ]
  },

  /* ---------- STEP 11 ---------- */
  step_11: {
    text: "Step 11 — Enter Account Numbers",
    help: "Enter account numbers in applicable fields.",
    noteHtml: `
      <p>Enter Account Numbers in Applicable Fields.</p>
      <p style="margin-top:8px;"><strong>NOTE:</strong> If the account number is invalid, try removing the zeros from the front of it.</p>`,
    choices: [
      { label: "Continue", next: "step_12", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 12." }
    ]
  },

  /* ---------- STEP 12 ---------- */
  step_12: {
    text: "Step 12 — Both Accounts are Shipper/Consignee",
    help: "Enter both accounts in the Shipper/Consignee boxes.",
    noteHtml: `
      <p>If the <strong>"Current Account"</strong> and <strong>"New Account"</strong> are both Shipper/Consignee accounts, enter in <strong>Shipper/Consignee boxes</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image11.png" alt="Step 12" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_13", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 13." }
    ]
  },

  /* ---------- STEP 13 ---------- */
  step_13: {
    text: "Step 13 — Current is S/C and New is Bill-To",
    help: "Click Multiple Current Accounts and enter the Bill-To account number.",
    noteHtml: `
      <p>If the <strong>"Current Account"</strong> is a Shipper/Consignee account AND <strong>"New Account"</strong> is a Bill-To Account, click <strong>"Multiple Current Accounts"</strong> field and enter the Bill-To account number.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image12.png" alt="Step 13" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_14", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 14." }
    ]
  },

  /* ---------- STEP 14 ---------- */
  step_14: {
    text: "Step 14 — Enter Account Numbers",
    help: "Enter account numbers in applicable fields.",
    noteHtml: `
      <p>Enter Account Numbers in Applicable Fields.</p>
      <p style="margin-top:8px;"><strong>NOTE:</strong> If the account number is invalid, try removing the zeros from the front of it.</p>`,
    choices: [
      { label: "Continue", next: "step_15", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 15." }
    ]
  },

  /* ---------- STEP 15 ---------- */
  step_15: {
    text: "Step 15 — Continue Button Will Appear",
    help: "After entering account numbers, click Continue.",
    noteHtml: `
      <p>Next, the Continue Button Will Appear.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image13.png" alt="Step 15" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_16", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 16." }
    ]
  },

  /* ---------- STEP 16 ---------- */
  step_16: {
    text: "Step 16 — Export to Excel for Flagged PROs",
    help: "Export flagged PROs to Excel for later individual update in FBC.",
    noteHtml: `
      <p>For those PROs, click <strong>Export to Excel</strong> and set aside for after completing the Mass Adjustment. You will need to update these PROs individually in Freight Bill Corrections.</p>
      <p style="margin-top:8px;"><strong>NOTE:</strong> If any PROs cannot be updated via iSPI, they will appear with a red square around them. Examples: A0 PROs, PROs with 6-digit center codes.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image14.png" alt="Step 16" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_17", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 17." }
    ]
  },

  /* ---------- STEP 17 ---------- */
  step_17: {
    text: "Step 17 — Click Continue on iSPI Screen",
    help: "Click Continue on the iSPI screen.",
    noteHtml: `
      <p>On the iSPI Screen, click <strong>Continue</strong>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image15.png" alt="Step 17" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_18", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 18." }
    ]
  },

  /* ---------- STEP 18 ---------- */
  step_18: {
    text: "Step 18 — Check the Total Adjustment Amount",
    help: "Confirm the Total Adjustment Amount does not exceed the approval limit.",
    noteHtml: `
      <p>Check the <strong>"Total Adjustment Amount"</strong> to make sure it does not exceed <strong>$25,000</strong>.</p>
      <p style="margin-top:8px;">If the request is to rebill the PRO to another debtor per LOA, the Adjustment Limit for Approval is <strong>$100,000</strong>. If the adjustment is less than this amount, no approval is required. Proceed with the correction.</p>
      <p style="margin-top:8px;"><strong>NOTE:</strong> Numbers will be <span style="color:#16a34a;">GREEN for revenue increase</span>, <span style="color:#dc2626;">RED for revenue decrease</span>.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image16.png" alt="Step 18" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_19", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 19." }
    ]
  },

  /* ---------- STEP 19 ---------- */
  step_19: {
    text: "Step 19 — Over $25K? Stop and Submit Approval",
    help: "If the total exceeds $25,000, submit an approval request before proceeding.",
    noteHtml: `
      <p><strong>IF the Total EXCEEDS $25,000.00</strong>, stop here. You must submit an <em>Over $25K Approval Request</em> to Management and wait for approval before proceeding to complete the update.</p>
      <p style="margin-top:8px;"><strong>Exception:</strong> If the request is to rebill per LOA, the adjustment limit without approval is $100,000. If the adjustment amount does not reach that, proceed without approval.</p>`,
    choices: [
      { label: "Continue", next: "step_20", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 20." }
    ]
  },

  /* ---------- STEP 20 ---------- */
  step_20: {
    text: "Step 20 — Under $25K? Enter ACCR Reason Code",
    help: "Enter ACCR in the Reason Code box.",
    noteHtml: `
      <p><strong>IF the Total is UNDER $25,000.00</strong>, proceed to next step. Enter <strong>"ACCR"</strong> in the <strong>"Reason Code"</strong> box.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image17.png" alt="Step 20" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_21", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 21." }
    ]
  },

  /* ---------- STEP 21 ---------- */
  step_21: {
    text: "Step 21 — Enter Additional Comments",
    help: "Enter a relevant comment in the Enter Additional Comments box.",
    noteHtml: `
      <p>In the <strong>"Enter Additional Comments"</strong> box, enter a comment relevant to your update.</p>
      <p style="margin-top:8px;"><strong>Example:</strong> VS-MASS-(CASE#)-(# of pros being updated)-(Comment from the Mass Update Form -- VS-BACC-ACCT – CHGD BT TO ESTABLISHED ACCOUNT ######### --- VS-BLER-Case # - Updated BT per BOL)</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image18.png" alt="Step 21" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_22", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 22." }
    ]
  },

  /* ---------- STEP 22 ---------- */
  step_22: {
    text: "Step 22 — Click Process Button",
    help: "Click the Process button to submit the adjustment.",
    noteHtml: `
      <p>Click the <strong>Process</strong> button.</p>
      <div style="margin-top:12px;">
        <img src="${IMG_BASE}ispi-image19.png" alt="Step 22" style="max-width:100%; border-radius:10px;">
      </div>`,
    choices: [
      { label: "Continue", next: "step_23", icon: "fa-solid fa-arrow-right", desc: "Proceed to Step 23." }
    ]
  },

  /* ---------- STEP 23 ---------- */
  step_23: {
    text: "Step 23 — Allow Sufficient Time to Process",
    help: "Wait for iSPI to complete the mass adjustment.",
    noteHtml: `
      <p>Allow sufficient time for your Mass Adjustment to process in iSPI. Once it is complete, iSPI will populate a message that indicates it is complete.</p>`,
    choices: [
      { label: "Continue", next: "step_24", icon: "fa-solid fa-arrow-right", desc: "Proceed to final step." }
    ]
  },

  /* ---------- STEP 24 (FINAL) ---------- */
  step_24: {
    text: "Step 24 — Update Individual PROs in FBC",
    help: "Return to the exported file to update individual PROs in Freight Bill Corrections.",
    noteHtml: `
      <p>Once your Mass Adjustment is complete, return to your Exported File to update individual PROs if applicable in Freight Bill Corrections that were removed from the Shipment Research Report.</p>
      <p style="margin-top:8px;"><strong>Notes:</strong></p>
      <ul style="margin:6px 0 0 18px;">
        <li>If an error message is shown, export the file to Excel for specific error descriptions.</li>
        <li>Check the data to confirm all PROs are on the same terms.</li>
        <li>Perform a random check on some PROs to verify necessary information (e.g., if Shipper/Consignee has ABT).</li>
        <li>Make sure NO PRO is being accessed in FBC (iSPI will not perform the change for that PRO).</li>
      </ul>`,
    choices: []
  }

};
