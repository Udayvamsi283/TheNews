import { Router } from 'express';
import healthRoutes from './health.routes.js';

const apiRouter = Router();

// Version 1 Base Routes
apiRouter.use('/', healthRoutes);

/*
 * Future Module Route Registration (Phase 2+):
 *
 * apiRouter.use('/auth', authRoutes);
 * apiRouter.use('/users', userRoutes);
 * apiRouter.use('/articles', articleRoutes);
 * apiRouter.use('/categories', categoryRoutes);
 * apiRouter.use('/tags', tagRoutes);
 * apiRouter.use('/media', mediaRoutes);
 * apiRouter.use('/comments', commentRoutes);
 * apiRouter.use('/polls', pollRoutes);
 * apiRouter.use('/events', eventRoutes);
 * apiRouter.use('/homepage', homepageRoutes);
 * apiRouter.use('/analytics', analyticsRoutes);
 */

export default apiRouter;
