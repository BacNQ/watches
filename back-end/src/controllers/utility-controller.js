const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;

const ProvinceModel = require('../models/utility/province');
const DistrictModel = require('../models/utility/district');
const WardModel = require('../models/utility/ward');
const ContriesModel = require('../models/utility/countries');
const StatesModel = require('../models/utility/states');
const CitiesdModel = require('../models/utility/cities');

const { validObjectId } = require('../helpers/mongo-helper');

module.exports.getProvinces = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {
        };
        if (search) {
            let keyword = search.trim();
            if (keyword) {
                keyword = keyword.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
                let regSearch = new RegExp(keyword, 'i');
                query.$or = [
                    { name: regSearch }
                ];
            }
        }
        let data = await ProvinceModel.find(query).sort({ "created_date": -1 })
        if (data) {
            return res.send({
                code: 1,
                message: 'Get data successful!',
                data: data
            }).status(200)
        }
        return res.send({
            code: 1,
            message: 'Get data successful!',
            data: {}
        }).status(200)
    } catch (error) {
        return res.send({
            code: 0,
            message: 'Error!',
            data: {}
        }).status(200)
    }
}

module.exports.createProvince = async (req, res) => {
    try {
        const payload = req.body;
        if (payload.id && payload.name && payload.type) {
            const exist = await ProvinceModel.findOne({ id: payload.id }).exec();
            if (exist) {
                return res.status(400).send({ code: 0, message: "Tỉnh này đã tồn tại!", error: "error" }).end();
            } else {
                const province = new ProvinceModel(payload);
                let result = await province.save();
                return res.send({ code: 1, message: 'success', data: result }).status(200);
            }
        } else {
            return res.status(400).send({ code: 0, message: "Dữ liệu thêm Tỉnh chưa đầy đủ", error: "error" }).end();
        }
    } catch (error) {
        res.boom.badRequest(error);
    }
};

module.exports.updateProvince = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        ProvinceModel.updateOne({ _id: new ObjectId(id) }, { $set: payload }).then((result) => {
            if (result) {
                return res.send({ code: 1, message: 'success', data: result }).status(200);
            }
            return res.status(400).send({ code: 0, message: "Cập nhập Tỉnh thất bại", error: "error" }).end();
        })
    } catch (error) {
        res.boom.badRequest(error);
    }
};

module.exports.removeProvince = async (req, res) => {
    try {
        const { id } = req.params;
        if (id && validObjectId(id)) {
            ProvinceModel.updateOne(
                { _id: new ObjectId(id) },
                { deleted: true },
                (err, result) => {
                    if (err)
                        return res.send({ code: 0, message: "failed", error: err }).end();
                    return res.send({ code: 1, message: "success", data: result }).end();
                }
            );
        } else {
            res.send({ code: 0, message: "Id not exists or not valid" });
        }
    } catch (error) {
        res.boom.badRequest(error);
    }
};

module.exports.createDistrict = async (req, res) => {
    try {
        const payload = req.body;
        if (payload.id && payload.name && payload.type) {
            const exist = await DistrictModel.findOne({ id: payload.id }).exec();
            if (exist) {
                return res.status(400).send({ code: 0, message: "Huyện này đã tồn tại!", error: "error" }).end();
            } else {
                const province = new DistrictModel(payload);
                let result = await province.save();
                return res.send({ code: 1, message: 'success', data: result }).status(200);
            }
        } else {
            return res.status(400).send({ code: 0, message: "Dữ liệu thêm Huyện chưa đầy đủ", error: "error" }).end();
        }
    } catch (error) {
        res.boom.badRequest(error);
    }
};

module.exports.updateDistrict = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        DistrictModel.updateOne({ _id: new ObjectId(id) }, { $set: payload }).then((result) => {
            if (result) {
                return res.send({ code: 1, message: 'success', data: result }).status(200);
            }
            return res.status(400).send({ code: 0, message: "Cập nhập Huyện thất bại", error: "error" }).end();
        })
    } catch (error) {
        res.boom.badRequest(error);
    }
};

module.exports.removeDistrict = async (req, res) => {
    try {
        const { id } = req.params;
        if (id && validObjectId(id)) {
            DistrictModel.updateOne(
                { _id: new ObjectId(id) },
                { deleted: true },
                (err, result) => {
                    if (err)
                        return res.send({ code: 0, message: "failed", error: err }).end();
                    return res.send({ code: 1, message: "success", data: result }).end();
                }
            );
        } else {
            res.send({ code: 0, message: "Id not exists or not valid" });
        }
    } catch (error) {
        res.boom.badRequest(error);
    }
};

module.exports.getDistrict = async (req, res) => {
    try {
        const { id } = req.params
        // , deleted: false
        let data = await DistrictModel.find({ "provinceId": Number(id) }).sort({ "name": 1 })
        if (data) {
            return res.send({
                code: 1,
                message: 'Get data successful!',
                data: data
            }).status(200)
        }
        return res.send({
            code: 1,
            message: 'Get data successful!',
            data: {}
        }).status(200)
    } catch (error) {
        return res.send({
            code: 0,
            message: 'Error!',
            data: {}
        }).status(200)
    }
}

