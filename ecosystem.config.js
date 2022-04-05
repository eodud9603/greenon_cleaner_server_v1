module.exports = {
   apps: [
      {
         name: 'greenon-middleware',
         script: './dist/main.js',
         watch: true,
         // ignore_watch: ['node_modules', 'public'],
         // env: {
         //    'NODE_ENV': 'production',
         //    'PORT': 5000
         // }
      }
   ]
}