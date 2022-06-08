const Socket = require('../socket');
const { formatExpressValidatorErrors } = require('../services/formValidation');

class UserService {
    checkSocket(username) {
        const existsSockets = Socket.getAllSocketsWithData();

        if (existsSockets.find(socketData => socketData.data.username === username)) {
            throw formatExpressValidatorErrors({ array() {
                return [
                    {
                        param: 'username',
                        msg: `Логин ${username} уже занят!`,
                    }

                ]
            } });
        }
    }
}

module.exports = new UserService();