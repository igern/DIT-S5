const AuthenticationRoutes = require('./Authenticate');
const ProfileRoutes = require('./Profile');
const ThreadRoutes = require('./Thread');
const CategoryRoutes = require('./Category');
const PostRoutes = require('./Post');

module.exports = function(app, db) {
    AuthenticationRoutes(app, db);
    ProfileRoutes(app, db);
    ThreadRoutes(app, db);
    CategoryRoutes(app, db);
    PostRoutes(app, db);
};