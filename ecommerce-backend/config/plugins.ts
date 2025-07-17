export default ({ env }) => ({
  meilisearch: {
    config: {
      host: 'http://localhost:7700',
      apiKey: 'AlJih_duUVWnA1Dzp-2Y8poxdaaHnjET5TyLjuJWJFg',
    },
  },
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('DEFAULT_FROM_EMAIL'), // e.g., verified sender from SendGrid
        defaultReplyTo: env('DEFAULT_FROM_EMAIL'),
      },
    },
  },
});
