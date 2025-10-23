import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/common/Icon/Icon";
import categoriesData from "../../data/categories.json";
import "./Navigation.css";

const Navigation = ({ isMobile = false, onLinkClick }) => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Procesar las categorías para obtener solo las principales (sin parentCategory)
    const mainCategories = categoriesData.filter((cat) => !cat.parentCategory);
    setCategories(mainCategories);
  }, []);

  // Función para obtener subcategorías de una categoría principal
  const getSubcategories = (parentId) => {
    return categoriesData.filter(
      (cat) => cat.parentCategory && cat.parentCategory._id === parentId
    );
  };

  // Si es versión móvil, renderizar solo los enlaces principales
  if (isMobile) {
    return (
      <div className="mobile-navigation">
        {/* Ofertas especiales */}
        <Link
          to="/offers"
          className="mobile-nav-link special"
          onClick={onLinkClick}
        >
          <Icon name="tag" size={20} />
          Ofertas del día
        </Link>
        <Link
          to="/new"
          className="mobile-nav-link special"
          onClick={onLinkClick}
        >
          <Icon name="sparkles" size={20} />
          Novedades
        </Link>
        <Link
          to="/bestsellers"
          className="mobile-nav-link special"
          onClick={onLinkClick}
        >
          <Icon name="star" size={20} />
          Más vendidos
        </Link>
        <Link
          to="/flash-sale"
          className="mobile-nav-link special"
          onClick={onLinkClick}
        >
          <Icon name="zap" size={20} />
          Flash sale
        </Link>

        {/* Categorías principales */}
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category._id}`}
            className="mobile-nav-link"
            onClick={onLinkClick}
          >
            <Icon name="chevronRight" size={16} />
            {category.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="navigation">
      <div className="container">
        <div className="navigation-content">
          {/* Menú de todas las categorías */}
          <div className="categories-dropdown">
            <button
              className="categories-menu-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            >
              <Icon name="menu" size={16} />
              <span>Todas las categorías</span>
              <Icon name="chevronDown" size={14} />
            </button>

            {isDropdownOpen && (
              <div className="categories-dropdown-menu">
                {categories.map((category) => {
                  const subcategories = getSubcategories(category._id);
                  return (
                    <div key={category._id} className="category-group">
                      <Link
                        to={`/category/${category._id}`}
                        className="category-link main-category"
                      >
                        {category.name}
                        {subcategories.length > 0 && (
                          <Icon name="chevronRight" size={12} />
                        )}
                      </Link>

                      {subcategories.length > 0 && (
                        <div className="subcategories">
                          {subcategories.map((subcat) => (
                            <Link
                              key={subcat._id}
                              to={`/category/${subcat._id}`}
                              className="category-link sub-category"
                            >
                              {subcat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navegación horizontal */}
          <nav className="categories-nav">
            <Link to="/offers" className="nav-link special">
              Ofertas del día
            </Link>
            <Link to="/new" className="nav-link special">
              Novedades
            </Link>
            <Link to="/bestsellers" className="nav-link special">
              Más vendidos
            </Link>
            <Link to="/flash-sale" className="nav-link special">
              Flash sale
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
