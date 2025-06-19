const UserModel = require('../models/users/user');
const ProductModel = require('../models/product/item');
const CommentModel = require('../models/product/comments');

module.exports.getComments = async (req, res) => {
    try {
        const { product_id } = req.params;
        const comments = await CommentModel.find({ product_id })
            .populate('userId', 'username avatar')
            .sort({ createdAt: -1 });
        return res.json({ success: true, comments });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.addComment = async (req, res) => {
    try {
        const { product_id } = req.params;
        const { content, parentCommentId } = req.body;
        const userId = req.user.id;

        if (!content || content.trim() === '') {
            return res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống' });
        }

        if (parentCommentId) {
            const parent = await CommentModel.findOne({ _id: parentCommentId, product_id });
            if (!parent) {
                return res.status(400).json({ success: false, message: 'Bình luận cha không tồn tại' });
            }
        }

        const newComment = new CommentModel({
            userId,
            product_id,
            content,
            parentCommentId: parentCommentId || null,
        });

        await newComment.save();

        await newComment.populate('userId', 'username avatar');

        return res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.editComment = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content || content.trim() === '') {
            return res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống' });
        }

        const comment = await CommentModel.findOne({ _id: comment_id, userId });

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Bình luận không tồn tại hoặc bạn không phải là người tạo bình luận này' });
        }

        comment.content = content;
        await comment.save();

        return res.status(200).json({ success: true, comment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.deleteComment = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const userId = req.user.id;
        const comment = await CommentModel.findOne({ _id: comment_id, userId });

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Bình luận không tồn tại hoặc bạn không phải là người tạo bình luận này' });
        }

        await CommentModel.deleteOne({ _id: comment_id });

        return res.status(200).json({ success: true, message: 'Bình luận đã được xóa thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




