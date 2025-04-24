const { ObjectID } = require('mongodb');

const getString = value => (value || '').toString();

const getDateIfValid = (value, def = null) => {
	const date = Date.parse(value);
	return isNaN(date) ? def : new Date(date);
};

const getArrayIfValid = value => (Array.isArray(value) ? value : null);

const getObjectIDIfValid = value =>
	ObjectID.isValid(value) ? new ObjectID(value) : null;

const getArrayOfObjectID = value => {
	if (Array.isArray(value) && value.length > 0) {
		return value.map(id => getObjectIDIfValid(id)).filter(id => !!id);
	}
	return [];
};

const isNumber = value => !isNaN(parseFloat(value)) && isFinite(value);

const getNumberIfValid = (value, defaultValue = null) => (isNumber(value) ? parseFloat(value) : defaultValue);

const getNumberIfPositive = value => {
	const n = getNumberIfValid(value);
	return n && n >= 0 ? n : null;
};

const numFixded = (value, fix=2) => {
	if(isNumber(value)) {
		let _num = Number.parseFloat(value).toFixed(fix);
		return Number(_num);
	}
	return 0;
  }

const getBooleanIfValid = (value, defaultValue = null) => {
	if (value === 'true' || value === 'false') {
		return value === 'true';
	}
	return typeof value === 'boolean' ? value : defaultValue;
};

module.exports = {
	getString,
	getObjectIDIfValid,
	getDateIfValid,
	getArrayIfValid,
	getArrayOfObjectID,
	getNumberIfValid,
	getNumberIfPositive,
	numFixded,
	getBooleanIfValid,
};
