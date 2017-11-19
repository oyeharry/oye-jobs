'use strict';

// @ngInject
export function AuthService($location, $http, $cookies, $q, User) {
  var currentUser = {
    id: '',
    name: '',
    email: '',
    role: '',
    $promise: undefined
  };

  if ($cookies.get('token') && $location.path() !== '/logout') {
    currentUser = User.get();
  }

  var Auth = {
    /**
     * Login user and save token
     * @param  {String} options.email    Email
     * @param  {String} options.password Password
     * @return {Promise}
     */
    login({ email, password }) {
      return $http
        .post('/auth/local', {
          email,
          password
        })
        .then(res => {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
        });
    },

    /**
     * Delete accesss token and user info
     *
     */
    logout() {
      currentUser = {};
      $cookies.remove('token');
    },

    reloadCurrentUser() {
      return User.get().$promise.then(user => {
        currentUser = user;
        return user;
      });
    },

    /**
     * Update user
     * @param  {Object} user
     * @return {Promise}
     */
    updateUser(user) {
      return User.update({ id: 'me' }, user, () => {
        return this.reloadCurrentUser();
      }).$promise;
    },

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @return {Promise}
     */
    createUser(user) {
      return User.save(user, function(data) {
        $cookies.put('token', data.token);
        currentUser = User.get();
      }).$promise;
    },

    /**
     * Get all available information of logged in user
     * @return {Promise}
     */
    getCurrentUserAsync() {
      var user = currentUser.$promise || currentUser;
      return $q.when(user);
    },

    /**
     * Gets all available info on a user
     *
     * @return {Object}
     */
    getCurrentUser() {
      return currentUser;
    },

    /**
     * Check if user is logged in
     * @return {Boolean} [description]
     */
    isLoggedInAsync() {
      return this.getCurrentUserAsync().then(user => {
        return !!user.role;
      });
    },

    /**
     * Check if a user is logged in
     *
     * @return {Bool}
     */
    isLoggedIn() {
      return !!currentUser.role;
    },

    // check scope with logical conditions
    verifyScope(scope, user) {
      if (scope.indexOf('|') !== -1) {
        let scopes = scope.split('|');
        let filterScopes = scopes.filter(scope => {
          return user.role.scopes.indexOf(scope) !== -1;
        });
        return !!filterScopes.length;
      } else if (scope.indexOf('&') !== -1) {
        let scopes = scope.split('&');
        let filterScopes = scopes.filter(scope => {
          return user.role.scopes.indexOf(scope) === -1;
        });
        return !filterScopes.length;
      } else {
        return user.role.scopes.indexOf(scope) !== -1;
      }
    },

    /**
     * Check if user has required scope
     * @param  {String}  scope scope value
     * @return {Promise}
     */
    hasScopeAsync(scope) {
      return this.getCurrentUserAsync().then(user => {
        return !!(user.role && this.verifyScope(scope, user));
      });
    },

    /**
     * Check if a user has a specified scope
     *
     * @param  {String} scope - the scope to check against
     * @return {Bool}
     */
    hasScope(scope) {
      return !!(currentUser.role && this.verifyScope(scope, currentUser));
    },

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
      return $cookies.get('token');
    },

    /**
     * Add job for user
     * @param {Object} job job detail object
     */
    addJob(job) {
      currentUser.jobs.push({ id: job.id });
      return this.updateUser(currentUser);
    },

    /**
     * Remove job from user
     * @param  {Object} job job detail object
     * @return {Promise}
     */
    removeJob(job) {
      currentUser.jobs
        .filter(j => job.id === j.id)
        .map(j => currentUser.jobs.indexOf(j))
        .forEach(i => currentUser.jobs.splice(i, 1));

      return this.updateUser(currentUser);
    },

    /**
     * Check if user has specified job
     * @param  {Object}  job job detail to check
     * @return {Boolean}
     */
    hasJob(job) {
      return !!(
        currentUser.jobs &&
        currentUser.jobs.filter(userJob => userJob.id === job.id).length
      );
    },

    /**
     * Check if requested user is same as login user and return me or requested
     *  user id for API request
     * @param  {String} id Loaded user id of view
     * @return {String}    return API id
     */
    getApiUserId(id) {
      return currentUser.id === id ? 'me' : id;
    }
  };

  return Auth;
}
