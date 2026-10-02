import { Router } from 'express';
import {
  getPosts,
  getPostById,
  getPostPreview,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  restorePost,
  duplicatePost,
  bulkUploadPosts
} from '../controllers/post.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

// Public / preview endpoints
router.get('/', getPosts);
router.get('/preview/:tokenOrId', getPostPreview);
router.get('/:id', getPostById);

// Admin-protected CMS endpoints
router.use(authenticate);
router.use(requireRole('admin'));

router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

router.post('/:id/publish', publishPost);
router.post('/:id/unpublish', unpublishPost);
router.post('/:id/restore', restorePost);
router.post('/:id/duplicate', duplicatePost);

router.post('/bulk-upload', upload.single('file'), bulkUploadPosts);

export default router;
