exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://walke954:Gbbaa4fdm32@ds229690.mlab.com:29690/recipe-app-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/recipe-app-testDb';
exports.PORT = process.env.PORT || 8080;