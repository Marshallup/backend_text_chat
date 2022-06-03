module.exports = {
    formatExpressValidatorErrors(errors) {
        return {
            error: true,
            errors: errors.array().map(error => ({
                fieldID: error.param,
                message: error.msg,
            }))
        };
    }
}