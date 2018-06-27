exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://local:local5555@ds121321.mlab.com:21321/reflect-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/reflectiveJournal-app-testDb';
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || 'THIS_MY_EXCAVATION';

exports.JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';