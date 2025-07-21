export default {
  async bootstrap({ strapi }) {
    // EmailTest lifecycle
    // strapi.db.lifecycles.subscribe({
    //   models: ["api::emailtest.emailtest"],
    //   async afterCreate(event) {
    //     const { result } = event;
    //     strapi.log.info("[Bootstrap] emailtest afterCreate triggered", result.id);

    //     try {
    //       await strapi
    //         .plugin('email')
    //         .service('email')
    //         .send({
    //           to: 'chandan@graybullsadvisors.com',
    //           subject: 'EmailTest: New Entry Created',
    //           text: `New emailtest entry created:\n${JSON.stringify(result, null, 2)}`,
    //         });
    //       strapi.log.info("[Bootstrap] Test email sent");
    //     } catch (err) {
    //       strapi.log.error("[ERROR] Failed to send test email:", err);
    //     }
    //   },
    // });

    // Order lifecycle
    strapi.db.lifecycles.subscribe({
      models: ["api::order.order"],
      async afterCreate(event) {
        const { result } = event;
        strapi.log.info("[Bootstrap] order afterCreate triggered", result.id);

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

        // Build order items string
        const itemsList = Array.isArray(orderItems)
          ? orderItems.map(item =>
              `- ${item.productName || item.title || 'Product'} x${item.quantity} @ 9${item.price}`
            ).join('\n')
          : '';

        // Prepare email payload
        const emailPayload = {
          to: customerEmail,
          subject: 'Thank you for your order!',
          text: `Hello ${customerName},\n\nThank you for ordering from us! Here are your order details:\n\nOrder ID: ${id}\nOrder Date: ${transaction_date}\nPayment Status: ${payment_status}\nPayment Method: ${payment_method}\nTotal: 9${total}\nShipping Address: ${shippingAddress}\n\nItems:\n${itemsList}\n\nWe appreciate your business!\n\nBest regards,\nYour Shop Team`,
        };
        strapi.log.info("[Bootstrap] Order email payload:", emailPayload);

        // Send email
        try {
          await strapi.plugin('email').service('email').send(emailPayload);
          strapi.log.info("[Bootstrap] Order confirmation email sent");
        } catch (err) {
          strapi.log.error('[ERROR] Failed to send order confirmation email:', err);
        }
      },
    });
  },
};
