import React, { useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom';

import api from '../../../services/api'

import { Container, Img, EditIconStyles } from './styles'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CancelIcon from '@mui/icons-material/Cancel';

import formatCurrency from '../../../utils/formatCurrency'
import paths from '../../../constants/paths';



export function ListProducts() {
    const [products, setProducts] = useState()
    const { push } =  useHistory()
    
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const { data } = await api.get('products');
                
                setProducts(data)
               
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
            }
           
        };


        loadOrders();
       
    }, []);

      function isOffer(offerStatus) {
        if(offerStatus) {
          return <CheckBoxIcon style={{color: '#228b22'}}/>
        }
        return <CancelIcon style={{color: '#CC1717'}}/>
      } 
    
      function editProduct(product) {
          push(paths.EditProduct, {product})
        }
      

    return (
    <Container>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Preço</TableCell>
            <TableCell align='center'>Produto em Oferta</TableCell>
            <TableCell align='center'>Imagem do Produto</TableCell>
            <TableCell>Editar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products && 
          products.map((products) => (
            <TableRow
              key={products.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {products.name}
              </TableCell>
              <TableCell>{formatCurrency(products.price)}</TableCell>
              <TableCell align='center'>{isOffer(products.offer)}</TableCell>
              <TableCell align='center'><Img src={products.url} alt='imagem-produto' /></TableCell>
              <TableCell>
                <EditIconStyles onClick={() => editProduct(products)}/>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
    )
}

export default ListProducts