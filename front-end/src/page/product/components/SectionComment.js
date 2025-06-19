import React, { useState, useEffect } from 'react';
import { getComments, addComments, editComment, deleteComment } from '../../../services/common';
import toast from 'react-hot-toast';
import { Modal, Button, Input } from 'antd';
import { useUser } from '../../../provider/UserProvider';

const SectionComment = ({ productId, title }) => {
    const [comments, setComments] = useState([]);
    const { user } = useUser();
    const [commentContent, setCommentContent] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [sendingComment, setSendingComment] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [commentToDelete, setCommentToDelete] = useState(null);

    useEffect(() => {
        if (productId) {
            fetchComments(productId);
        }
    }, [productId]);

    const fetchComments = async (productId) => {
        setLoadingComments(true);
        try {
            const res = await getComments(productId);
            if (res.success) {
                setComments(res.comments || []);
            } else {
                setComments([]);
            }
        } catch (err) {
            setComments([]);
        }
        setLoadingComments(false);
    };

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) {
            toast.error('Bạn chưa nhập nội dung bình luận');
            return;
        }
        setSendingComment(true);
        try {
            const payload = {
                content: commentContent,
                parentCommentId: null
            };
            const res = await addComments(productId, payload);
            if (res.success) {
                toast.success('Gửi bình luận thành công!');
                setCommentContent('');
                fetchComments(productId);
            } else {
                toast.error(res.message || 'Gửi bình luận thất bại');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi gửi bình luận');
        }
        setSendingComment(false);
    };

    const handleDeleteComment = async () => {
        if (!commentToDelete) return;

        setSendingComment(true);
        try {
            const res = await deleteComment(commentToDelete);
            if (res.success) {
                toast.success('Bình luận đã được xóa');
                fetchComments(productId);
            } else {
                toast.error(res.message || 'Xóa bình luận thất bại');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi xóa bình luận');
        }
        setSendingComment(false);
    };

    const handleCancelDelete = () => {
        setCommentToDelete(null);
    };

    const handleEditComment = async (commentId) => {
        const comment = comments.find(c => c._id === commentId);
        setEditingContent(comment.content);
        setEditingCommentId(commentId);
    };

    const handleSaveEditComment = async () => {
        if (!editingContent.trim()) {
            toast.error('Nội dung bình luận không được để trống');
            return;
        }

        setSendingComment(true);
        try {
            const res = await editComment(editingCommentId, { content: editingContent });
            if (res.success) {
                toast.success('Cập nhật bình luận thành công!');
                setEditingCommentId(null);
                fetchComments(productId);
            } else {
                toast.error(res.message || 'Cập nhật bình luận thất bại');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi cập nhật bình luận');
        }
        setSendingComment(false);
    };

    return (
        <section className="comments-section">
            <div className="card-header">
                <h4 className="title-main bold">{title}</h4>
            </div>

            <form onSubmit={handleSendComment} className="form-comment">
                <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows={2}
                    placeholder="Nhập bình luận của bạn..."
                    className="input-comment"
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="btn-send-comment"
                        disabled={sendingComment}
                    >
                        <i className="fa-solid fa-pencil mr-2 text-[12px]"></i> Bình luận
                    </button>
                </div>
            </form>

            <div className="list-comments">
                {loadingComments ? (
                    <div>Đang tải bình luận...</div>
                ) : comments && comments.length > 0 ? (
                    comments.map((item) => (
                        <div key={item._id} className="item-comment">
                            <div className="avatar">
                                <i className="fa-solid fa-user bg-[#d8d8d8] p-[10px] px-[12px] rounded-lg shadow-md"></i>
                            </div>
                            <div className="comment-content">
                                <div className="comment-username">
                                    {item?.userId?.username || 'Người dùng'}
                                </div>

                                <div className="comment-text">{item.content}</div>

                                <div className="group-end">
                                    <div className="comment-date">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </div>

                                    {user && item.userId._id === user._id && (
                                        <>
                                            <button
                                                onClick={() => handleEditComment(item._id)}
                                                className="btn-edit-comment"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => setCommentToDelete(item._id)}
                                                className="btn-delete-comment"
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='mb-4 text-[14px]'>Chưa có bình luận nào.</div>
                )}
            </div>
            
            <Modal
                title="Xác nhận xóa bình luận"
                visible={commentToDelete !== null}
                onOk={handleDeleteComment}
                onCancel={handleCancelDelete}
                confirmLoading={sendingComment}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa bình luận này?</p>
            </Modal>

            <Modal
                title="Chỉnh sửa bình luận"
                visible={editingCommentId !== null}
                onOk={handleSaveEditComment}
                onCancel={() => setEditingCommentId(null)}
                confirmLoading={sendingComment}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Input.TextArea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={4}
                    placeholder="Chỉnh sửa nội dung bình luận"
                />
            </Modal>
        </section>
    );
};

export default SectionComment;
