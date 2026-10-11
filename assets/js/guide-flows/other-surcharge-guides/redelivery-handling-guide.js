/* =========================================================
   REDELIVERY HANDLING GUIDE — FLOW CONFIG + NODES
   Loaded before guide.js.
   ========================================================= */

window.GUIDE_CONFIG = {
  id: "redelivery-handling-guide",
  title: "Redelivery Handling Guide",
  startNode: "start",
  templateCollection: "redelivery_handling_guide_template"
};

window.GUIDE_NODES = {

  start: {
    text: "Redelivery Handling Guide",
    help: "Validate redelivery fee disputes by reviewing second delivery attempts, appointment requirements, receiving conditions, customer refusal reasons, and carrier failures to determine if the fee should be kept or removed.",
    choices: [
      {
        label: "Continue",
        next: "redelivery_reminders",
        icon: "fa-solid fa-arrow-right",
        desc: "Review redelivery reminders."
      }
    ]
  },

  redelivery_reminders: {
    text: "REMINDERS:",
    noteHtml: "OFFICIAL HOLIDAY + Attempt SAME DAY → ❌ REMOVE Redelivery Fee<br></br>OFFICIAL HOLIDAY + Different Day → ✅ KEEP Redelivery Fee<br></brNON-FEDEX HOLIDAY:\n   Government Facility → ❌ REMOVE Redelivery Fee\n   Non-Government → ✅ KEEP Redelivery Fee<br></brREMINDER: NO 2nd delivery OR FedEx at fault = ❌ REMOVE Redelivery Fee\n2nd delivery + Customer at fault = ✅ KEEP Redelivery Fee",
    help: "Review these key reminders before processing the redelivery dispute.",
    choices: [
      {
        label: "Continue",
        next: "redelivery_second_attempt",
        icon: "fa-solid fa-arrow-right",
        desc: "Check if there was a second delivery attempt."
      }
    ]
  },

  redelivery_second_attempt: {
    text: "Was there a second delivery attempt?",
    help: "Determine if the redelivery fee is from a second delivery attempt.",
    choices: [
      {
        label: "NO – No second attempt",
        next: "redelivery_no_second_attempt",
        icon: "fa-solid fa-circle-xmark",
        desc: "Invalid fee; remove it."
      },
      {
        label: "YES – Second attempt made",
        next: "redelivery_same_consignee",
        icon: "fa-solid fa-check-circle",
        desc: "Check if delivered to same consignee."
      }
    ]
  },

  redelivery_no_second_attempt: {
    text: "Invalid (Remove Fee)\n\nDock Pickup\nReturned to Shipper\nReconsigned",
    help: "If there was no second delivery attempt, the redelivery fee is not valid. Remove the fee.",
    choices: []
  },

  redelivery_same_consignee: {
    text: "Was it delivered to the same consignee and address?",
    help: "Verify if the second attempt was to the same consignee and address.",
    choices: [
      {
        label: "NO – Different consignee/address",
        next: "redelivery_no_second_attempt",
        icon: "fa-solid fa-circle-xmark",
        desc: "Invalid; remove fee."
      },
      {
        label: "YES – Same consignee and address",
        next: "redelivery_review_cargo",
        icon: "fa-solid fa-check-circle",
        desc: "Review Cargo Care and Return DR."
      }
    ]
  },

  redelivery_review_cargo: {
    text: "Review Cargo Care / CC and Return DR.",
    help: "Check Cargo Care and the Return Delivery Receipt for supporting details.",
    choices: [
      {
        label: "Continue",
        next: "redelivery_reason_category",
        icon: "fa-solid fa-arrow-right",
        desc: "Identify the reason for redelivery."
      }
    ]
  },

  redelivery_reason_category: {
    text: "Where does the reason for the redelivery fall?",
    help: "Identify the category of the redelivery reason.",
    choices: [
      {
        label: "Needs Appointment",
        next: "redelivery_needs_appointment",
        icon: "fa-solid fa-calendar-check",
        desc: "Appointment-related redelivery."
      },
      {
        label: "Refused or Other Customer Reason",
        next: "redelivery_refused",
        icon: "fa-solid fa-user-xmark",
        desc: "Customer refused or other customer reason."
      },
      {
        label: "Carrier Related Failure",
        next: "redelivery_carrier_failure",
        icon: "fa-solid fa-truck",
        desc: "FedEx/carrier related failure."
      }
    ]
  },

  /* ==================== NEEDS APPOINTMENT FLOW ==================== */

  redelivery_needs_appointment: {
    text: "Select the delivery restriction or receiving condition that applies:",
    help: "Choose the specific condition for the appointment-related redelivery.",
    choices: [
      {
        label: "No Dockspace / Driver Delayed",
        next: "redelivery_dockspace",
        icon: "fa-solid fa-warehouse",
        desc: "No dockspace or driver delayed."
      },
      {
        label: "Straight Truck / Liftgate / Bobtail Delivery",
        next: "redelivery_special_equipment",
        icon: "fa-solid fa-truck-ramp-box",
        desc: "Special equipment required."
      },
      {
        label: "Receiving Closed at or before 5:00 PM",
        next: "redelivery_receiving_closed",
        icon: "fa-solid fa-clock",
        desc: "Receiving closed at or before 5:00 PM."
      },
      {
        label: "Rear Load",
        next: "redelivery_rear_load",
        icon: "fa-solid fa-truck",
        desc: "Rear load required."
      }
    ]
  },

  /* ===== No Dockspace / Driver Delayed ===== */

  redelivery_dockspace: {
    text: "Was a delivery appointment required?",
    help: "Determine whether the consignee required a delivery appointment.",
    choices: [
      {
        label: "YES",
        next: "redelivery_dockspace_appt",
        icon: "fa-solid fa-calendar-check",
        desc: "Appointment required."
      },
      {
        label: "NO",
        next: "redelivery_dockspace_no_appt",
        icon: "fa-solid fa-calendar-xmark",
        desc: "No appointment required."
      }
    ]
  },

  /* ===== Appointment Required ===== */

  redelivery_dockspace_appt: {
    text: "Was an appointment actually scheduled?",
    help: "Verify if the required appointment was successfully scheduled.",
    choices: [
      {
        label: "YES",
        next: "redelivery_dockspace_confirmed_time",
        icon: "fa-solid fa-check-circle",
        desc: "Appointment was scheduled."
      },
      {
        label: "NO",
        next: "redelivery_remove_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Carrier failed to secure the required appointment."
      }
    ]
  },

  redelivery_dockspace_confirmed_time: {
    text: "Did the driver arrive at the confirmed appointment time?",
    help: "Verify the driver's arrival against the scheduled appointment.",
    choices: [
      {
        label: "YES",
        next: "redelivery_dockspace_unavailable",
        icon: "fa-solid fa-check-circle",
        desc: "Driver arrived on time."
      },
      {
        label: "NO",
        next: "redelivery_remove_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Driver missed the confirmed appointment."
      }
    ]
  },

  redelivery_dockspace_unavailable: {
    text: "Was dock space unavailable?",
    help: "Confirm whether dock space was unavailable upon arrival.",
    choices: [
      {
        label: "YES",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Redelivery Fee is valid."
      },
      {
        label: "NO",
        next: "redelivery_dockspace_review",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Review for another valid reason."
      }
    ]
  },

  redelivery_dockspace_review: {
    text: "Review further for any other reason why the Redelivery Fee is present on the invoice before removing it.",
    help: "This is the final recommendation. Review the shipment thoroughly before deciding to remove the fee.",
    choices: []
  },

  /* ===== No Appointment Required ===== */

  redelivery_dockspace_no_appt: {
    text: "Did the driver arrive during receiving hours?",
    help: "Verify whether the delivery attempt occurred during the consignee's receiving hours.",
    choices: [
      {
        label: "YES",
        next: "redelivery_dockspace_arrival_departure",
        icon: "fa-solid fa-check-circle",
        desc: "Driver arrived during receiving hours."
      },
      {
        label: "NO",
        next: "redelivery_remove_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove Redelivery Fee."
      }
    ]
  },

  redelivery_dockspace_arrival_departure: {
    text: "Is the arrival/departure documented?",
    help: "Review shipment records for documented arrival and departure times.",
    choices: [
      {
        label: "YES",
        next: "redelivery_dockspace_unavailable_no_appt",
        icon: "fa-solid fa-check-circle",
        desc: "Arrival/departure documented."
      },
      {
        label: "NO",
        next: "redelivery_remove_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove Redelivery Fee."
      }
    ]
  },

  redelivery_dockspace_unavailable_no_appt: {
    text: "Was dock space unavailable?",
    help: "Determine whether dock space was unavailable during the documented delivery attempt.",
    choices: [
      {
        label: "YES",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Redelivery Fee is valid."
      },
      {
        label: "NO",
        next: "redelivery_remove_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove Redelivery Fee."
      }
    ]
  },

  /* =======================================================
     STRAIGHT TRUCK / LIFTGATE / BOBTAIL DELIVERY
     PART 2A
     ======================================================= */

  redelivery_special_equipment: {
    text: "Does the Bill of Lading (BOL) specify special equipment?",
    help: "Review the BOL to determine whether Straight Truck, Liftgate, Bobtail, or other special equipment was requested.",
    choices: [
      {
        label: "YES",
        next: "redelivery_special_equipment_used",
        icon: "fa-solid fa-file-lines",
        desc: "Special equipment is documented on the BOL."
      },
      {
        label: "NO",
        next: "redelivery_rcvg_mask",
        icon: "fa-solid fa-file-circle-question",
        desc: "Continue to Receiving Mask validation."
      }
    ]
  },

  /* -------------------------------------------------------
     BOL SPECIFIES EQUIPMENT
     ------------------------------------------------------- */

  redelivery_special_equipment_used: {
    text: "Was the correct equipment used?",
    help: "Verify that the carrier used the equipment requested on the Bill of Lading.",
    choices: [
      {
        label: "YES",
        next: "redelivery_equipment_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Requested equipment was used."
      },
      {
        label: "NO",
        next: "redelivery_remove_fee_fedex",
        icon: "fa-solid fa-circle-xmark",
        desc: "Incorrect equipment was used."
      }
    ]
  },

  redelivery_equipment_valid: {
    text: "The Redelivery Fee is valid. Review the supporting shipment documents to understand why the fee was billed even though the carrier followed the requested equipment instructions.",
    help: "Final Recommendation",
    choices: []
  },

  /* -------------------------------------------------------
     RECEIVING MASK
     ------------------------------------------------------- */

  redelivery_rcvg_mask: {
    text: "Check Consignee's Receiving Mask (RCVG MASK).",
    help: "Review the Receiving Mask for any required equipment.",
    choices: [
      {
        label: "CONTINUE",
        next: "redelivery_rcvg_equipment",
        icon: "fa-solid fa-arrow-right"
      }
    ]
  },

  redelivery_rcvg_equipment: {
    text: "Does the Receiving Mask specify the required equipment?",
    help: "Determine whether the Receiving Mask contains equipment requirements.",
    choices: [
      {
        label: "YES",
        next: "redelivery_rcvg_equipment_used",
        icon: "fa-solid fa-check-circle",
        desc: "Equipment requirement found."
      },
      {
        label: "NO",
        next: "redelivery_old_account",
        icon: "fa-solid fa-circle-xmark",
        desc: "No equipment requirement found."
      }
    ]
  },

  redelivery_rcvg_equipment_used: {
    text: "Was the correct equipment used?",
    help: "Verify that the carrier used the equipment required by the Receiving Mask.",
    choices: [
      {
        label: "YES",
        next: "redelivery_rcvg_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Correct equipment was used."
      },
      {
        label: "NO",
        next: "redelivery_remove_fee_fedex",
        icon: "fa-solid fa-circle-xmark",
        desc: "Incorrect equipment was used."
      }
    ]
  },

  redelivery_rcvg_valid: {
    text: "The Redelivery Fee is valid. Review the supporting shipment documents to understand why the fee was billed even though the carrier followed the requested equipment instructions.",
    help: "Final Recommendation",
    choices: []
  },

  /* =======================================================
     STRAIGHT TRUCK / LIFTGATE / BOBTAIL DELIVERY
     PART 2B
     Old Consignee Code → Appointment Notes / Delivery Request
     ======================================================= */

  redelivery_old_account: {
    text: "Check Old Consignee Code",
    help: "If the active account does not specify special equipment in the Receiving Mask, review the Old Consignee Code.",
    choices: [
      {
        label: "CONTINUE",
        next: "redelivery_old_account_equipment",
        icon: "fa-solid fa-arrow-right"
      }
    ]
  },

  redelivery_old_account_equipment: {
    text: "Does the Old Consignee Code specify the required equipment?",
    help: "Determine whether the previous consignee account contains equipment requirements.",
    choices: [
      {
        label: "YES",
        next: "redelivery_old_account_remove",
        icon: "fa-solid fa-check-circle",
        desc: "Equipment requirement found."
      },
      {
        label: "NO",
        next: "redelivery_delivery_request",
        icon: "fa-solid fa-circle-xmark",
        desc: "No equipment requirement found."
      }
    ]
  },

  redelivery_old_account_remove: {
    text: "Redelivery Fee can be removed.",
    help: "Final Recommendation",
    choices: []
  },

  /* ------------------------------------------------------
     DELIVERY REQUEST / APPOINTMENT NOTES
     ------------------------------------------------------ */

  redelivery_delivery_request: {
    text: "Check Appointment Notes / Delivery Request (DR). Were there specific instructions (e.g., call before delivery or special equipment)?",
    help: "Review the Appointment Notes or Delivery Request for any documented delivery instructions.",
    choices: [
      {
        label: "YES",
        next: "redelivery_instruction_followed",
        icon: "fa-solid fa-check-circle",
        desc: "Specific instructions were documented."
      },
      {
        label: "NO",
        next: "redelivery_actual_service",
        icon: "fa-solid fa-circle-xmark",
        desc: "No documented instructions."
      }
    ]
  },

  redelivery_instruction_followed: {
    text: "Were the documented instructions followed?",
    help: "Confirm whether the carrier complied with the documented delivery instructions.",
    choices: [
      {
        label: "YES",
        next: "redelivery_instruction_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Instructions were followed."
      },
      {
        label: "NO",
        next: "redelivery_remove_fee_fedex",
        icon: "fa-solid fa-circle-xmark",
        desc: "Instructions were not followed."
      }
    ]
  },

  redelivery_instruction_valid: {
    text: "The Redelivery Fee is valid. Review the supporting shipment documents to understand why the fee was billed even though the carrier followed the requested equipment instructions.",
    help: "Final Recommendation",
    choices: []
  },

  /* =======================================================
     STRAIGHT TRUCK / LIFTGATE / BOBTAIL DELIVERY
     PART 2C
     Actual Service Performed / Dock Pickup
     ======================================================= */

  redelivery_actual_service: {
    text: "Check Actual Service Performed / Dock Pickup.",
    help: "Determine whether the billed service was actually performed or if the shipment was handled as a dock pickup.",
    choices: [
      {
        label: "YES",
        next: "redelivery_service_billed",
        icon: "fa-solid fa-check-circle",
        desc: "Actual service information is available."
      },
      {
        label: "NO",
        next: "redelivery_dock_pickup",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to Dock Pickup validation."
      }
    ]
  },

  /* ------------------------------------------------------
     ACTUAL SERVICE PERFORMED
     ------------------------------------------------------ */

  redelivery_service_billed: {
    text: "Was the service performed as billed (e.g., Liftgate)?",
    help: "Verify whether the billed accessorial service was actually provided.",
    choices: [
      {
        label: "YES",
        next: "redelivery_accessorial_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Service was performed."
      },
      {
        label: "NO",
        next: "redelivery_remove_accessorial",
        icon: "fa-solid fa-circle-xmark",
        desc: "Service was not performed."
      }
    ]
  },

  redelivery_accessorial_valid: {
    text: "Accessorial Fee is VALID.",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_remove_accessorial: {
    text: "REMOVE Accessorial Fee.",
    help: "Final Recommendation",
    choices: []
  },

  /* ------------------------------------------------------
     DOCK PICKUP
     ------------------------------------------------------ */

  redelivery_dock_pickup: {
    text: "Was the freight picked up at the dock instead of being delivered?",
    help: "Determine whether the consignee picked up the freight directly from the dock.",
    choices: [
      {
        label: "YES",
        next: "redelivery_remove_fee_final",
        icon: "fa-solid fa-check-circle",
        desc: "Shipment was picked up at the dock."
      },
      {
        label: "NO",
        next: "redelivery_fee_may_apply",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipment was not picked up at the dock."
      }
    ]
  },

  redelivery_remove_fee_final: {
    text: "Remove Redelivery Fee.",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_fee_may_apply: {
    text: "Redelivery Fee may apply.",
    help: "Final Recommendation",
    choices: []
  },

  /* =======================================================
     RECEIVING CLOSED AT OR BEFORE 5:00 PM
     ======================================================= */

  redelivery_receiving_closed: {
    text: "Is there a scheduled delivery appointment?",
    help: "Determine whether the delivery required a scheduled appointment.",
    choices: [
      {
        label: "YES",
        next: "redelivery_appt_window",
        icon: "fa-solid fa-calendar-check"
      },
      {
        label: "NO",
        next: "redelivery_receiving_hours",
        icon: "fa-solid fa-calendar-xmark"
      }
    ]
  },

  /* =======================================================
     APPOINTMENT REQUIRED
     ======================================================= */

  redelivery_appt_window: {
    text: "Did the driver arrive within the scheduled appointment window?",
    help: "Verify the driver's arrival against the confirmed appointment.",
    choices: [
      {
        label: "YES",
        next: "redelivery_valid_appt",
        icon: "fa-solid fa-check-circle"
      },
      {
        label: "NO",
        next: "redelivery_remove_fee_fedex",
        icon: "fa-solid fa-circle-xmark"
      }
    ]
  },

  redelivery_valid_appt: {
    text: "Redelivery Fee is VALID.",
    note: "If the case is reopened and the customer insists on removing the Redelivery Fee, even though the documents show it is valid, contact the Service Center to obtain additional supporting details before responding to the customer.",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_valid_appt_note: {
    text: "If the case is reopened and the customer insists on removing the Redelivery Fee, even though the documents show it is valid, contact the Service Center to obtain additional supporting details before responding to the customer.",
    help: "Final Recommendation",
    choices: []
  },

  /* =======================================================
     NO APPOINTMENT
     ======================================================= */

  redelivery_receiving_hours: {
    text: "Check the Weekly Calendar (Receiving Hours). Did the driver arrive during receiving hours?",
    help: "Review the consignee's receiving hours.",
    choices: [
      {
        label: "YES",
        next: "redelivery_receiving_reason",
        icon: "fa-solid fa-check-circle"
      },
      {
        label: "NO",
        next: "redelivery_after_closing",
        icon: "fa-solid fa-circle-xmark"
      }
    ]
  },

  /* =======================================================
     DRIVER ARRIVED DURING RECEIVING HOURS
     ======================================================= */

  redelivery_receiving_reason: {
    text: "Is the 'Receiving Closed' reason valid?",
    help: "Determine whether the receiving closed reason is supported.",
    choices: [
      {
        label: "YES",
        next: "redelivery_arrival_departure_missing",
        icon: "fa-solid fa-check-circle"
      },
      {
        label: "NO",
        next: "redelivery_remove_fee",
        icon: "fa-solid fa-circle-xmark"
      }
    ]
  },

  redelivery_arrival_departure_missing: {
    text: "Are Arrival/Departure times missing?",
    help: "Verify whether arrival and departure timestamps are available.",
    choices: [
      {
        label: "YES",
        next: "redelivery_fbc",
        icon: "fa-solid fa-clock"
      },
      {
        label: "NO",
        next: "redelivery_special_instruction",
        icon: "fa-solid fa-file-lines"
      }
    ]
  },

  /* =======================================================
     FBC
     ======================================================= */

  redelivery_fbc: {
    text: "Check Shipment History (FBC).",
    help: "Review shipment history to validate the delivery attempt.",
    choices: [
      {
        label: "CONTINUE",
        next: "redelivery_valid_attempt",
        icon: "fa-solid fa-arrow-right"
      }
    ]
  },

  redelivery_valid_attempt: {
    text: "Was a valid delivery attempt confirmed?",
    help: "Determine whether the shipment history confirms a valid delivery attempt.",
    choices: [
      {
        label: "YES",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-check-circle"
      },
      {
        label: "NO",
        next: "redelivery_contact_sc_times",
        icon: "fa-solid fa-phone"
      }
    ]
  },

  redelivery_contact_sc_times: {
    text: "Reach out to the Service Center to confirm the arrival and departure times, then respond to the customer based on the Service Center's reply.",
    help: "Final Recommendation",
    choices: []
  },

  /* =======================================================
     SPECIAL INSTRUCTIONS
     ======================================================= */

  redelivery_special_instruction: {
    text: "Are there special instructions (e.g., call before delivery)?",
    help: "Review the BOL and shipment documents for special delivery instructions.",
    choices: [
      {
        label: "YES",
        next: "redelivery_instruction_followed_rcv",
        icon: "fa-solid fa-check-circle"
      },
      {
        label: "NO",
        next: "redelivery_consignee_unavailable",
        icon: "fa-solid fa-circle-xmark"
      }
    ]
  },

  redelivery_instruction_followed_rcv: {
    text: "Were the special instructions followed?",
    help: "Confirm whether the carrier followed the documented instructions.",
    choices: [
      {
        label: "YES",
        next: "redelivery_remove_fee_fedex",
        icon: "fa-solid fa-check-circle"
      },
      {
        label: "NO",
        next: "redelivery_contact_sc_instruction",
        icon: "fa-solid fa-phone"
      }
    ]
  },

  redelivery_contact_sc_instruction: {
    text: "Reach out to the Service Center to confirm why the instructions on the BOL were not followed, so you can determine whether the Redelivery Fee should be removed.",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_consignee_unavailable: {
    text: "If the consignee was unavailable during valid receiving hours, the Redelivery Fee is VALID. If the issue was caused by a carrier error or data mismatch, remove the Redelivery Fee.",
    help: "Final Recommendation",
    choices: []
  },

  /* =======================================================
     DRIVER ARRIVED OUTSIDE RECEIVING HOURS
     ======================================================= */

  redelivery_after_closing: {
    text: "Did the driver arrive AFTER the consignee's closing time?",
    help: "Determine whether the arrival occurred after business hours.",
    choices: [
      {
        label: "YES",
        next: "redelivery_remove_fee",
        icon: "fa-solid fa-circle-xmark"
      },
      {
        label: "NO",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-check-circle"
      }
    ]
  },

  /* =======================================================
     REAR LOAD
     ======================================================= */

  redelivery_rear_load: {
    text: "Are there instructions noted on the Bill of Lading (BOL) or in the Billing Mask requiring Rear Load service?",
    help: "Review the BOL and Billing Mask to determine whether Rear Load service was specifically requested.",
    choices: [
      {
        label: "YES",
        next: "redelivery_rear_load_remove",
        icon: "fa-solid fa-check-circle",
        desc: "Rear Load instruction is documented."
      },
      {
        label: "NO",
        next: "redelivery_rear_load_sc",
        icon: "fa-solid fa-circle-xmark",
        desc: "No documented Rear Load instruction found."
      }
    ]
  },

  /* =======================================================
     FINAL RECOMMENDATIONS
     ======================================================= */

  redelivery_rear_load_remove: {
    text: "Remove Redelivery Fee.",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_rear_load_sc: {
    text: "Reach out to the Service Center to confirm whether there are any supporting documents for the Rear Load charge before removing the Redelivery Fee.",
    help: "Final Recommendation",
    choices: []
  },

  /* ==================== REFUSED OR OTHER CUSTOMER REASON ==================== */

  redelivery_refused: {
    text: "Select the specific refused or other customer reason scenario:",
    help: "Choose the specific reason for the refusal or customer-related redelivery.",
    choices: [
      {
        label: "Damage / Refusal",
        next: "redelivery_refused_damage",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Shipment damaged or refused."
      },
      {
        label: "No Packing Slip",
        next: "redelivery_refused_no_packing",
        icon: "fa-solid fa-file-lines",
        desc: "Refused due to no packing slip or COA."
      },
      {
        label: "Wrong Product Shipped",
        next: "redelivery_refused_wrong_product",
        icon: "fa-solid fa-box",
        desc: "Wrong product shipped."
      },
      {
        label: "Redelivery with Charges",
        next: "redelivery_refused_charges",
        icon: "fa-solid fa-hand-holding-dollar",
        desc: "Redelivery with charges scenario."
      },
      {
        label: "Bad PO#",
        next: "redelivery_refused_bad_po",
        icon: "fa-solid fa-hashtag",
        desc: "Bad PO number."
      },
      {
        label: "Order Cancelled or Refused",
        next: "redelivery_refused_cancelled",
        icon: "fa-solid fa-ban",
        desc: "Order cancelled or refused."
      },
      {
        label: "Salvaged Freight",
        next: "redelivery_refused_salvage",
        icon: "fa-solid fa-recycle",
        desc: "Freight marked as salvaged."
      },
      {
        label: "Refused or Cancelled (Not Order Reason)",
        next: "redelivery_refused_not_order",
        icon: "fa-solid fa-circle-question",
        desc: "Refused or cancelled - not order reason."
      }
    ]
  },

  /* ==================== DAMAGE / REFUSAL ==================== */

  redelivery_refused_damage: {
    text: "Was a Redelivery Fee charged?",
    help: "Determine whether a Redelivery Fee was billed for the shipment.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_damage_full",
        icon: "fa-solid fa-circle-check",
        desc: "A Redelivery Fee was charged."
      },
      {
        label: "No",
        next: "redelivery_refused_damage_no_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "No Redelivery Fee was charged."
      }
    ]
  },

  redelivery_refused_damage_no_fee: {
    text: "Advise the customer accordingly.",
    help: "No Redelivery Fee was charged.",
    choices: []
  },

  redelivery_refused_damage_full: {
    text: "Was the shipment initially delivered in full?",
    help: "Verify whether the shipment was completely delivered during the initial delivery attempt.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_damage_delivered",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment was delivered in full."
      },
      {
        label: "No",
        next: "redelivery_refused_damage_partial",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipment was partially delivered or refused."
      }
    ]
  },

  redelivery_refused_damage_delivered: {
    text: "Advise the customer accordingly.",
    help: "The shipment was initially delivered in full.",
    choices: []
  },

  redelivery_refused_damage_partial: {
    text: "Partial delivery or refused items",
    help: "The shipment was not delivered in full.",
    choices: [
      {
        label: "Continue",
        next: "redelivery_refused_damage_reason",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue."
      }
    ]
  },

  redelivery_refused_damage_reason: {
    text: "What was the reason for refusal?",
    help: "Identify the reason the shipment or items were refused.",
    choices: [
      {
        label: "Damage",
        next: "redelivery_refused_damage_damage",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Shipment was refused due to damage."
      },
      {
        label: "Other reasons (Appt, Closed, etc.)",
        next: "redelivery_standard_validation",
        icon: "fa-solid fa-arrow-right",
        desc: "Standard Redelivery Fee rules apply."
      }
    ]
  },

  redelivery_refused_damage_damage: {
    text: "Damage",
    help: "Continue the Damage validation.",
    choices: [
      {
        label: "Continue",
        next: "redelivery_refused_damage_redelivered",
        icon: "fa-solid fa-arrow-right",
        desc: "Continue."
      }
    ]
  },

  redelivery_refused_damage_redelivered: {
    text: "Were refused items later redelivered successfully?",
    help: "Determine whether the refused damaged shipment was successfully redelivered.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_damage_keep_fee",
        icon: "fa-solid fa-circle-check",
        desc: "Items were successfully redelivered."
      },
      {
        label: "No",
        next: "redelivery_refused_damage_returned",
        icon: "fa-solid fa-circle-xmark",
        desc: "Items were not successfully redelivered."
      }
    ]
  },

  redelivery_refused_damage_keep_fee: {
    text: "Keep Redelivery Fee",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_standard_validation: {
    text: "Standard Redelivery fee rules apply",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_refused_damage_returned: {
    text: "Were the refused items returned to the shipper?",
    help: "Confirm whether the refused shipment was returned to the shipper.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_damage_remove_fee",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment was returned to the shipper."
      },
      {
        label: "No",
        next: "redelivery_refused_damage_review",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipment was not returned to the shipper."
      }
    ]
  },

  redelivery_refused_damage_remove_fee: {
    text: "Remove Redelivery Fee",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_refused_damage_review: {
    text: "Review further and try reaching out to the Service Center for additional details if the refused shipment was returned to the shipper, then advise the customer accordingly.",
    help: "Final Recommendation",
    choices: []
  },

  /* ==================== NO PACKING SLIP ==================== */

  redelivery_refused_no_packing: {
    text: "Provide Return DR and Cargo Care to the customer that the consignee initially refused the freight due to no packing list or no COA, so the freight had to be redelivered.",
    help: "Shipment refused due to no packing list or missing COA.",
    recommendation: {
      type: "review",
      title: "Final Recommendation",
      message: "Provide Return DR and Cargo Care to the customer that the consignee initially refused the freight due to no packing list or no COA, so the freight had to be redelivered."
    },
    note: "Also check the other documents imaged under the Bill of Lading (BL) to see if there are any indicating who should be billed for the redelivery fee, and advise the customer accordingly."
  },

  /* ==================== WRONG PRODUCT SHIPPED ==================== */

  redelivery_refused_wrong_product: {
    text: "Is the supporting documentation for the Redelivery Fee available?",
    help: "Review the shipment documents to determine whether supporting documentation is available.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_wrong_product_bl",
        icon: "fa-solid fa-circle-check",
        desc: "Supporting documentation is available."
      },
      {
        label: "No",
        next: "redelivery_refused_wrong_product_sc",
        icon: "fa-solid fa-circle-xmark",
        desc: "No supporting documentation is available."
      }
    ]
  },

  redelivery_refused_wrong_product_bl: {
    text: "Are there any documents imaged under the Bill of Lading (BL) explaining why the wrong product was shipped? Also, are there any documents indicating that the shipment should be redelivered?",
    help: "Review all imaged documents under the Bill of Lading (BL).",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_wrong_product_valid",
        icon: "fa-solid fa-circle-check",
        desc: "Supporting documents justify the Redelivery Fee."
      },
      {
        label: "No",
        next: "redelivery_refused_wrong_product_sc",
        icon: "fa-solid fa-circle-xmark",
        desc: "No supporting documents were found."
      }
    ]
  },

  redelivery_refused_wrong_product_valid: {
    text: "Redelivery Fee is VALID.",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_refused_wrong_product_sc: {
    text: "Confirm first with the Service Center if there are really no documents to support the fee before removing it.",
    help: "Final Recommendation",
    choices: []
  },

  /* ==================== REDELIVERY WITH CHARGES ==================== */

  redelivery_refused_charges: {
    text: "Was the shipment initially NOT delivered?",
    help: "Determine whether the shipment failed the initial delivery attempt.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_charges_reason",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment was not initially delivered."
      },
      {
        label: "No",
        next: "redelivery_refused_charges_no_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipment was initially delivered."
      }
    ]
  },

  redelivery_refused_charges_no_fee: {
    text: "No Redelivery Fee applicable.",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_refused_charges_reason: {
    text: "Is there a documented reason for non-delivery? (e.g., refusal, no appointment, closed, etc.)",
    help: "Review the shipment records for a documented reason why the initial delivery was unsuccessful.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_charges_proof",
        icon: "fa-solid fa-circle-check",
        desc: "A documented reason is available."
      },
      {
        label: "No",
        next: "redelivery_refused_charges_no_docs",
        icon: "fa-solid fa-circle-xmark",
        desc: "No documented reason was found."
      }
    ]
  },

  redelivery_refused_charges_no_docs: {
    text: "Remove Redelivery Fee (Insufficient documentation).",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_refused_charges_proof: {
    text: "Is the reason supported by valid proof? (e.g., signed DR, timestamps, notes, customer confirmation)",
    help: "Verify whether the documented reason is supported by sufficient evidence.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_charges_customer",
        icon: "fa-solid fa-circle-check",
        desc: "Supporting proof is available."
      },
      {
        label: "No",
        next: "redelivery_refused_charges_remove",
        icon: "fa-solid fa-circle-xmark",
        desc: "Supporting proof is unavailable."
      }
    ]
  },

  redelivery_refused_charges_customer: {
    text: "Was the failure caused by the customer? (e.g., no appointment, refused freight)",
    help: "Determine whether the unsuccessful delivery resulted from a customer-related issue.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_charges_consistent",
        icon: "fa-solid fa-circle-check",
        desc: "Customer caused the failed delivery."
      },
      {
        label: "No",
        next: "redelivery_refused_charges_carrier",
        icon: "fa-solid fa-circle-xmark",
        desc: "Carrier was responsible."
      }
    ]
  },

  redelivery_refused_charges_consistent: {
    text: "Is the documentation consistent across all records? (DR vs FBI comments vs BOL)",
    help: "Compare all available shipment records for consistency.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_charges_valid",
        icon: "fa-solid fa-circle-check",
        desc: "Documentation is consistent."
      },
      {
        label: "No",
        next: "redelivery_refused_charges_conflict",
        icon: "fa-solid fa-circle-xmark",
        desc: "Documentation contains conflicting information."
      }
    ]
  },

  redelivery_refused_charges_valid: {
    text: "Redelivery Fee is VALID.",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_refused_charges_conflict: {
    text: "Remove Redelivery Fee (Conflicting information).",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_refused_charges_carrier: {
    text: "Remove Redelivery Fee (Carrier responsibility).",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_refused_charges_remove: {
    text: "Remove Redelivery Fee.",
    help: "Final Recommendation",
    choices: []
  },

  /* ==================== BAD PO# ==================== */

  redelivery_refused_bad_po: {
    text: "Check the PO# noted on the Bill of Lading (BOL).",
    help: "Final Recommendation",
    note: "Also check whether there are any documents imaged under the Bill of Lading (BOL) related to the PO number and whether there is authorization to redeliver the PRO. If no supporting documents are available, advise the customer based on the PO number noted on the BOL. If documents exist showing the PO number and approved authorization for redelivery, consider the Redelivery Fee valid and advise the customer accordingly.",
    choices: []
  },

  /* ==================== ORDER CANCELLED OR REFUSED ==================== */

  redelivery_refused_cancelled: {
    text: "Was the order cancelled or refused?",
    help: "Determine whether the shipment was cancelled or refused by the customer.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_cancelled_reason",
        icon: "fa-solid fa-circle-check",
        desc: "The order was cancelled or refused."
      },
      {
        label: "No",
        next: "redelivery_refused_cancelled_other",
        icon: "fa-solid fa-circle-xmark",
        desc: "The order was not cancelled or refused."
      }
    ]
  },

  redelivery_refused_cancelled_reason: {
    text: "Is the reason under 'Refused or Other Customer Reason'?",
    help: "Determine whether the cancellation or refusal falls under the Refused or Other Customer Reason category.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_cancelled_customer",
        icon: "fa-solid fa-circle-check",
        desc: "The reason falls under Refused or Other Customer Reason."
      },
      {
        label: "No",
        next: "redelivery_refused_cancelled_other",
        icon: "fa-solid fa-circle-xmark",
        desc: "The reason falls under another scenario."
      }
    ]
  },

  redelivery_refused_cancelled_customer: {
    text: "Was the reason caused by the customer? (e.g., order cancelled, won't accept, site issue)",
    help: "Determine whether the customer caused the failed delivery.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_cancelled_valid",
        icon: "fa-solid fa-circle-check",
        desc: "Customer caused the cancellation or refusal."
      },
      {
        label: "No",
        next: "redelivery_refused_cancelled_other",
        icon: "fa-solid fa-circle-xmark",
        desc: "Customer did not cause the cancellation or refusal."
      }
    ]
  },

  redelivery_refused_cancelled_valid: {
    text: "Redelivery Fee is VALID.",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_refused_cancelled_other: {
    text: "Check other scenarios to determine why the Redelivery Fee is being billed. Remove the Redelivery Fee if it is confirmed to be invalid.",
    help: "Final Recommendation",
    choices: []
  },

  /* ===== Salvaged Freight ===== */

  redelivery_refused_salvage: {
    text: "Is freight marked as Salvaged (01 or Y0)?",
    help: "Check if the freight is marked as salvaged.",
    choices: [
      {
        label: "YES – Marked as Salvaged",
        next: "redelivery_refused_salvage_yes",
        icon: "fa-solid fa-check-circle",
        desc: "Check DR for PRO-01 or PRO-Y0."
      },
      {
        label: "NO – Not marked as Salvaged",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-circle-xmark",
        desc: "Redelivery fee applies."
      }
    ]
  },

  redelivery_refused_salvage_yes: {
    text: "Check DR (Delivery Receipt).\n\nDoes DR show PRO-01 or PRO-Y0?",
    help: "Verify if the Delivery Receipt shows PRO-01 or PRO-Y0.",
    choices: [
      {
        label: "NO – Not shown",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-circle-xmark",
        desc: "Redelivery fee applies."
      },
      {
        label: "YES – Shown on DR",
        next: "redelivery_refused_salvage_check_cc",
        icon: "fa-solid fa-check-circle",
        desc: "Check BL, Cargo Care, and Comments."
      }
    ]
  },

  redelivery_refused_salvage_check_cc: {
    text: "Check BL, Cargo Care, and Comments.\n\nIs there a note: 'SALVAGE REQUEST SUBMITTED' and APPROVED?",
    help: "Verify if there is a salvage request and approval note.",
    choices: [
      {
        label: "NO – No note",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-circle-xmark",
        desc: "Redelivery fee applies."
      },
      {
        label: "YES – Note exists",
        next: "redelivery_refused_salvage_redelivered",
        icon: "fa-solid fa-check-circle",
        desc: "Check if freight was redelivered."
      }
    ]
  },

  redelivery_refused_salvage_redelivered: {
    text: "Was freight actually redelivered to the same location?",
    help: "Verify if the freight was actually redelivered to the same location.",
    choices: [
      {
        label: "YES – Redelivered",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Redelivery fee applies."
      },
      {
        label: "NO – Not redelivered",
        next: "redelivery_refused_salvage_remove",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove Redelivery Fee."
      }
    ]
  },

  redelivery_refused_salvage_remove: {
    text: "Remove Redelivery Fee\n\nVS-ACCS-CASE# - REMOVED THE REDELIVERY PER DOCUMENTS ON IMAGE.\n\nTHIS WAS NOT DELIVERED AND WAS SENT TO SALVAGE.",
    help: "Remove the redelivery fee with the appropriate FBC comment.",
    choices: []
  },

  /* ===== Refused or Cancelled (Not Order Reason) ===== */

  redelivery_refused_not_order: {
    text: "Was the shipment refused or cancelled? (Not Order Reason)",
    help: "Check if the shipment was refused or cancelled for a non-order reason.",
    choices: [
      {
        label: "No",
        next: "redelivery_refused_not_order_other",
        icon: "fa-solid fa-circle-xmark",
        desc: "Shipment was not refused or cancelled."
      },
      {
        label: "Yes",
        next: "redelivery_refused_not_order_reason",
        icon: "fa-solid fa-circle-check",
        desc: "Shipment was refused or cancelled."
      }
    ]
  },

  redelivery_refused_not_order_other: {
    text: "Check other scenarios to determine why the Redelivery Fee is being billed. Remove the Redelivery Fee if it is confirmed to be invalid.",
    help: "Final Recommendation",
    choices: []
  },

  redelivery_refused_not_order_reason: {
    text: "Is the refusal reason 'Did Not Order'?",
    help: "Review the refusal reason documented on the shipment.",
    choices: [
      {
        label: "No",
        next: "redelivery_refused_not_order_other",
        icon: "fa-solid fa-circle-xmark",
        desc: "Reason is not 'Did Not Order'."
      },
      {
        label: "Yes",
        next: "redelivery_refused_not_order_under",
        icon: "fa-solid fa-circle-check",
        desc: "Reason is 'Did Not Order'."
      }
    ]
  },

  redelivery_refused_not_order_under: {
    text: "Is the reason classified under 'Refused or Other Customer Reason'?",
    help: "Determine whether the refusal reason falls under the Refused or Other Customer Reason category.",
    choices: [
      {
        label: "No",
        next: "redelivery_refused_not_order_other",
        icon: "fa-solid fa-circle-xmark",
        desc: "Reason falls under another scenario."
      },
      {
        label: "Yes",
        next: "redelivery_refused_not_order_customer",
        icon: "fa-solid fa-circle-check",
        desc: "Reason falls under Refused or Other Customer Reason."
      }
    ]
  },

  redelivery_refused_not_order_customer: {
    text: "Was the issue caused by the customer? (e.g., did not place the order or rejected the shipment)",
    help: "Determine whether the customer caused the failed delivery.",
    choices: [
      {
        label: "Yes",
        next: "redelivery_refused_not_order_valid",
        icon: "fa-solid fa-circle-check",
        desc: "Customer caused the issue."
      },
      {
        label: "No",
        next: "redelivery_refused_not_order_other",
        icon: "fa-solid fa-circle-xmark",
        desc: "Customer did not cause the issue."
      }
    ]
  },

  redelivery_refused_not_order_valid: {
    text: "Redelivery Fee is VALID.",
    help: "Final Recommendation",
    choices: []
  },

  /* ==================== CARRIER RELATED FAILURE ==================== */

  redelivery_carrier_failure: {
    text: "Select the specific carrier related failure scenario:",
    help: "Choose the specific carrier failure scenario for the redelivery.",
    choices: [
      {
        label: "Billing Error",
        next: "redelivery_carrier_billing_error",
        icon: "fa-solid fa-file-invoice",
        desc: "Billing error related to redelivery fee."
      },
      {
        label: "Reconsignment / Return to Sender",
        next: "redelivery_carrier_reconsignment",
        icon: "fa-solid fa-truck-arrow-right",
        desc: "Reconsignment or return to sender."
      },
      {
        label: "Delivery Attempted/Completed on Specific Date",
        next: "redelivery_carrier_specific_date",
        icon: "fa-solid fa-calendar-day",
        desc: "Delivery attempted on a specific date."
      },
      {
        label: "Arrival/Departure Time Missing",
        next: "redelivery_arrival_departure_missing",
        icon: "fa-solid fa-clock",
        desc: "Arrival/departure time missing."
      },
      {
        label: "State of Emergency",
        next: "redelivery_soe_failure_reason",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "State of emergency related failure."
      },
      {
        label: "Carrier Failure or Weather",
        next: "redelivery_failure_reason_root",
        icon: "fa-solid fa-cloud-sun-rain",
        desc: "Carrier failure or weather related."
      },
      {
        label: "Freight Status on Trailer/Truck",
        next: "redelivery_freight_on_trailer_check",
        icon: "fa-solid fa-trailer",
        desc: "Check if freight was on the trailer during delivery attempt."
      },
      {
        label: "No Reason Noted",
        next: "redelivery_no_reason_noted_init",
        icon: "fa-solid fa-comment-slash",
        desc: "Scenario where no specific reason is noted on documentation."
      }
    ]
  },

  /* ===== Billing Error ===== */

  redelivery_carrier_billing_error: {
    text: "Is the supporting Documents for the Redelivery Fee Available?",
    help: "Check if there are supporting documents for the redelivery fee.",
    choices: [
      {
        label: "YES – Documents available",
        next: "redelivery_carrier_billing_error_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Check if documents validate the fee."
      },
      {
        label: "NO – No documents",
        next: "redelivery_carrier_billing_error_no_docs",
        icon: "fa-solid fa-circle-xmark",
        desc: "Confirm with Service Center."
      }
    ]
  },

  redelivery_carrier_billing_error_valid: {
    text: "Is the supporting documents validate that Redelivery fee is valid?",
    help: "Verify if the documents support the redelivery fee.",
    choices: [
      {
        label: "YES – Documents validate the fee",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Redelivery Fee is Valid."
      },
      {
        label: "NO – Documents do not validate",
        next: "redelivery_carrier_billing_error_no_docs",
        icon: "fa-solid fa-circle-xmark",
        desc: "Confirm with Service Center."
      }
    ]
  },

  redelivery_carrier_billing_error_no_docs: {
    text: "Confirm first to the Service Center if there is really no documents to support the fee, before removing it.",
    help: "Contact the Service Center to verify if there are any supporting documents.",
    choices: []
  },

  /* ===== Reconsignment / Return to Sender ===== */

  redelivery_carrier_reconsignment: {
    text: "Was a Redelivery Fee charged?",
    help: "Check if a redelivery fee was charged on the invoice.",
    choices: [
      {
        label: "NO – No fee charged",
        next: "redelivery_carrier_reconsignment_no_fee",
        icon: "fa-solid fa-check-circle",
        desc: "Advised the customer accordingly."
      },
      {
        label: "YES – Fee charged",
        next: "redelivery_carrier_reconsignment_redelivered",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check if shipment was redelivered to original consignee."
      }
    ]
  },

  redelivery_carrier_reconsignment_no_fee: {
    text: "Advised the customer accordingly.",
    help: "No redelivery fee was charged; advise the customer accordingly.",
    choices: []
  },

  redelivery_carrier_reconsignment_redelivered: {
    text: "Was the shipment REDELIVERED to the original consignee address?",
    help: "Check if the shipment was successfully redelivered to the original address.",
    choices: [
      {
        label: "YES – Redelivered to original address",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Valid Redelivery Fee."
      },
      {
        label: "NO – Not redelivered to original address",
        next: "redelivery_carrier_reconsignment_reconsigned",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check if shipment was reconsigned or returned."
      }
    ]
  },

  redelivery_carrier_reconsignment_reconsigned: {
    text: "Was the shipment RECONSIGNED or RETURNED TO SENDER?",
    help: "Determine if the shipment was reconsigned or returned.",
    choices: [
      {
        label: "YES – Reconsigned or returned",
        next: "redelivery_carrier_reconsignment_new_address",
        icon: "fa-solid fa-check-circle",
        desc: "Check if sent to a new address."
      },
      {
        label: "NO – Not reconsigned or returned",
        next: "redelivery_carrier_reconsignment_attempt_failed",
        icon: "fa-solid fa-circle-xmark",
        desc: "Check if delivery attempt failed."
      }
    ]
  },

  redelivery_carrier_reconsignment_new_address: {
    text: "Was it sent to a NEW address (true reconsignment)?",
    help: "Verify if the shipment was sent to a completely new address.",
    choices: [
      {
        label: "YES – Sent to new address",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "KEEP Redelivery fee (service was performed)."
      },
      {
        label: "NO – Returned to original shipper",
        next: "redelivery_remove_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Returned to original shipper - REMOVE Redelivery fee."
      }
    ]
  },

  redelivery_carrier_reconsignment_attempt_failed: {
    text: "Was delivery attempted but failed (e.g., no appointment, closed, etc.)?",
    help: "Check if a delivery attempt was made but failed.",
    choices: [
      {
        label: "YES – Attempt failed",
        next: "redelivery_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "KEEP Redelivery fee."
      },
      {
        label: "NO – No attempt made",
        next: "redelivery_carrier_reconsignment_no_docs",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove fee or reach out to SC."
      }
    ]
  },

  redelivery_carrier_reconsignment_no_docs: {
    text: "REMOVE Redelivery fee if no documents to support the fee or Reach out to Service Center for additional details regarding Redelivery Fee.",
    help: "Remove the fee or contact the Service Center for more information.",
    choices: []
  },

  /* =========================================================================
     REDELIVERY DECISION TREE NODES (Complete Flow Including Endpoints)
     ========================================================================= */

  redelivery_carrier_specific_date: {
    text: "Was delivery attempted or completed on a specific date?",
    help: "Check if the carrier attempted or completed delivery on a specific date.",
    choices: [
      {
        label: "YES",
        next: "redelivery_bol_closure_check",
        icon: "fa-solid fa-check-circle",
        desc: "Proceed to check the BOL for instructions."
      },
      {
        label: "NO",
        next: "redelivery_appointment_set_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Proceed to verify if the appointment was set properly."
      }
    ]
  },

  redelivery_bol_closure_check: {
    text: "Did the BOL indicate or provide an instruction on that specific date store/receiving area is closed?",
    help: "Review the BOL notes for any closure details on the specified date.",
    choices: [
      {
        label: "YES",
        next: "endpoint_fee_not_valid",
        icon: "fa-solid fa-circle-xmark",
        desc: "Redelivery fee is Not Valid."
      },
      {
        label: "NO",
        next: "endpoint_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Valid Redelivery Fee."
      }
    ]
  },

  redelivery_appointment_set_check: {
    text: "Was appointment set properly?",
    help: "Confirm if the delivery appointment scheduling met all necessary criteria.",
    choices: [
      {
        label: "NO",
        next: "endpoint_remove_fee_fedex",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove Redelivery Fee (FedEx Failure)."
      },
      {
        label: "YES",
        next: "redelivery_required_calls_check",
        icon: "fa-solid fa-check-circle",
        desc: "Proceed to check if required calls were made."
      }
    ]
  },

  redelivery_required_calls_check: {
    text: "Were required calls made? (48 hrs prior OR 15 mins prior)",
    help: "Check driver logs to see if the 48-hour or 15-minute advance calls were executed.",
    choices: [
      {
        label: "YES",
        next: "endpoint_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Valid Redelivery Fee."
      },
      {
        label: "NO",
        next: "redelivery_email_service_center",
        icon: "fa-solid fa-envelope",
        desc: "Email destination service center to confirm."
      }
    ]
  },

  redelivery_email_service_center: {
    text: "Email destination service center to confirm.",
    help: "Reach out to the service center to verify call logs directly.",
    choices: [
      {
        label: "Confirmed NO CALLS",
        next: "endpoint_remove_fee_carrier_missed",
        icon: "fa-solid fa-circle-xmark",
        desc: "REMOVE REDELIVERY FEE (carrier missed requirement)."
      },
      {
        label: "Calls WERE made",
        next: "endpoint_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "VALID REDELIVERY FEE."
      }
    ]
  },

  /* =========================================================================
     FINAL ENDPOINTS (The final destinations with no further choices)
     ========================================================================= */

  endpoint_fee_not_valid: {
    text: "Redelivery fee is Not Valid",
    help: "Process complete. The fee cannot be applied based on BOL closure terms.",
    choices: []
  },

  endpoint_fee_valid: {
    text: "Valid Redelivery Fee",
    help: "Process complete. The redelivery fee stands and is valid to charge.",
    choices: []
  },

  endpoint_remove_fee_fedex: {
    text: "Remove Redelivery Fee (FedEx Failure)",
    help: "Process complete. Waive the fee due to scheduling/appointment failures on FedEx's end.",
    choices: []
  },

  endpoint_remove_fee_carrier_missed: {
    text: "REMOVE REDELIVERY FEE (carrier missed requirement)",
    help: "Process complete. Waive the fee because the carrier failed to fulfill required pre-calls.",
    choices: []
  },

  /* =========================================================================
     REDELIVERY DECISION TREE NODES: ARRIVAL/DEPARTURE TIME MISSING FLOW
     ========================================================================= */

  redelivery_arrival_departure_missing: {
    text: "Is Arrival/Departure time missing?",
    help: "Check if the arrival or departure timestamps are missing from the delivery records.",
    choices: [
      {
        label: "NO",
        next: "endpoint_review_further_pro",
        icon: "fa-solid fa-circle-xmark",
        desc: "Review further why there is Redeliver Fee billed on PRO."
      },
      {
        label: "YES",
        next: "redelivery_check_required_sources",
        icon: "fa-solid fa-check-circle",
        desc: "Do NOT remove fee immediately. Proceed to check required sources."
      }
    ]
  },

  redelivery_check_required_sources: {
    text: "Were delivery attempt details found in ANY of these sources?",
    noteHtml: "Check required sources (ALL 3):<br></br>1. Delivery Receipt (DR)<br></br>2. EDM Images (Cargo Care - Freight Returned Form)<br></br>3. Shipment Inquiry (History & Comments)\n\nWere delivery attempt details found in ANY of these sources?",
    help: "Thoroughly review the DR, EDM Images, and Shipment Inquiry logs for any attempt records.",
    choices: [
      {
        label: "YES",
        next: "redelivery_proof_of_first_attempt",
        icon: "fa-solid fa-check-circle",
        desc: "Details found. Proceed to verify proof of first delivery attempt."
      },
      {
        label: "NO",
        next: "endpoint_reach_out_service_center",
        icon: "fa-solid fa-circle-xmark",
        desc: "No details found. Reach out to service center for further information."
      }
    ]
  },

  redelivery_proof_of_first_attempt: {
    text: "Is there proof of first delivery attempt (date/time/activity)?",
    help: "Confirm if specific details regarding the first attempt's date, time, and activity are present.",
    choices: [
      {
        label: "YES",
        next: "endpoint_fee_is_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Redelivery Fee is VALID."
      },
      {
        label: "NO",
        next: "endpoint_reach_out_service_center",
        icon: "fa-solid fa-circle-xmark",
        desc: "No valid proof. Reach out to service center for further information."
      }
    ]
  },

  endpoint_review_further_pro: {
    text: "Review further why there is Redeliver Fee billed on PRO",
    help: "Process complete. Timestamps are present; investigate alternative reasons for the billed fee.",
    choices: []
  },

  endpoint_reach_out_service_center: {
    text: "Reach out to service center for further information regarding 1st redelivery attempt.",
    help: "Process complete. Insufficient documentation found internally; contact the service center to verify the attempt details.",
    choices: []
  },

  endpoint_fee_is_valid: {
    text: "Redelivery Fee is VALID",
    help: "Process complete. Valid proof of the first delivery attempt has been confirmed.",
    choices: []
  },

  /* =========================================================================
     REDELIVERY DECISION TREE NODES: STATE OF EMERGENCY FLOW
     ========================================================================= */

  redelivery_soe_failure_reason: {
    text: "State of Emergency\n\nWhat was the reason for failure in 2nd attempt?",
    help: "Identify the logged reason for the second delivery failure during a State of Emergency.",
    choices: [
      {
        label: "Closed Today (Fee initially applied)",
        next: "redelivery_soe_bol_restrictions",
        icon: "fa-solid fa-circle-exmark",
        desc: "Reason is 'Closed Today'. Proceed to check BOL restrictions."
      }
    ]
  },

  redelivery_soe_bol_restrictions: {
    text: "Does BOL state delivery restrictions?",
    help: "Check the Bill of Lading documentation for any specific delivery limitations or schedule limits.",
    choices: [
      {
        label: "NO",
        next: "endpoint_soe_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Valid Redelivery Fee."
      },
      {
        label: "YES",
        next: "redelivery_soe_restricted_day_check",
        icon: "fa-solid fa-arrow-down",
        desc: "End of Week Deliveries are not permitted. Check the attempt day."
      }
    ]
  },

  redelivery_soe_restricted_day_check: {
    text: "End of Week Deliveries are not permitted.\n\nWas the delivery attempted on a restricted day?",
    help: "Cross-reference the actual second delivery attempt date against the restrictions noted on the BOL.",
    choices: [
      {
        label: "YES",
        next: "endpoint_soe_fee_not_valid",
        icon: "fa-solid fa-circle-xmark",
        desc: "Redelivery fee is Not Valid."
      },
      {
        label: "NO",
        next: "endpoint_soe_fee_valid",
        icon: "fa-solid fa-check-circle",
        desc: "Valid Redelivery Fee."
      }
    ]
  },

  endpoint_soe_fee_valid: {
    text: "Valid Redelivery Fee",
    help: "Process complete. The redelivery fee stands and is valid to charge because restrictions were either absent or followed properly.",
    choices: []
  },

  endpoint_soe_fee_not_valid: {
    text: "Redelivery fee is Not Valid",
    help: "Process complete. The fee cannot be applied because the delivery attempt violated the BOL's schedule restrictions.",
    choices: []
  },

  /* =========================================================================
     MASTER REDELIVERY DECISION TREE: CARRIER FAILURE / WEATHER / HOLIDAYS FLOW
     ========================================================================= */

  redelivery_failure_reason_root: {
    text: "Was failure reason 'Carrier Related Failure' or 'Weather'?",
    help: "Select the primary high-level failure reason logged for this shipment.",
    choices: [
      {
        label: "YES",
        next: "endpoint_removed_the_redelivery_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Removed the Redelivery Fee."
      },
      {
        label: "NO",
        next: "redelivery_us_official_holiday_check",
        icon: "fa-solid fa-arrow-right",
        desc: "Proceed to check for US Official Holidays."
      },
      {
        label: "NO, but weather may have impacted the shipment.",
        next: "redelivery_active_weather_disruption_check",
        icon: "fa-solid fa-cloud-sun-rain",
        desc: "Proceed to the weather impact verification branch."
      }
    ]
  },

  /* =========================================================================
     HOLIDAY BRANCHES
     ========================================================================= */

  redelivery_us_official_holiday_check: {
    text: "Was attempt made on a US Official Holiday?",
    help: "Verify if the delivery attempt fell on a major recognized US federal holiday.",
    choices: [
      {
        label: "YES",
        next: "redelivery_same_holiday_date_check",
        icon: "fa-solid fa-calendar-day",
        desc: "Check if delivery was completed on the same holiday date."
      },
      {
        label: "NO",
        next: "redelivery_other_holidays_check",
        icon: "fa-solid fa-calendar-minus",
        desc: "Check for secondary or regional holidays."
      }
    ]
  },

  redelivery_same_holiday_date_check: {
    text: "Was delivery completed on SAME holiday date?",
    help: "Check if the carrier managed to fulfill the shipment despite the holiday.",
    choices: [
      {
        label: "YES",
        next: "endpoint_remove_redelivery_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove redelivery fee."
      },
      {
        label: "NO",
        next: "endpoint_decline_removal_closure",
        icon: "fa-solid fa-ban",
        desc: "Decline removal (customer should notify closure)."
      }
    ]
  },

  redelivery_other_holidays_check: {
    text: "Is reason related to OTHER holidays (MLK-Martin Luther King, Jr, Washington's, Juneteenth, Columbus, Veterans)?",
    help: "Check if the delivery date matches these specific non-peak public holidays.",
    choices: [
      {
        label: "YES",
        next: "redelivery_government_facility_check",
        icon: "fa-solid fa-building-columns",
        desc: "Check if target is a government facility."
      },
      {
        label: "NO",
        next: "redelivery_original_consignee_address_check",
        icon: "fa-solid fa-arrow-down",
        desc: "Proceed to check original consignee address alignment."
      }
    ]
  },

  redelivery_government_facility_check: {
    text: "Is consignee a Government Facility? (School / Bank / Military Base / Prison)",
    help: "Identify if the delivery point is a state or federal entity affected by holiday closures.",
    choices: [
      {
        label: "YES",
        next: "endpoint_remove_redelivery_fee",
        icon: "fa-solid fa-circle-xmark",
        desc: "Remove redelivery fee."
      },
      {
        label: "NO",
        next: "redelivery_review_further_cc_bl_dr1",
        icon: "fa-solid fa-magnifying-glass",
        desc: "Proceed to review documents imaged under CC/BL/DR."
      }
    ]
  },

  redelivery_review_further_cc_bl_dr: {
    text: "Check supporting documents:<br></br> • Weekly Calendar <br></br>• Appointment (APPT) Comments<br></br> • BOL / Customer Profile",
    help: "Look up imaged documents under CC, BL, or DR for this account.",
    choices: [
      {
        label: "CONTINUE",
        next: "redelivery_justification_check",
        icon: "fa-solid fa-arrow-down",
        desc: "Proceed to check if there is a valid justification."
      }
    ]
  },

  redelivery_review_further_cc_bl_dr1: {
    text: "Review further check documents imaged under CC/BL/DR",
    help: "Look up imaged documents under CC, BL, or DR for this account.",
    choices: []
  },

  /* =========================================================================
     CONSIGNEE ADDRESS MATCHING & VERIFICATION BRANCH
     ========================================================================= */

  redelivery_original_consignee_address_check: {
    text: "Was shipment delivered to original consignee address?",
    help: "Validate if the package location matched the intended original shipment target.",
    choices: [
      {
        label: "YES",
        next: "redelivery_check_supporting_docs",
        icon: "fa-solid fa-check-circle",
        desc: "Proceed to check supporting calendar and profile documents."
      },
      {
        label: "NO",
        next: "redelivery_consignee_responsible_check",
        icon: "fa-solid fa-circle-xmark",
        desc: "Review if it is a Reconsigned, Returned to shipper, or Incorrect BOL situation."
      }
    ]
  },

  redelivery_check_supporting_docs: {
    text: "Check supporting documents:\n• Weekly Calendar\n• Appointment (APPT) Comments\n• BOL / Customer Profile",
    help: "Review the schedule, appointment logs, and customer baseline profile.",
    choices: [
      {
        label: "CONTINUE",
        next: "redelivery_justification_check",
        icon: "fa-solid fa-arrow-down",
        desc: "Proceed to check if there is a valid justification."
      }
    ]
  },

  redelivery_justification_check: {
    text: "Is it a valid justification for redelivery?",
    help: "Determine if the evidence from the documents justifies a valid charge.",
    choices: [
      {
        label: "YES",
        next: "endpoint_fee_valid_advise_customer",
        icon: "fa-solid fa-check-circle",
        desc: "Redelivery fee VALID, advise the customer accordingly."
      },
      {
        label: "NO",
        next: "redelivery_picked_up_at_dock_check",
        icon: "fa-solid fa-boxes-stacked",
        desc: "Check if the cargo was picked up at the dock instead."
      }
    ]
  },

  redelivery_picked_up_at_dock_check: {
    text: "Was shipment picked up at Dock (DPU)?",
    help: "Verify if the customer retrieved the payload on-site via Dock Pickup.",
    choices: [
      {
        label: "YES",
        next: "endpoint_remove_fee_add_dpu_keyword",
        icon: "fa-solid fa-keyboard",
        desc: "Remove fee + Add 'DPU' keyword."
      },
      {
        label: "NO",
        next: "endpoint_fee_not_valid",
        icon: "fa-solid fa-circle-xmark",
        desc: "Redelivery fee NOT valid."
      }
    ]
  },

  redelivery_consignee_responsible_check: {
    text: "Review if it is a:\n• Reconsigned?\n• Returned to shipper?\n• Incorrect BOL?\n\nIs the consignee responsible for the Redelivery Fee?",
    help: "Determine assigning liability metrics based on address deviations.",
    choices: [
      {
        label: "YES",
        next: "endpoint_no_fee_will_apply",
        icon: "fa-solid fa-circle-minus",
        desc: "No redelivery fee will apply."
      },
      {
        label: "NO",
        next: "endpoint_fee_may_apply",
        icon: "fa-solid fa-circle-exclamation",
        desc: "Redelivery fee may apply."
      }
    ]
  },

  /* =========================================================================
     WEATHER BRANCH
     ========================================================================= */

  redelivery_active_weather_disruption_check: {
    text: "Is there an active weather disruption? (e.g., storm, snow, hurricane alert)",
    help: "Check global/regional climate disruptions active on the date of attempt.",
    choices: [
      {
        label: "YES",
        next: "redelivery_attempt_impacted_by_weather_check",
        icon: "fa-solid fa-bolt",
        desc: "Proceed to verify specific weather impacts on the delivery."
      },
      {
        label: "NO",
        next: "endpoint_fee_valid_advise_customer",
        icon: "fa-solid fa-check-circle",
        desc: "Redelivery fee VALID, advise the customer accordingly."
      }
    ]
  },

  redelivery_attempt_impacted_by_weather_check: {
    text: "Was the delivery attempt impacted or failed due to weather?",
    help: "Confirm if transit was physically stopped by weather conditions.",
    choices: [
      {
        label: "NO",
        next: "endpoint_fee_valid_advise_customer",
        icon: "fa-solid fa-check-circle",
        desc: "Redelivery fee VALID, advise the customer accordingly."
      },
      {
        label: "YES",
        next: "redelivery_official_weather_confirmation_check",
        icon: "fa-solid fa-triangle-exclamation",
        desc: "Check for official emergency notifications."
      }
    ]
  },

  redelivery_official_weather_confirmation_check: {
    text: "Is there official confirmation? (e.g., carrier update, local advisory, internal alert (Wireless Emergency Alerts))",
    help: "Look for localized warning logs confirming regional hazardous traffic or operation limits.",
    choices: [
      {
        label: "YES",
        next: "redelivery_customer_notified_weather_check",
        icon: "fa-solid fa-comment-dots",
        desc: "Verify customer notification status."
      },
      {
        label: "NO",
        next: "endpoint_fee_valid_advise_customer",
        icon: "fa-solid fa-check-circle",
        desc: "Redelivery fee VALID, advise the customer accordingly."
      }
    ]
  },

  redelivery_customer_notified_weather_check: {
    text: "Was the customer notified of the delay?",
    help: "Check communications to verify out-bound automated or manual advisory updates.",
    choices: [
      {
        label: "YES",
        next: "endpoint_removed_redelivery_fee_weather",
        icon: "fa-solid fa-circle-xmark",
        desc: "Removed redelivery fee."
      },
      {
        label: "NO",
        next: "redelivery_policy_notification_required_check",
        icon: "fa-solid fa-shield-halved",
        desc: "Verify if policy mandate requires notification."
      }
    ]
  },

  redelivery_policy_notification_required_check: {
    text: "Is notification required per policy?",
    help: "Cross-reference account terms to see if failing to notify waives the exception loop.",
    choices: [
      {
        label: "YES",
        next: "endpoint_waived_redelivery_fee",
        icon: "fa-solid fa-handshake-angle",
        desc: "Waived redelivery fee."
      },
      {
        label: "NO",
        next: "endpoint_remove_fee_weather_exception",
        icon: "fa-solid fa-cloud",
        desc: "Removed redelivery fee (Weather Exemption)."
      }
    ]
  },

  /* =========================================================================
     TERMINAL ENDPOINTS (The final destinations with no choices)
     ========================================================================= */

  endpoint_removed_the_redelivery_fee: {
    text: "Removed the Redelivery Fee",
    help: "Process complete. Billed amount removed directly under early carrier/weather guidelines.",
    choices: []
  },

  endpoint_remove_redelivery_fee: {
    text: "Remove redelivery fee",
    help: "Process complete. Waived due to holiday conditions or government location exceptions.",
    choices: []
  },

  endpoint_decline_removal_closure: {
    text: "Decline removal (customer should notify closure)",
    help: "Process complete. Request rejected. Customer bears ownership to update closure indicators.",
    choices: []
  },

  endpoint_fee_valid_advise_customer: {
    text: "Redelivery fee VALID, advise the customer accordingly.",
    help: "Process complete. Standard fee validation sustained. Inform the primary account holder.",
    choices: []
  },

  endpoint_remove_fee_add_dpu_keyword: {
    text: "Remove fee + Add 'DPU' keyword",
    help: "Process complete. Waive standard billing metrics and note 'DPU' inside profile lines.",
    choices: []
  },

  endpoint_fee_not_valid: {
    text: "Redelivery fee NOT valid",
    help: "Process complete. The assessment criteria marked this charge invalid.",
    choices: []
  },

  endpoint_no_fee_will_apply: {
    text: "No redelivery fee will apply.",
    help: "Process complete. Balance adjusted; no active fee structural dependencies remains.",
    choices: []
  },

  endpoint_fee_may_apply: {
    text: "Redelivery fee may apply.",
    help: "Process complete. Forward to secondary verification; charges remain outstanding.",
    choices: []
  },

  endpoint_removed_redelivery_fee_weather: {
    text: "Removed redelivery fee",
    help: "Process complete. Waived due to documented weather factors paired with functional alerts.",
    choices: []
  },

  endpoint_waived_redelivery_fee: {
    text: "Waived redelivery fee",
    help: "Process complete. System policy terms force non-billing due to missing alert metrics.",
    choices: []
  },

  endpoint_remove_fee_weather_exception: {
    text: "Removed redelivery fee (Weather Exemption)",
    help: "Process complete. Standard weather baseline application applied successfully.",
    choices: []
  },

  /* =========================================================================
     NEW BRANCH A: FREIGHT ON TRAILER STATUS FLOW
     ========================================================================= */

  redelivery_freight_on_trailer_check: {
    text: "Was freight actually on the trailer/truck during delivery attempt?",
    help: "Verify truck capacity and physical shipment presence at the time of the attempt.",
    choices: [
      {
        label: "YES",
        next: "endpoint_freight_remove_fee_fedex_fault",
        icon: "fa-solid fa-check-circle",
        desc: "Confirm to the Service center if no Freight on the trailer is FedEx Fault."
      },
      {
        label: "NO",
        next: "endpoint_freight_evaluate_other_scenario",
        icon: "fa-solid fa-circle-xmark",
        desc: "Evaluate other scenario / process on why Redelivery fee is added to the Invoice."
      }
    ]
  },

  /* =========================================================================
     NEW BRANCH B: NO REASON NOTED FLOW
     ========================================================================= */

  redelivery_no_reason_noted_init: {
    text: "Was there no reason noted on those documents?",
    noteHtml: "Check documentation:<br></br>1. Cargo Care (CC) / EDM Images<br></br>2. Return Documents<br></br>3. Shipment History / Comments\n\n",
    help: "Cross-reference all 3 core trace sources to look for any missing log notations.",
    choices: [
      {
        label: "YES",
        next: "endpoint_nrn_reach_out_service_center",
        icon: "fa-solid fa-check-circle",
        desc: "Confirm validity requirements with the Service Center before proceeding."
      },
      {
        label: "NO",
        next: "endpoint_nrn_verify_reason_validity",
        icon: "fa-solid fa-circle-xmark",
        desc: "Verify whether the provided reason is valid."
      }
    ]
  },

  /* =========================================================================
     FINAL ENDPOINTS FOR BOTH NEW FLOWS
     ========================================================================= */

  endpoint_freight_remove_fee_fedex_fault: {
    text: "Confirm to the Service center if no Freight on the trailer is FedEx Fault. Remove Redelivery Fee",
    help: "Process complete. Confirm to the Service Center that no freight on the trailer constitutes a FedEx Fault, then remove the fee.",
    choices: []
  },

  endpoint_freight_evaluate_other_scenario: {
    text: "Evaluate other scenario / process on why Redelivery fee is added to the Invoice.",
    help: "Process complete. Route out of this flow to investigate alternate invoice billing reasons.",
    choices: []
  },

  endpoint_nrn_reach_out_service_center: {
    text: "Reach out to the Service Center and confirm whether the REDL is still considered valid even though the CC was not completed in full, provided that other supporting documentation, such as the email thread, is available, before removing the redelivery fee.",
    help: "Process complete. Perform manual verification via SC communications before clearing or approving balance adjustments.",
    choices: []
  },

  endpoint_nrn_verify_reason_validity: {
    text: "Verify whether the provided reason is valid; if it is confirmed to be valid, then redelivery fee is valid.",
    help: "Process complete. A reason was found. If it meets compliance rules, sustain the fee structure.",
    choices: []
  },

  /* ==================== TERMINAL NODES ==================== */

  redelivery_fee_valid: {
    text: "Redelivery Fee is valid. Advise the customer accordingly.",
    help: "The redelivery fee is valid based on the review. Advise the customer with the appropriate response.",
    choices: []
  },

  redelivery_remove_fee_fedex: {
    text: "FedEx Error - Removed Redelivery Fee.",
    help: "The redelivery fee is not valid due to FedEx/carrier error. Remove the fee.",
    choices: []
  },

  redelivery_remove_fee: {
    text: "Remove Redelivery Fee (Fee Not Valid).",
    help: "The redelivery fee is not valid. Remove the fee from the invoice.",
    choices: []
  }

};
