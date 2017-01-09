require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'EKA Technical Challenge',
    description: 'All the modern best practices in one example.',
    head: {
      titleTemplate: 'EKA Technical Challenge: %s',
      meta: [
        {name: 'description', content: 'All the modern best practices in one example.'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'EKA Technical Challenge'},
        {property: 'og:image', content: 'https://cdn0.iconfinder.com/data/icons/free-daily-icon-set/512/GlobeCycle-128.png'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'EKA Technical Challenge'},
        {property: 'og:description', content: 'All the modern best practices in one example.'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@lthai423'},
        {property: 'og:creator', content: '@lthai423'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
