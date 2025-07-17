console.log("emailtest lifecycles.js loaded!");

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    console.log("[DEBUG] emailtest afterCreate triggered:", result);

    // Example: send a test email to a hardcoded address
    try {
      await strapi.plugin('email').service('email').send({
        to: 'chandan@graybullsadvisors.com', // replace with your email for testing
        subject: 'EmailTest: New Entry Created',
        text: `A new emailtest entry was created: ${JSON.stringify(result, null, 2)}`,
      });
      console.log("[DEBUG] Test email sent from emailtest lifecycle.");
    } catch (err) {
      console.error("[ERROR] Failed to send test email from emailtest lifecycle:", err);
    }
  },
}; 