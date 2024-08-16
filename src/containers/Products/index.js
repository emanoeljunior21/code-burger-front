import React, { useEffect, useState } from 'react'

import ProductsLogo from '../../assets/products-logo.svg'
import { Container, ProductsImg, CategoryButton, CategoriesMenu } from './styles'
import api from '../../services/api'


function Products() {
    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState([0])


    useEffect(() => {
        async function loadCategories() {
            try {
                const { data }= await api.get('categories');

                const newCategories = [{ id: 0, name: 'Todos'}, ...data]
                 

                setCategories(newCategories)
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
            }
        }

        loadCategories();
    }, []);


    return <Container>
        <ProductsImg src={ProductsLogo} alt='logo da home' />
        <CategoriesMenu>
        { categories && categories.map( category => (
            <CategoryButton type="button"
             key={category.id}
             isActiveCategory={activeCategory === category.id}
              onClick={() => {
                setActiveCategory(category.id)}}
                >
                    {category.name}
                    </CategoryButton>
        ))}
        </CategoriesMenu>
        </Container>
}

export default Products