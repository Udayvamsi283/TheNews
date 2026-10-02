import { Router } from 'express';
import {
  likePost,
  unlikePost,
  bookmarkPost,
  removeBookmark,
  getComments,
  createComment,
  deleteComment,
  votePoll,
  getPollResults
} from '../controllers/engagement.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { commentRateLimiter, voteRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

// Likes
router.post('/posts/:id/like', authenticate, likePost);
router.delete('/posts/:id/like', authenticate, unlikePost);

// Bookmarks
router.post('/posts/:id/bookmark', authenticate, bookmarkPost);
router.delete('/posts/:id/bookmark', authenticate, removeBookmark);

// Comments
router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', authenticate, commentRateLimiter, createComment);
router.delete('/comments/:id', authenticate, deleteComment);

// Poll Voting
router.post('/posts/:id/poll/vote', authenticate, voteRateLimiter, votePoll);
router.get('/posts/:id/poll/results', optionalAuthenticate, getPollResults);

export default router;
