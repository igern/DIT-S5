const ProfileRoutes = require('./Profile');
const ThreadRoutes = require('./Thread');
const CategoryRoutes = require('./Category');
const PostRoutes = require('./Post');
const SubscribeRoutes = require('./Subscribe');

module.exports = function(app, db) {
    ProfileRoutes(app, db);
    ThreadRoutes(app, db);
    CategoryRoutes(app, db);
    PostRoutes(app, db);
    SubscribeRoutes(app, db);
};