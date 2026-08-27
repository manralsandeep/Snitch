import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom';
import { router } from './app.routes';
import { useAuth } from "../features/auth/hook/useAuth"
import { useSelector } from 'react-redux';
import { useCart } from '../features/cart/hooks/useCart';
import { Toaster } from 'react-hot-toast';
const App = () => {

  const { handleGetme } = useAuth()

  const cartItems = useSelector(state => state.cart.items)

  // console.log(user) 
  const { handleGetCart } = useCart()

  useEffect(() => {
    handleGetme()
  }, [])


  useEffect(() => {
    handleGetCart()
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>

  )
}

export default App
