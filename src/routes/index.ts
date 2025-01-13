import express from 'express';
import productRoutes from 'routes/productRoutes';

const router = express.Router();

const applicationRoutes = [
  {
    path: '/products',
    route: productRoutes,
  },
];

applicationRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
