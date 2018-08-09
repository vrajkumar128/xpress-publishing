// Convert a camelCased JSON key to snake_case
const snakeCaseKey = key => key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(); 

module.exports = snakeCaseKey;