import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNewComment, setSubmitType } from '../../../features/body/commentSlice';
import { handleSubmitComment } from '../utils/handleSubmitComment';
import { useNavigate } from 'react-router-dom';
import { improveComment } from '../utils/commentImprover';
import { Sparkles, Loader2 } from 'lucide-react';

const CommentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [improving, setImproving] = useState(false);
  const { newComment, submitting, submitType, videoId, comments, lastFiveComments, videoTitle } = useSelector(state => state.comment);

  const onSubmit = (e) => handleSubmitComment(e, newComment, submitType, videoId, dispatch, navigate, comments);
  const onCancelEdit = () => {
    dispatch(setSubmitType({type: 'send', commentId: null}));
    dispatch(setNewComment(''));
  };

  const handleImproveComment = async () => {
    if (!newComment.trim()) return;
    
    setImproving(true);
    try {
      const improvedComment = await improveComment(
        videoTitle, 
        newComment, 
        lastFiveComments.map(comment => comment.content)
      );
      if (improvedComment) {
        dispatch(setNewComment(improvedComment));
      }
    } catch (error) {
      console.error('Error improving comment:', error);
    } finally {
      setImproving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex gap-4">
        <div className="relative w-full">
          <textarea
            value={newComment}
            onChange={(e) => dispatch(setNewComment(e.target.value))}
            placeholder={submitType.type === 'edit' ? "Edit your comment..." : "Add a comment..."}
            className="w-full px-4 py-3 pr-[100px] rounded-xl border-2 border-gray-200/50 dark:border-gray-600/50 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-400 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white resize-none md:min-w-[500px]"
            rows="2"
            disabled={improving}
          />
          <button
            type="button"
            disabled={improving || !newComment.trim()}
            onClick={handleImproveComment}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1.5 group ${(improving || !newComment.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {improving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-yellow-300 group-hover:animate-pulse" />
            )}
            <span className="font-medium">{improving ? 'Improving...' : 'Improve'}</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end mt-2 mb-3">
        {submitType.type === 'edit' && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-6 py-2 mr-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || !newComment.trim() || improving}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : submitType.type === 'edit' ? 'Update' : 'Comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 