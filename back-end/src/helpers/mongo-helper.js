const ObjectId = require('mongodb').ObjectId;

const validObjectId = (id) => {
    if (id && ObjectId.isValid(id)) {
        return true;
    }
    return false;
};

module.exports = {
	validObjectId
};
