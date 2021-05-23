/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/es-syntax */
export default {
    URI: process.env.MONGODB_URI || 'localhost:27017',
    NAME: process.env.MONGODB_NAME || 'db',
    OPTIONS: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}
