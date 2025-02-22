import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayout";
import Homepage from "../pages/Homepage";
import ProductsPage from "../pages/ProductsPage";
import CartPage from "../pages/CartPage";
import ProductDetailPage from "../pages/ProductDetailPage";

import NotFound from "../pages/NotFound";

import AdminPage from "../admin/AdminPage";

const router = createHashRouter([
    {
        path: '/',
        element: <FrontLayout />,
        children: [
            {
                path: '',
                element: <Homepage />,
            },
            {
                path: 'products',
                element: <ProductsPage />,
            },
            {
                path: 'products/:id',
                element: <ProductDetailPage />,
            },
            {
                path: 'cart',
                element: <CartPage />,
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminPage />,
    },
    {
        path: '*',
        element: <NotFound />,
    }
]);

export default router;