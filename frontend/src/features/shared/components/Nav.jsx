import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link, useLocation } from 'react-router-dom' // 🚀 1. useLocation import kiya (react-router-dom se)
import { useAuth } from '../../auth/hook/useAuth'
import { setUser } from '../../auth/state/auth.slice'
import { setSearchQuery } from '../../products/state/product.slice'

// 1. SearchBar component ko Nav ke BAHAR nikal diya hai (Same as before)
const SearchBar = ({ isMobile, searchQuery, dispatch, handleSearchSubmit }) => (
    <form
        onSubmit={handleSearchSubmit}
        className={`relative flex items-center transition-all ${isMobile
            ? 'flex md:hidden w-24 sm:w-32 mr-2'
            : 'hidden md:flex w-48 lg:w-70 mr-2'
            }`}
    >
        <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="SEARCH"
            className="w-full bg-transparent border-b pb-1 text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] uppercase font-medium focus:outline-none transition-colors placeholder-opacity-70"
            style={{ borderColor: '#e4e2df', color: '#1b1c1a' }}
        />
        <button type="submit" className="absolute right-0 bottom-1.5 transition-colors hover:text-[#C9A96E]" style={{ color: '#7A6E63' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </button>
    </form>
)

const Nav = () => {
    const navigate = useNavigate()
    const location = useLocation() // 🚀 2. Hook call kiya URL check karne ke liye
    const dispatch = useDispatch()
    const { handleLogout } = useAuth()
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const searchQuery = useSelector(state => state.product.searchQuery)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // 🚀 3. Check kiya ki kya hum home page pe hain? (Maine '/' aur '/home' dono daal diye hain safety ke liye)
    const isHomePage = location.pathname === '/' || location.pathname === '/home';

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const onLogoutClick = async () => {
        try {
            await handleLogout()
            dispatch(setUser(null))
            setIsMenuOpen(false)
            navigate('/')
        } catch (err) {
            console.log(err)
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            console.log("Searching for:", searchQuery)
            // navigate(`/search?query=${searchQuery}`)
            setIsMenuOpen(false)
        }
    }

    return (
        <header className="sticky top-0 z-[100] bg-white border-b" style={{ borderColor: '#e4e2df' }}>
            <nav className="px-5 md:px-8 lg:px-16 xl:px-24 py-5 md:pt-10 md:pb-6 flex items-center justify-between">

                {/* Logo */}
                <Link to="/"
                    className="text-sm md:text-base font-medium tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                >
                    Snitch.
                </Link>

                {/* Right Side Items Container */}
                <div className="flex gap-3 md:gap-6 items-center text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>

                    {/* Desktop Navigation Container (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-6">

                        {/* 🚀 4. Sirf tabhi dikhao jab isHomePage true ho (Desktop) */}
                        {isHomePage && (
                            <SearchBar
                                isMobile={false}
                                searchQuery={searchQuery}
                                dispatch={dispatch}
                                handleSearchSubmit={handleSearchSubmit}
                            />
                        )}

                        {user ? (
                            <>
                                <span style={{ color: '#1b1c1a' }}>{user.fullname}</span>
                                {user.role === 'seller' && (
                                    <Link to="/seller/dashboard" className="transition-colors hover:text-[#C9A96E]">Seller Dashboard</Link>
                                )}
                                <button
                                    onClick={onLogoutClick}
                                    className="flex items-center gap-1.5 transition-colors hover:text-[#C9A96E]"
                                >
                                    <span>Logout</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="transition-colors hover:text-[#C9A96E]">Sign In</Link>
                                <Link to="/register" className="transition-colors hover:text-[#C9A96E]">Sign Up</Link>
                            </>
                        )}
                    </div>

                    {/* 🚀 5. Sirf tabhi dikhao jab isHomePage true ho (Mobile) */}
                    {isHomePage && (
                        <SearchBar
                            isMobile={true}
                            searchQuery={searchQuery}
                            dispatch={dispatch}
                            handleSearchSubmit={handleSearchSubmit}
                        />
                    )}

                    {/* Cart Icon (Always Visible) */}
                    {user && (
                        <Link
                            to="/cart"
                            className="relative flex items-center hover:opacity-70 transition-opacity ml-1 md:ml-0"
                            style={{ color: '#1b1c1a' }}
                            aria-label="Shopping cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {cartItems?.length > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                                    style={{
                                        backgroundColor: '#C9A96E',
                                        width: '16px',
                                        height: '16px',
                                        fontSize: '9px',
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 600,
                                        letterSpacing: 0,
                                    }}
                                >
                                    {cartItems.length > 9 ? '9+' : cartItems.length}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="md:hidden flex items-center justify-center ml-2"
                        onClick={toggleMenu}
                        aria-label="Toggle mobile menu"
                    >
                        {isMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1b1c1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1b1c1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-md" style={{ borderColor: '#e4e2df' }}>
                    <div className="flex flex-col px-5 py-6 gap-6 text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                        {user ? (
                            <>
                                <div className="pb-4 border-b" style={{ borderColor: '#e4e2df', color: '#1b1c1a' }}>
                                    Welcome, {user.fullname}
                                </div>
                                {user.role === 'seller' && (
                                    <Link to="/seller/dashboard" onClick={() => setIsMenuOpen(false)} className="transition-colors hover:text-[#C9A96E]">Seller Dashboard</Link>
                                )}
                                <button
                                    onClick={onLogoutClick}
                                    className="flex items-center gap-2 w-fit transition-colors hover:text-[#C9A96E]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="transition-colors hover:text-[#C9A96E]">Sign In</Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="transition-colors hover:text-[#C9A96E]">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Nav