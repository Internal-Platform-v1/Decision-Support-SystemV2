/* =========================================================
   CHECKING EPRS — FLOW CONFIG + NODES
   Step-by-step guide. Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "checking-eprs",
  title: "Checking EPRS",
  startNode: "start",
  templateCollection: "checking_eprs_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Checking EPRS — Step-by-Step Guide",
    help: "Follow these steps to locate and validate an ePRS agreement, check agreement versions, and confirm the correct effective pricing and surcharge terms.",
    note: "Always rely on the Customer Signed Agreement. The typed effective date is not the actual effective date — the customer signature date is.",
    choices: [
      {
        label: "Continue",
        next: "step_open_solutionpoint",
        icon: "fa-solid fa-arrow-right",
        desc: "Start the Checking EPRS process."
      }
    ]
  },

  step_open_solutionpoint: {
    text: "Open SolutionPoint",
    help: "Using iSPI Browser/Citrix Browser, go to the SolutionPoint homepage\n\nhttps://fdx.highspot.com\n\nor access Direct Link\n\nhttps://myapps.secure.fedex.com/pricing/eprs",
    choices: [
      {
        label: "Continue",
        next: "step_click_pricing",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_click_pricing: {
    text: "Click Pricing",
    help: "Click on “Pricing” (same as to view a PRS agreement)",
    choices: [
      {
        label: "Continue",
        next: "step_agreement_type",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_agreement_type: {
    text: "Choose Agreement Type",
    help: "Choose between ePRS for ePRS Agreement or PRS Rerate for Tariff",
    choices: [
      {
        label: "Continue",
        next: "step_level_id",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_level_id: {
    text: "Select Level ID",
    help: "Click the Level ID in the Research Type dropdown menu",
    choices: [
      {
        label: "Continue",
        next: "step_search_options",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_search_options: {
    text: "Search Options",
    help: "(1st Option) - Using Country ID, Group or Subgroup ID\n\n- If you search by the Agreement Number shown on the freight bill, it is possible to pull the Dup Load version instead of the actual effective version.\n- ePRS agreements are not normally loaded at actual account code level, so searching an account code will not pull the agreement.\n- You must search the Hierarchy Level the pricing is loaded at.\n- If you have a proposal number, you can search the proposal number.\n- The recommended number is the Country Code.\n\nNOTE:\nIf no ePRS agreement is found and the one available doesn't provide helpful information using the Country Code, use Group Level Code or Sub-Group Level Code.",
    choices: [
      {
        label: "Continue",
        next: "step_start_searching",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_start_searching: {
    text: "Start Searching",
    help: "1. Once you have the correct level pricing loaded on, start searching for the agreement\n2. Change the Research Type: to Level ID\n3. Enter your Level number - Country Level code\n4. Click: Search / Find Next.",
    choices: [
      {
        label: "Continue",
        next: "step_agreement_versions",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_agreement_versions: {
    text: "Agreement Versions",
    help: "The ePRS screen will show the different versions of the agreement.\n\nThis screen will show the Freight pricing but also Ground and Express, all three can be included in “Combo” so you will have to open the Agreement to determine if Freight is included.\n\nMany files in this view may have never been implemented. Proposal Status “Pricing Implementation Complete” shows the agreement actually became effective.\n\nIf Pricing Implementation Complete is not available, you may review Proposal Status \"Request Archived\" or \"Verify Rates\".\n\nDup Loads will also show in the Proposal Status. This version was entered ONLY to assist Pricing in loading the agreement.\n\nDo NOT use the Dup Load version as this version may only have part of the agreement included.\n\n(10/14/2022) - DO NOT USE Dupe Load Successful agreement in verifying the Pricing exceptions of customers.\n\nThis type of agreement is only loaded for internal use – meaning an error occurred when pricing was loaded in the backend and a dupe agreement was created to correct it.",
    choices: [
      {
        label: "Continue",
        next: "step_version_logic",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_version_logic: {
    text: "Agreement Version Logic",
    help: "Version numbers are included in the agreement number, however, version numbers are not necessarily an indication of the order the agreements were effective.\n\nActual effective dates of the agreement version are based on when the customer signed the agreement, so if the customer signed version 102 after they signed 103, 102 is the current version.\n\nNOTE: Always select the agreement under the Customer Signed Agreement.\n\nIf Customer Signed Agreement is not available or doesn't include the surcharge, you may review Legal Modified Agreement (e.g. 08497324)",
    choices: [
      {
        label: "Continue",
        next: "step_search_by_agreement",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_search_by_agreement: {
    text: "Search Using Agreement Number",
    help: "(2nd Option) - Using the actual agreement number\n\nA second option to pull an ePRS agreement is by hovering over “Research” to review the drop down menu and clicking Research.\n\nThis is normally used when you are unable to find a specific agreement number",
    choices: [
      {
        label: "Continue",
        next: "step_search_procedure",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_search_procedure: {
    text: "Agreement Search Procedure",
    help: "1. Always update the Start Date at the bottom of the screen; if you do not update the date, your search will be very limited.\n2. Adjust the date first (go all the way to 2013/2014)\n3. Click the circle next to the option you are going to search (Select Agreement # to search)\n4. Enter the agreement number\n5. Click Search at the top",
    choices: [
      {
        label: "Continue",
        next: "step_important_notes",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_important_notes: {
    text: "Important Agreement Notes",
    help: "The typed effective date in the agreement is not when the agreement becomes effective, the date the customer signs the agreement is the effective date.\n\n- Current pricing can be affected by past versions of the agreement. For example, fuel surcharge and surcharge exceptions might pull from an older version published, but sales chose to keep those rules.\n- Wording in ePRS agreements are very specific. ePRS agreements are entered into the system by the system, so there is no Pricing Analyst to “interpret” what Sales intentions are.\n- ePRS agreements have hard cancel dates, while PRS and Contracts do not. You must pay attention to Term Dates.\n- Surcharge Exceptions and AMC charges are often shown as discount off.",
    choices: [
      {
        label: "Continue",
        next: "step_eprs_agreement",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_eprs_agreement: {
    text: "ePRS Agreement",
    help: "The Table of Contents at the top of the page list the different services the agreement is for.\n- The typed EFFECTIVE DATE is not valid.\n- The CUSTOMER SIGNATURE DATE is the correct effective date if it's LATER than the effective date\n\nNOTE: The later date is the actual effective date\n- Note the AMC Discount off",
    choices: [
      {
        label: "Continue",
        next: "step_surcharge_terms",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_surcharge_terms: {
    text: "ePRS Surcharge Terms",
    help: "This agreement was signed by the customer on 8/13/2018.",
    image: "guides/Pricing%20Guides/checking-eprs/images/snippet1.png",
    choices: [
      {
        label: "Continue",
        next: "step_surcharge_rules",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_surcharge_rules: {
    text: "Surcharge Term Rules",
    help: "The agreement includes Term 1 and Term 2 for the surcharge exceptions.\n\nTerm 1 is for the exceptions listed in the agreement. These surcharge exceptions will apply for the customer starting on 8/13/2018, but will end 12 months after that date.\n\nNOTE: If Term 1 start date is later than the customer signature date, Term 1 effective date is followed.\n\nTerm 2 does not have an end date. Per the notes under Term 2, FXF Rules will apply to all surcharges.",
    image: "guides/Pricing%20Guides/checking-eprs/images/snippet2.png",
    choices: [
      {
        label: "Continue",
        next: "step_us_export",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_us_export: {
    text: "US Export Pricing Example",
    help: "The pricing example below covers:\n\nUS Export Outbound prepaid (OP) shipping from Territory(US) to Geography(CA) with the 3P bill-to being a US Country (CY) Level.\n\nThird Party (3P) US Export from Territory(US) to Geography(CA) with the 3P bill-to being a US Country (CY) Level.",
    image: "guides/Pricing%20Guides/checking-eprs/images/snippet3.png",
    choices: [
      {
        label: "Continue",
        next: "step_us_import",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_us_import: {
    text: "US Import Pricing Example",
    help: "The pricing example below covers:\n\nUS Import Inbound Collect (IC) shipping from Geography (CA) to Territory (US) with the 3P bill-to being a US Country (CY) Level.\n\nThird Party (3P) US Import shipping from Geography (CA) to Territory (US) with the 3P bill-to being a US Country (CY) Level.",
    image: "guides/Pricing%20Guides/checking-eprs/images/snippet4.png",
    choices: [
      {
        label: "Continue",
        next: "step_ca_export",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_ca_export: {
    text: "CA Export Pricing Example",
    help: "The pricing example below covers:\n\nCA Export Outbound Prepaid (OP) shipping from Territory (CA) to Geography (US) the 3P bill-to being a CA Country (CY) Level.\n\nThird Party (3P) CA Export shipping from Territory (CA) to Geography (US) the 3P bill-to being a CA Country (CY) Level.",
    image: "guides/Pricing%20Guides/checking-eprs/images/snippet5.png",
    choices: [
      {
        label: "Continue",
        next: "step_ca_import",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the next step."
      }
    ]
  },

  step_ca_import: {
    text: "CA Import Pricing Example",
    help: "The pricing example below covers:\n\nCA Import Inbound Collect (IC) shipping from Geography (US) to Territory (CA) with the 3P bill-to being a CA Country (CY) Level.\n\nThird Party (3P) CA Import shipping from Geography (US) to Territory (CA) with the 3P bill-to being a CA Country (CY) Level.",
    image: "guides/Pricing%20Guides/checking-eprs/images/snippet6.png",
    choices: [
      {
        label: "Continue",
        next: "step_proposal_id",
        icon: "fa-solid fa-arrow-right",
        desc: "Go to the final step."
      }
    ]
  },

  step_proposal_id: {
    text: "Proposal ID Attachment",
    action: "Some contract documents/attachments are uploaded under Proposal ID.\n\nExample for Ryan Transportation fuel, cannot be located in XDRive but available under the proposal number.\n\nRESOLUTION:\nClick Proposal ID > Click Attachments > Scroll all the way down and look for Attachments section."
  }

};
