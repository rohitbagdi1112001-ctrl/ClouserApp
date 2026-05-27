import { useEffect, useState } from "react";
import { getComments, postComment } from "../../api/videoApi";

interface Props {
  videoId: number;
  comments?: string[];
}

const CommentSection = ({ videoId, comments = [] }: Props) => {
  const [commentList, setCommentList] = useState<string[]>(comments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getComments(videoId);
        if (active) {
          setCommentList(data ?? comments);
        }
      } catch {
        if (active) {
          setCommentList(comments);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      active = false;
    };
  }, [videoId, comments]);

  const handleAddComment = async () => {
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;

    setPosting(true);
    setCommentList((previous) => [...previous, trimmedComment]);
    setNewComment("");

    try {
      await postComment(videoId, trimmedComment);
    } catch {
      setCommentList((previous) => previous.filter((comment) => comment !== trimmedComment));
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments ({commentList.length})</h3>
      {loading ? <p>Loading comments…</p> : null}

      <div className="comment-input-wrapper">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          className="comment-input"
        />

        <button onClick={handleAddComment} className="comment-button" disabled={posting || !newComment.trim()}>
          {posting ? "Posting..." : "Post"}
        </button>
      </div>

      <div className="comment-list">
        {commentList.length > 0 ? (
          commentList.map((comment, index) => (
            <p key={index} className="comment-item">
              {comment}
            </p>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
