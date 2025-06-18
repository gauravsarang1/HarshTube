import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNewComment, setSubmitType } from '../../../features/body/commentSlice';
import { handleSubmitComment } from '../utils/handleSubmitComment';
import { useNavigate } from 'react-router-dom';

const CommentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { newComment, submitting, submitType, videoId, comments } = useSelector(state => state.comment);

  const onSubmit = (e) => handleSubmitComment(e, newComment, submitType, videoId, dispatch, navigate, comments);
  const onCancelEdit = () => {
    dispatch(setSubmitType({type: 'send', commentId: null}));
    dispatch(setNewComment(''));
  };

  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="flex gap-4">
        <textarea
          value={newComment}
          onChange={(e) => dispatch(setNewComment(e.target.value))}
          placeholder={submitType.type === 'edit' ? "Edit your comment..." : "Add a comment..."}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          rows="2"
        />
        <div className="flex gap-2">
          {submitType.type === 'edit' && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '...' : (submitType.type === 'edit' ? 'Update' : 'Comment')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm; 