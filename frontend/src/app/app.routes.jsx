import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home"
import ProductDetail from '../features/products/pages/ProductDetail';
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import Cart from "../features/cart/pages/Cart"
import AppLayout from "./AppLayout";
import OrderSuccess from "../features/cart/pages/OrderSucess,";
// import Rough from "../features/products/pages/Rough";
export const router = createBrowserRouter([

    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },

    {
        element: <AppLayout />,
        children: [

            {
                path: "/",
                element: <Home />
            },
            {
                path: "/order-success",
                element: <OrderSuccess />
            },
            {
                path: "/cart",
                element: <Cart />
            },

            {
                path: "/product/:productId",
                element: <ProductDetail />
            },
            {
                path: "seller",
                children: [
                    {
                        path: "create-product",
                        element: <Protected role="seller">
                            <CreateProduct />
                        </Protected>
                    },
                    {
                        path: "dashboard",
                        element: <Protected role="seller">
                            <Dashboard />
                        </Protected>
                    },
                    {
                        path: "product/:productId",
                        element: <Protected role="seller" >
                            <SellerProductDetails />
                        </Protected>
                    }
                ]
            },
        ]

    }
])