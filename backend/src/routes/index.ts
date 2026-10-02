import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import categoryRoutes from './category.routes.js';
import tagRoutes from './tag.routes.js';
import languageRoutes from './language.routes.js';
import postRoutes from './post.routes.js';
import mediaRoutes from './media.routes.js';

const apiRouter = Router();

// Base & Health
apiRouter.use('/', healthRoutes);

// Core Modules
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/tags', tagRoutes);
apiRouter.use('/languages', languageRoutes);

// Phase 3 Modules: Posts & Media
apiRouter.use('/posts', postRoutes);
apiRouter.use('/media', mediaRoutes);

/*
 * Future Module Route Registration (Phase 3+):
 *
 * apiRouter.use('/articles', articleRoutes);
 * apiRouter.use('/media', mediaRoutes);
 * apiRouter.use('/comments', commentRoutes);
 * apiRouter.use('/polls', pollRoutes);
 * apiRouter.use('/events', eventRoutes);
 * apiRouter.use('/homepage', homepageRoutes);
 * apiRouter.use('/analytics', analyticsRoutes);
 */

export default apiRouter;
