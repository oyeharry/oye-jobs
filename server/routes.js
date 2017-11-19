'use strict';

export default function(app) {
  var env = app.get('env');

  app.use('/api/users', require('./api/user').default);
  app.use('/api/roles', require('./api/role').default);
  app.use('/api/scopes', require('./api/scope').default);
  app.use('/api/jobs', require('./api/job').default);
  app.use('/api/locations', require('./api/location').default);
  app.use('/api/job-types', require('./api/job-type').default);
  app.use('/api/job-domains', require('./api/job-domain').default);
  app.use('/api/education', require('./api/education').default);
  app.use('/api/experiences', require('./api/experience').default);

  app.use('/auth', require('./auth').default);

  app.use(function(err, req, res, next) {
    if (env === 'production') {
      let response = { message: 'Something went wrong on server.' };
      res.status(err.status || 500).json(response);
    } else {
      next(err);
    }
  });

  //all undefined components, client, images should return 404
  app
    .route('/:url(api|auth|client|assets|styles|src)/*')
    .get(function(req, res) {
      res.status(404).send('Sorry, URL does not exist.');
    });

  // All other routes should redirect to the index.html
  app.route('/*').get(function(req, res) {
    res.sendFile('/index.html', {
      root: app.get('appPath')
    });
  });
}
