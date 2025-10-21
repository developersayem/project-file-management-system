export default {
  apps: [
    {
      name: 'FMS-API',
      script: './dist/index.js',   // fix if needed
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 30004               // must match server port
      }
    }
  ]
};