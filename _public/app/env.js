(function (window) {
  window.__env = window.__env || {};

  // API url
  // For demo purposes we fetch from local file in this plunk
  // In your application this can be a url like https://api.github.com
  //window.__env.apiUrl = '';
  //window.__env.apiUrl = '/expeditor';
  window.__env.apiUrl = '.';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
}(this));
