import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProductsLogo from '../../assets/products-logo.svg';
import formatCurrency from '../../utils/formatCurrency';
import { Container, ProductsImg, CategoryButton, CategoriesMenu, ProductsContainer } from './styles';
import api from '../../services/api';
import { CardProduct } from '../../components';

export function Products({ location: { state } }) {
    
    const initialCategoryId = state?.categoryId || 0;


    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(initialCategoryId);

   
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const { data } = await api.get('categories');
                setCategories([{ id: 0, name: 'Todos' }, ...data]);
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
            }
        };

        const loadProducts = async () => {
            try {
                const { data: allProducts } = await api.get('products');
                const formattedProducts = allProducts.map(product => ({
                    ...product,
                    formatedPrice: formatCurrency(product.price),
                }));
                setProducts(formattedProducts);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            }
        };

        loadCategories();
        loadProducts();
    }, []);

    
    useEffect(() => {
        if (activeCategory === 0) {
            setFilteredProducts(products);
        } else {
            const newFilteredProducts = products.filter(
                product => product.category_id === activeCategory
            );
            setFilteredProducts(newFilteredProducts);
        }
    }, [activeCategory, products]);

    return (
        <Container>
            <ProductsImg src={ProductsLogo} alt='Logo da home' />
            <CategoriesMenu>
                {categories.map(category => (
                    <CategoryButton
                        key={category.id}
                        type="button"
                        isActiveCategory={activeCategory === category.id}
                        onClick={() => setActiveCategory(category.id)}
                    >
                        {category.name}
                    </CategoryButton>
                ))}
            </CategoriesMenu>
            <ProductsContainer>
                {filteredProducts.map(product => (
                    <CardProduct key={product.id} product={product} />
                ))}
            </ProductsContainer>
        </Container>
    );
}

Products.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            categoryId: PropTypes.number,
        }),
    }),
};
