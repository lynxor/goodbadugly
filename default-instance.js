module.exports = {
    dbUrl:"localhost:27017/gbu",
    port:(process.env.VMC_APP_PORT || 8080),
    host: (process.env.VCAP_APP_HOST || 'localhost')
};