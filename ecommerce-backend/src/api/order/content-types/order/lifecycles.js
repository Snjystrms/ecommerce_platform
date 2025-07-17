console.log("Order lifecycles.js loaded");

module.exports = {
  async afterCreate(event) {
    console.log("[DEBUG] afterCreate event:", JSON.stringify(event, null, 2));
    const { result } = event;
    console.log("[DEBUG] Order afterCreate hook triggered", result);
    const {
      customerEmail,
      customerName,
      orderItems,
      total,
      payment_status,
      payment_method,
      transaction_date,
      id,
      shippingAddress
    } = result;
    console.log("[DEBUG] customerEmail in afterCreate:", customerEmail);

    // Build order items string
    const itemsList = Array.isArray(orderItems)
      ? orderItems.map(item =>
          `- ${item.productName || item.title || 'Product'} x${item.quantity} @ \u20b9${item.price}`
        ).join('\n')
      : '';

    // Prepare email payload
    const emailPayload = {
      to: customerEmail,
      subject: 'Thank you for your order!',
      text: `Hello ${customerName},\n\nThank you for ordering from us! Here are your order details:\n\nOrder ID: ${id}\nOrder Date: ${transaction_date}\nPayment Status: ${payment_status}\nPayment Method: ${payment_method}\nTotal: \u20b9${total}\nShipping Address: ${shippingAddress}\n\nItems:\n${itemsList}\n\nWe appreciate your business!\n\nBest regards,\nYour Shop Team`,
    };
    console.log("[DEBUG] Email payload:", emailPayload);

    // Send email
    try {
      const sendResult = await strapi.plugin('email').service('email').send(emailPayload);
      console.log("[DEBUG] Email send result:", sendResult);
    } catch (err) {
      console.error('[ERROR] Failed to send order confirmation email:', err);
      strapi.log.error('Failed to send order confirmation email:', err);
    }
  },
}; 