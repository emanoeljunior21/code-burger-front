import React, { useState, useEffect } from 'react'

import { useCart } from '../../hooks/CartContext'
import { Container } from './styles'
import { Button } from '../Button'
import formatCurrency from '../../utils/formatCurrency'
import api from '../../services/api'
import { toast } from 'react-toastify'

export function CartResume() {
    const [finalPrice, setFinalPrice] = useState(0)
    const [deliveryTax] = useState(5)
    const [loading, setLoading] = useState(false)

    const { cartProducts } = useCart()

    useEffect(() => {
        const sumAllItems = cartProducts.reduce((acc, current) => {
            return current.price * current.quantity + acc 
        }, 0)

        setFinalPrice(sumAllItems)
    }, [cartProducts])

    const submitOrder = async () => {
        setLoading(true)
        try {
            const order = cartProducts.map(product => ({
                id: product.id,
                quantity: product.quantity
            }))

            await toast.promise(
                api.post('orders', { products: order }),
                {
                    pending: 'Realizando o seu pedido',
                    success: 'Pedido realizado com sucesso', 
                    error: 'Falha ao realizar o seu pedido, tente novamente'
                }
            )
        } catch (error) {
            console.error('Error submitting order:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Container>
                <div className='container-top'>
                    <h2 className='title'>Resumo do Pedido</h2>
                    <p className='items'>Itens</p>
                    <p className='items-price'>{formatCurrency(finalPrice)}</p>
                    <p className='delivery-tax'>Taxa de Entrega</p>
                    <p className='delivery-tax-price'>{formatCurrency(deliveryTax)}</p>
                </div>
                <div className='container-bottom'>
                    <p>Total</p>
                    <p>{formatCurrency(finalPrice + deliveryTax)}</p>
                </div>
            </Container>
            <Button
                style={{ width: '100%', marginTop: 30 }}
                onClick={submitOrder}
                disabled={loading}
            >
                {loading ? 'Finalizando...' : 'Finalizar Pedido'}
            </Button>
        </div>
    )
}
