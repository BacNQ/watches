const NewsModel = require('../models/news/news');

/**
 * Lấy tất cả bài viết
 */
module.exports.getAllNews = async (req, res) => {
    try {
        const { title, category, status, sort, page = 1, limit = 10 } = req.query;

        let filter = {};

        if (title) {
            filter.$or = [
                { title: { $regex: title, $options: 'i' } },
                { slug: { $regex: title, $options: 'i' } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        let sortOption = { createdAt: -1 };
        if (sort) {
            const isDesc = sort.startsWith('-');
            const sortField = isDesc ? sort.substring(1) : sort;
            sortOption = { [sortField]: isDesc ? -1 : 1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const total = await NewsModel.countDocuments(filter);

        const news = await NewsModel.find(filter)
            .populate('author', 'username email phone')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: news,
            paging: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
};

module.exports.getNews = async (req, res) => {
    try {
        const { title, category, sort, page = 1, limit = 10 } = req.query;

        let filter = {
            status: true,
            deleted: false
        };

        if (title) {
            filter.$or = [
                { title: { $regex: title, $options: 'i' } },
                { slug: { $regex: title, $options: 'i' } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        let sortOption = { createdAt: -1 };
        if (sort) {
            const isDesc = sort.startsWith('-');
            const sortField = isDesc ? sort.substring(1) : sort;
            sortOption = { [sortField]: isDesc ? -1 : 1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await NewsModel.countDocuments(filter);

        const news = await NewsModel.find(filter)
            .populate('author', 'username email phone')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: news,
            paging: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
};

module.exports.getNewsBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const news = await NewsModel.findOne({ slug, status: true, deleted: false })
            .populate('author', 'username email phone');
        if (!news) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
        }
        res.status(200).json({ success: true, data: news });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
};

/**
 * Thêm bài viết mới
 */
module.exports.createNews = async (req, res) => {
    try {
        const { title, slug, content, thumbnail, author, tags, category, status, images } = req.body;

        const exist = await NewsModel.findOne({ slug });
        if (exist) {
            return res.status(400).json({ success: false, message: 'Slug đã tồn tại' });
        }

        const newNews = new NewsModel({
            title,
            slug,
            content,
            thumbnail,
            author,
            tags,
            category,
            status,
            images
        });

        await newNews.save();
        res.status(201).json({ success: true, message: 'Thêm bài viết thành công', data: newNews });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
};

/**
 * Sửa bài viết
 */
module.exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.slug) {
            const slugExist = await NewsModel.findOne({ slug: updateData.slug, _id: { $ne: id } });
            if (slugExist) {
                return res.status(400).json({ success: false, message: 'Slug đã tồn tại' });
            }
        }

        const updated = await NewsModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật thành công',
            data: updated
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
};

/**
 * Xóa bài viết
 */
module.exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await NewsModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
        }
        res.status(200).json({ success: true, message: 'Đã xóa bài viết thành công' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
};
