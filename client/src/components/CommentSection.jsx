import { Alert, Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Comment } from './index.js';
import { set } from 'mongoose';

const CommentSection = ({ postId }) => {

  const { currentUser } = useSelector(state => state.user);

  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length > 200 || comment.length <= 0) {
      setCommentError("Comment must be between 1 and 200 characters");
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: comment, userId: currentUser._id, postId })
      });

      if (res.ok) {
        const data = await res.json();
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);

        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });

      if (res.ok) {
        const data = await res.json();
        setComments(comments.map(cmt => cmt._id === commentId ? { ...cmt, likes: data.likes, numberOfLikes: data.likes.length, } : cmt));
      } else {
        const data = await res.json();
        console.log(data.message);
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) => (c._id === comment._id ? { ...c, content: editedContent } : c))
    );
  }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {
        currentUser ? (
          <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
            <p>Signed is as:</p>
            <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="User Image" />
            <Link to={"/dashboard?tab=profile"} className='text-xs text-cyan-600 hover:underline'>
              @{currentUser.userName}
            </Link>
          </div>
        ) : (
          <div className="text-sm text-teal-500 my-5 flex gap-1">
            You must be signed in to comment.
            <Link to={"/sign-in"} className='text-blue-500 hover:underline'>
              Sign in
            </Link>
          </div>
        )
      }

      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
          <Textarea
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder='Add a comment'
            rows="3"
            maxLength="200" />

          <div className="flex justify-between items-center mt-5">
            <p className='text-gray-500 text-xs'>{200 - comment.length} Chanractes remaining</p>
            <Button outline gradientDuoTone="purpleToBlue" type='submit'>Submit</Button>
          </div>
        </form>
      )}
      {commentError && <Alert className='mt-2' color="failure">{commentError}</Alert>}

      {comments.length === 0 ? (
        <p className='text-gray-500 text-center my-5'>No comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>

          {comments.map(cmt => (
            <Comment key={cmt._id} comment={cmt} onLike={handleLike} onEdit={handleEdit} />
          ))}
        </>
      )}
    </div>
  )
}

export default CommentSection