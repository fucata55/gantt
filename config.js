exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://admin:admin@ds241737.mlab.com:41737/gantt-project-management-database';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://admin:admin@ds113358.mlab.com:13358/gantt-project-management-test-database';
exports.PORT = process.env.PORT || 8097;
