const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const ContactModel = require('../models/users/contact');
const { validObjectId } = require('../helpers/mongo-helper');

/**Contact USER */
module.exports.searchContacts = async (req, res) => {
    try {
        const { name, phone, email, type, status, search, size, page, sort, from_date = null, to_date = null } = req.query;
        const options = {
            size: size || 20,
            page: page || 1,
            sortBy: sort || { created_date: -1 },
        };

        let filter = {};
        if (search) {
            let keyword = search.trim();
            filter.$or = [
                { 'name': { $regex: `.*${keyword}.*`, $options: "ig" } },
                { 'phone': { $regex: `.*${keyword}.*`, $options: "ig" } },
                { 'email': { $regex: `.*${keyword}.*`, $options: "ig" } },
            ];
        }

        if (phone) {
            filter = { ...filter, phone }
        }

        if (email) {
            filter = { ...filter, email }
        }

        if (name) {
            filter = { ...filter, name }
        }

        if (type) {
            filter = { ...filter, type }
        }

        if (status) {
            filter = { ...filter, status: status }
        }

        if (from_date || to_date) {
            let created_at = {}
            if (from_date) {
                created_at = { $gte: from_date }
            }
            if (to_date) {
                created_at = { ...created_at, $lte: to_date }
            }
            filter = { ...filter, created_at };
        }

        const query = {
            deleted: false,
            ...filter,
        };

        ContactModel.findPagination(query, options)
            .then(data => {
                return res.send({ code: 1, message: 'success', data: data || [] }).end();
            })
            .catch(error => {
                console.log('Error:', error);
                return res.send({ code: 0, message: 'failed', error: 'error' }).end();
            });
    } catch (error) {
        res.boom.badData(error);
    }
}

module.exports.loadContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        let contacts = await ContactModel.find({ user: new ObjectId(id) }).sort({ default: -1 });
        if (contacts && contacts.length) {
            contacts.map(i => {
                if (i && i.phone) {
                    if (['OP', 'CS'].includes(req.role) && !user.leader) {
                        i.phone = hidePhone(i.phone);
                        i.email = hideEmail(i.email);
                    }
                    return i
                }
            })
        }
        return res.status(200).send({ code: 1, message: "success", data: contacts });
    } catch (error) {
        console.log(error, '---erore')
        return res.send({ code: 0, message: "Failed", error: 'user not exists' }).end();
    }
};

module.exports.loadContactUser = async (req, res) => {
    try {
        const userId = req.userId;
        let contacts = await ContactModel.find({ user: userId }).sort({ primary: -1, created_date: -1 });
        return res.send({ code: 1, message: "success", data: contacts }).status(200);
    } catch (error) {
        return res.send({ code: 0, message: "Failed", error: 'user not exists' }).end();
    }
};

module.exports.createContact = async (req, res) => {
    try {
        const data = req.body;
        const user_id = data.user && ObjectId.isValid(data.user) ? data.user : req.userId;
        if (data.primary && data.user && user_id) {
            await ContactModel.updateMany({ user: ObjectId(user_id) }, { primary: false })
        }

        const payload = {
            user: user_id,
            name: data.name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            province_id: data.province_id,
            province: data.province,
            district_id: data.district_id,
            district: data.district,
            ward_id: data.ward_id,
            ward: data.ward,
            remark: data.remark,
            type: data.type,
            primary: !!data.primary,
        }
        if (payload.name && payload.phone) {
            const newContact = new ContactModel(payload);
            await newContact.save();
            return res.status(200).send({ code: 1, data: true });
        } else {
            return res.status(400).send({ code: 0, message: "Failed", error: 'name or phone not exists' }).end();
        }
    } catch (error) {
        return res.status(500).send({ code: 0, message: "Failed", error: error }).end();
    }
}

module.exports.updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        if (id && ObjectId.isValid(id)) {
            const data = req.body;
            if (data.primary && data.user && ObjectId.isValid(data.user)) {
                await ContactModel.updateMany({ user: new ObjectId(data.user) }, { primary: false })
            }
            const payload = {
                primary: !!data.primary,
            }

            if (data.name != undefined) payload['name'] = data.name;
            if (data.phone != undefined) payload['phone'] = data.phone;
            if (data.email != undefined) payload['email'] = data.email;
            if (data.address != undefined) payload['address'] = data.address;
            if (data.province_id != undefined) payload['province_id'] = data.province_id;
            if (data.province != undefined) payload['province'] = data.province;
            if (data.district_id != undefined) payload['district_id'] = data.district_id;
            if (data.district != undefined) payload['district'] = data.district;
            if (data.ward_id != undefined) payload['ward_id'] = data.ward_id;
            if (data.ward != undefined) payload['ward'] = data.ward;
            if (data.remark != undefined) payload['remark'] = data.remark;
            if (data.type != undefined) payload['type'] = data.type;

            let result = await ContactModel.updateOne({ _id: new ObjectId(id) }, { $set: payload })
            if (result) {
                return res.status(200).send({ code: 1, data: true })
            }
            return res.status(500).send({ code: 0, message: "Lỗi cập nhập", error: 'Not Found' }).end();
        } else {
            return res.status(400).send({ code: 0, message: "Không có dữ liệu cập nhập", error: 'Not Found' }).end();
        }
    } catch (error) {
        return res.status(500).send({ code: 0, message: "Lỗi cập nhập", error: error }).end();
    }
}

module.exports.removeContact = async (req, res) => {
    try {
        const { id } = req.params;
        let result = await ContactModel.findByIdAndRemove(id)
        if (result) {
            return res.status(200).send({ code: 1, data: result });
        }
        return res.send({ code: 0, message: "Failed", error: 'Not Found' }).end();
    } catch (error) {
        return res.send({ code: 0, message: "Failed", error: error }).end();
    }
}