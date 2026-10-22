
"use strict";

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const submitButton = document.getElementById("contact-submit");
  const statusMessage = document.getElementById("form-status");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);

    // Basic client-side spam-trap check.
    if (String(formData.get("website") || "").trim() !== "") {
      statusMessage.textContent = "Unable to submit this message.";
      statusMessage.className = "form-status error";
      return;
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim()
    };

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    statusMessage.textContent = "Sending your message...";
    statusMessage.className = "form-status";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Message could not be sent. Please try again later."
        );
      }

      statusMessage.textContent =
        result.message || "Your message was sent successfully.";
      statusMessage.className = "form-status success";
      contactForm.reset();
    } catch (error) {
      statusMessage.textContent =
        error.message || "Unable to connect. Please try again later.";
      statusMessage.className = "form-status error";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });
}
