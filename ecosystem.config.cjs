module.exports = {
  apps: [
    {
      name: 'nikitakarnaukhov',
      script: 'npm',
      args: 'run start -- -p 5177',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: ['dist'],
      watch_delay: 3000,
      ignore_watch: ['node_modules'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
