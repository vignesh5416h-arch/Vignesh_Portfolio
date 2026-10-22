
const { insertMessage } = require("../database/db");

function submitContact(req, res, next) {
  try {
    const { name, email, subject, message, website } = req.body || {};

    // Honeypot: silently accept bot submissions without storing them.
    if (typeof website === "string" && website.trim()) {
      return res.status(200).json({
        message: "Your message was submitted successfully."
      });
    }

    const fields = { name, email, subject, message };

    for (const [field, value] of Object.entries(fields)) {
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          message: `Please provide a valid ${field}.`
        });
      }
    }

    const clean = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    };

    if (clean.name.length < 2 || clean.name.length > 80) {
      return res.status(400).json({
        message: "Name must be between 2 and 80 characters."
      });
    }

    if (
      clean.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)
    ) {
      return res.status(400).json({
        message: "Please provide a valid email address."
      });
    }

    if (clean.subject.length < 3 || clean.subject.length > 120) {
      return res.status(400).json({
        message: "Subject must be between 3 and 120 characters."
      });
    }

    if (clean.message.length < 10 || clean.message.length > 3000) {
      return res.status(400).json({
        message: "Message must be between 10 and 3000 characters."
      });
    }

    insertMessage.run(clean);

    return res.status(201).json({
      message: "Your message was submitted successfully."
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { submitContact };
