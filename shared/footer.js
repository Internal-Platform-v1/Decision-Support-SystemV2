/* SHARED FOOTER JS */
(function () {
  function trigger(action) {
    if (action === "feedback") {
      if (typeof window.openFeedbackModal === "function") return window.openFeedbackModal();
      if (typeof window.showFeedbackModal === "function") return window.showFeedbackModal();
      document.dispatchEvent(new CustomEvent("footer:feedback"));
      return;
    }

    if (action === "get-help") {
      if (typeof window.openGetHelpModal === "function") return window.openGetHelpModal();
      if (typeof window.showGetHelpModal === "function") return window.showGetHelpModal();
      document.dispatchEvent(new CustomEvent("footer:get-help"));
    }
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest(".footer-action[data-action]");
    if (button) trigger(button.dataset.action);
  });
})();
