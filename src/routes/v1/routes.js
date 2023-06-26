const moduleRoutes = require('./module.route');
const roleRoutes = require('./role.route');
const authRoutes = require('./auth.route');
const express = require('express');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/modules',
    route: moduleRoutes,
  },
  {
    path: '/roles',
    route: roleRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
