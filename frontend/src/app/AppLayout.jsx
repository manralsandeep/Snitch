import React from 'react'
import Nav from '../features/shared/components/Nav'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
    return (
        <>
            <Nav />
            
            <Outlet />
        </>
    )
}

export default AppLayout