module.exports.searchDistricts = async (req, res) => {
    try {
        const { size, page, sort, search, code } = req.query;

        const requestData = {
            size: size || 50,
            page: page || 1,
            sortBy: sort || { created_date: -1 }
        };
        let filter = {
        };
        if (search) {
            let keyword = search.trim();
            if (keyword) {
                keyword = keyword.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
                let regSearch = new RegExp(keyword, 'i');
                filter.$or = [
                    { name: regSearch },
                ];
            }
        }
        if (code) {
            let keyword = code.trim();
            filter.$or = [
                { id: keyword },
                { provinceId: keyword },
            ];
        }
        let data = await DistrictModel.findPagination(filter, requestData);
        if (data) {
            return res.send({
                code: 1,
                message: 'Get data successful!',
                data: data
            }).status(200)
        }
        return res.send({
            code: 1,
            message: 'Get data successful!',
            data: {}
        }).status(200)
    } catch (error) {
        console.log(error, '-----!@@@!error')
        return res.send({
            code: 0,
            message: 'Error!',
            data: {}
        }).status(200)
    }
}

module.exports.getWard = async (req, res) => {
    try {
        const { id } = req.params

        let data = await WardModel.find({ districtId: Number(id) }).sort({ "name": 1 })
        if (data) {
            return res.send({
                code: 1,
                message: 'Get data successful!',
                data: data
            }).status(200)
        }
        return res.send({
            code: 1,
            message: 'Get data successful!',
            data: {}
        }).status(200)
    } catch (error) {
        return res.send({
            code: 0,
            message: 'Error!',
            data: {}
        }).status(200)
    }
}
module.exports.createWard = async (req, res) => {
    try {
        const payload = req.body;
        if (payload.id && payload.name && payload.type) {
            const exist = await WardModel.findOne({ id: payload.id }).exec();
            if (exist) {
                return res.status(400).send({ code: 0, message: "Xã này đã tồn tại!", error: "error" }).end();
            } else {
                const province = new WardModel(payload);
                let result = await province.save();
                return res.send({ code: 1, message: 'success', data: result }).status(200);
            }
        } else {
            return res.status(400).send({ code: 0, message: "Dữ liệu thêm Xã chưa đầy đủ", error: "error" }).end();
        }
    } catch (error) {
        res.boom.badRequest(error);
    }
};

module.exports.updateWard = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        WardModel.updateOne({ _id: new ObjectId(id) }, { $set: payload }).then((result) => {
            if (result) {
                return res.send({ code: 1, message: 'success', data: result }).status(200);
            }
            return res.status(400).send({ code: 0, message: "Cập nhập Xã thất bại", error: "error" }).end();
        })
    } catch (error) {
        res.boom.badRequest(error);
    }
};

module.exports.removeWard = async (req, res) => {
    try {
        const { id } = req.params;
        if (id && validObjectId(id)) {
            WardModel.updateOne(
                { _id: new ObjectId(id) },
                { deleted: true },
                (err, result) => {
                    if (err)
                        return res.send({ code: 0, message: "failed", error: err }).end();
                    return res.send({ code: 1, message: "success", data: result }).end();
                }
            );
        } else {
            res.send({ code: 0, message: "Id not exists or not valid" });
        }
    } catch (error) {
        res.boom.badRequest(error);
    }
};

module.exports.searchWards = async (req, res) => {
    try {
        const { size, page, sort, search, code } = req.query;

        const requestData = {
            size: size || 50,
            page: page || 1,
            sortBy: sort || { created_date: -1 }
        };
        let filter = {
        };
        if (search) {
            let keyword = search.trim();
            if (keyword) {
                keyword = keyword.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
                let regSearch = new RegExp(keyword, 'i');
                filter.$or = [
                    { name: regSearch },
                ];
            }
        }
        if (code) {
            let keyword = code.trim();
            filter.$or = [
                { id: keyword },
                { districtId: keyword },
            ];
        }
        let data = await WardModel.findPagination(filter, requestData);
        if (data) {
            return res.send({
                code: 1,
                message: 'Get data successful!',
                data: data
            }).status(200)
        }
        return res.send({
            code: 1,
            message: 'Get data successful!',
            data: {}
        }).status(200)
    } catch (error) {
        console.log(error, '----!!@@@filter')

        return res.send({
            code: 0,
            message: 'Error!',
            data: {}
        }).status(200)
    }
}

module.exports.getCountries = async (req, res) => {
    try {
        let data = await ContriesModel.find().sort({ "name": 1 })

        if (data) {
            return res.send({
                code: 1,
                message: 'Get data successful!',
                data: data
            }).status(200)
        }
        return res.send({
            code: 1,
            message: 'Get data successful!',
            data: {}
        }).status(200)
    } catch (error) {
        return res.send({
            code: 0,
            message: 'Error!',
            data: {}
        }).status(200)
    }
}

module.exports.getStates = async (req, res) => {
    try {
        const { id } = req.params
        let data = await StatesModel.find({ "country_id": Number(id) }).sort({ "name": 1 })
        if (data) {
            return res.send({
                code: 1,
                message: 'Get data successful!',
                data: data
            }).status(200)
        }
        return res.send({
            code: 1,
            message: 'Get data successful!',
            data: {}
        }).status(200)
    } catch (error) {
        return res.send({
            code: 0,
            message: 'Error!',
            data: {}
        }).status(200)
    }
}

module.exports.getCities = async (req, res) => {
    try {
        const { id } = req.params

        let data = await CitiesdModel.find({ "state_id": Number(id) }).sort({ "name": 1 })
        if (data) {
            return res.send({
                code: 1,
                message: 'Get data successful!',
                data: data
            }).status(200)
        }
        return res.send({
            code: 1,
            message: 'Get data successful!',
            data: {}
        }).status(200)
    } catch (error) {
        return res.send({
            code: 0,
            message: 'Error!',
            data: {}
        }).status(200)
    }
}