// PM2 ecosystem configuration for production deployment
module.exports = {
  apps: [
    {
      name: "nasrplus-api",
      script: "./server.js",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
