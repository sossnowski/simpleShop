import express from 'express';
import productRoutes from 'routes/productRoutes';
import orderRoutes from 'routes/orderRoutes';

const router = express.Router();

const applicationRoutes = [
  {
    path: '/products',
    route: productRoutes,
  },
  {
    path: '/orders',
    route: orderRoutes,
  },
];

applicationRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
