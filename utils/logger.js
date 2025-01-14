const logger = {
    info: (message, ...args) => {
        console.log(new Date().toISOString(), 'INFO:', message, ...args);
    },
    error: (message, ...args) => {
        console.error(new Date().toISOString(), 'ERROR:', message, ...args);
    },
    debug: (message, ...args) => {
        console.debug(new Date().toISOString(), 'DEBUG:', message, ...args);
    }
};

module.exports = logger; 