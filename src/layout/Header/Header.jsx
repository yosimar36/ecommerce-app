import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/common/Icon/Icon";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import Navigation from "../Navigation/Navigation";
import "./Header.css";
import { getCurrentUser } from "../../utils/auth";

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkMode, toggleTheme } = useTheme();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  // Simular estado de autenticación - reemplazar con tu lógica real
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState(getCurrentUser);

  // Referencias para manejo de clicks fuera
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(()=>{
    const updateAuthState =()=>{
      setIsAuthenticated(isAuthenticated());
      setUser(getCurrentUser());
    };
    
    window.addEventListener("storage", updateAuthState);
    updateAuthState();

    return () => {
      window.addEventListener("storage", updateAuthState);
    };
  },[]);

  // Cerrar menús con Escape y clicks fuera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus en búsqueda móvil cuando se abre
  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Buscando:", searchQuery);
      setIsMobileSearchOpen(false);
    }
  };

  const handleLogin = () => {
    console.log("Redirigir a login");
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleRegister = () => {
    console.log("Redirigir a registro");
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleMobileMenuOpen = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileSearchToggle = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  // Generar iniciales del usuario
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-container">
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <button
                type="button"
                className="mobile-search-back"
                onClick={() => setIsMobileSearchOpen(false)}
                aria-label="Cerrar búsqueda"
              >
                <Icon name="arrowLeft" size={20} />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                className="mobile-search-input"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="mobile-search-btn"
                aria-label="Buscar"
              >
                <Icon name="search" size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn mobile-only"
              aria-label="Abrir menú"
              onClick={handleMobileMenuOpen}
            >
              <Icon name="menu" size={20} />
            </button>
            {/* Logo */}
            <Link to="/" className="logo">
              eShop
              <span className="logo-extension">.com</span>
            </Link>
            {/* Desktop Search */}
            <div className="search-container desktop-only">
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="search-btn"
                  aria-label="Buscar"
                >
                  <Icon name="search" size={18} />
                </button>
              </form>
            </div>
            {/* Right Actions */}
            <div className="header-actions">
              {/* Mobile Search Button */}
              <button
                className="mobile-search-trigger mobile-only"
                aria-label="Buscar"
                onClick={handleMobileSearchToggle}
              >
                <Icon name="search" size={20} />
              </button>

              {/* Desktop User Menu */}
              <div
                className="user-menu-container desktop-only"
                ref={userMenuRef}
              >
                <button
                  className={`user-info ${isUserMenuOpen ? "active" : ""}`}
                  onClick={handleUserMenuToggle}
                  aria-label="Menú de usuario"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span className="user-initials">
                        {isAuthenticated ? (
                          getUserInitials(user?.name)
                        ) : (
                          <Icon name="user" size={16} />
                        )}
                      </span>
                    )}
                  </div>
                  <div className="user-text">
                    <span className="greeting">
                      {isAuthenticated
                        ? `Hola, ${user?.name?.split(" ")[0] || "Usuario"}`
                        : "Hola, Inicia sesión"}
                    </span>
                    <span className="account-text">
                      {isAuthenticated ? "Mi Cuenta" : "Cuenta y Listas"}
                    </span>
                  </div>
                  <Icon
                    name="chevronDown"
                    size={14}
                    className={`dropdown-arrow ${
                      isUserMenuOpen ? "rotated" : ""
                    }`}
                  />
                </button>

                {/* Desktop User Dropdown */}
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    {!isAuthenticated ? (
                      <div className="auth-section">
                        <div className="auth-header">
                          <Icon name="user" size={24} />
                          <span>Accede a tu cuenta</span>
                        </div>
                        <button
                          className="auth-btn primary"
                          onClick={handleLogin}
                        >
                          <Icon name="logIn" size={16} />
                          Iniciar Sesión
                        </button>
                        <button
                          className="auth-btn secondary"
                          onClick={handleRegister}
                        >
                          <Icon name="userPlus" size={16} />
                          Crear Cuenta
                        </button>
                      </div>
                    ) : (
                      <div className="user-section">
                        <div className="user-profile">
                          <div className="user-avatar large">
                            {user?.avatar ? (
                              <img src={user.avatar} alt={user.name} />
                            ) : (
                              <span className="user-initials">
                                {getUserInitials(user?.name)}
                              </span>
                            )}
                          </div>
                          <div className="user-details">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-email">{user?.email}</span>
                          </div>
                        </div>

                        <div className="user-links">
                          <Link to="/mi-cuenta" className="user-link">
                            <Icon name="user" size={16} />
                            Mi Cuenta
                          </Link>
                          <Link to="/mis-pedidos" className="user-link">
                            <Icon name="package" size={16} />
                            Mis Pedidos
                          </Link>
                          <Link to="/lista-deseos" className="user-link">
                            <Icon name="heart" size={16} />
                            Lista de Deseos
                          </Link>
                          <Link to="/configuracion" className="user-link">
                            <Icon name="settings" size={16} />
                            Configuración
                          </Link>
                        </div>

                        <div className="logout-section">
                          <button className="logout-btn" onClick={handleLogout}>
                            <Icon name="logOut" size={16} />
                            Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="cart-btn"
                aria-label="Ver carrito de compras"
              >
                <Icon name="shoppingCart" size={24} />
                <span className="cart-badge">{totalItems}</span>
              </Link>

              {/* Desktop Theme Toggle */}
              <button
                className="theme-btn desktop-only"
                onClick={toggleTheme}
                aria-pressed={isDarkMode}
                aria-label="Cambiar tema"
              >
                <Icon name={isDarkMode ? "sun" : "moon"} size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <Navigation />

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={handleMobileMenuClose}>
          <div
            className="mobile-menu-content"
            ref={mobileMenuRef}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="mobile-menu-header">
              <div className="mobile-menu-logo">
                <span className="logo">eShop.com</span>
              </div>
              <button
                className="mobile-menu-close"
                aria-label="Cerrar menú"
                onClick={handleMobileMenuClose}
              >
                <Icon name="x" size={24} />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="mobile-menu-body">
              {/* User Section */}
              <div className="mobile-user-section">
                {!isAuthenticated ? (
                  <div className="mobile-auth-section">
                    <div className="mobile-auth-header">
                      <Icon name="user" size={32} />
                      <div>
                        <h3>¡Hola!</h3>
                        <p>Inicia sesión para una mejor experiencia</p>
                      </div>
                    </div>
                    <div className="mobile-auth-buttons">
                      <button
                        className="mobile-auth-btn primary"
                        onClick={handleLogin}
                      >
                        <Icon name="logIn" size={20} />
                        Iniciar Sesión
                      </button>
                      <button
                        className="mobile-auth-btn secondary"
                        onClick={handleRegister}
                      >
                        <Icon name="userPlus" size={20} />
                        Crear Cuenta
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <span className="user-initials">
                          {getUserInitials(user?.name)}
                        </span>
                      )}
                    </div>
                    <div className="mobile-user-details">
                      <span className="mobile-user-name">{user?.name}</span>
                      <span className="mobile-user-email">{user?.email}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Categories Navigation - Principal */}
              <nav className="mobile-categories-nav">
                <h4>Compra por Categoría</h4>
                <Navigation
                  isMobile={true}
                  onLinkClick={handleMobileMenuClose}
                />
              </nav>

              {/* User Account Links - Solo si está autenticado */}
              {isAuthenticated && (
                <nav className="mobile-main-nav">
                  <h4>Mi Cuenta</h4>
                  <Link
                    to="/mi-cuenta"
                    className="mobile-nav-link"
                    onClick={handleMobileMenuClose}
                  >
                    <Icon name="user" size={20} />
                    Mi Perfil
                  </Link>
                  <Link
                    to="/mis-pedidos"
                    className="mobile-nav-link"
                    onClick={handleMobileMenuClose}
                  >
                    <Icon name="package" size={20} />
                    Mis Pedidos
                  </Link>
                  <Link
                    to="/lista-deseos"
                    className="mobile-nav-link"
                    onClick={handleMobileMenuClose}
                  >
                    <Icon name="heart" size={20} />
                    Lista de Deseos
                  </Link>
                  <Link
                    to="/configuracion"
                    className="mobile-nav-link"
                    onClick={handleMobileMenuClose}
                  >
                    <Icon name="settings" size={20} />
                    Configuración
                  </Link>
                </nav>
              )}

              {/* Settings and Support */}
              <nav className="mobile-support-nav">
                <h4>Configuración y Ayuda</h4>
                <button className="mobile-nav-link" onClick={toggleTheme}>
                  <Icon name={isDarkMode ? "sun" : "moon"} size={20} />
                  <span>{isDarkMode ? "Modo Claro" : "Modo Oscuro"}</span>
                </button>
                <Link
                  to="/ayuda"
                  className="mobile-nav-link"
                  onClick={handleMobileMenuClose}
                >
                  <Icon name="helpCircle" size={20} />
                  Centro de Ayuda
                </Link>
                <Link
                  to="/contacto"
                  className="mobile-nav-link"
                  onClick={handleMobileMenuClose}
                >
                  <Icon name="messageCircle" size={20} />
                  Contactar Soporte
                </Link>
              </nav>

              {/* Logout */}
              {isAuthenticated && (
                <div className="mobile-logout-section">
                  <button className="mobile-logout-btn" onClick={handleLogout}>
                    <Icon name="logOut" size={20} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
