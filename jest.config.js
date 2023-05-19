module.exports = {
    moduleNameMapper: {
        "^@src/configs/(.*)$": "<rootDir>/src/configs/$1",
        "^@v1/controllers/(.*)$": "<rootDir>/src/api/v1/controllers/$1",
        "^@v1/logs/(.*)$": "<rootDir>/src/api/v1/logs/$1",
        "^@v1/middlewares/(.*)$": "<rootDir>/src/api/v1/middlewares/$1",
        "^@v1/models/(.*)$": "<rootDir>/src/api/v1/models/$1",
        "^@v1/rest/(.*)$": "<rootDir>/src/api/v1/rest/$1",
        "^@v1/routes/(.*)$": "<rootDir>/src/api/v1/routes/$1",
        "^@v1/utils/(.*)$": "<rootDir>/src/api/v1/utils/$1",
        "^@v1/services/(.*)$": "<rootDir>/src/api/v1/services/$1",
        "^@v1/validations/(.*)$": "<rootDir>/src/api/v1/validations/$1"
    },
    // Other configs
}