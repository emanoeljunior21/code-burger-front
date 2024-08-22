import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as Yup from 'yup';

import api from '../../../services/api';
import { Container, Label, Input, ButtonStyles, LabelUpload } from './styles';
import { ErrorMessage } from '../../../components';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

function NewProduct() {
  const [fileName, setFileName] = useState(null);
  const [categories, setCategories] = useState([]);
  const { push } = useHistory()

  const schema = Yup.object().shape({
    name: Yup.string().required('Digite o nome do produto'),
    price: Yup.number().required('Digite o preço do produto').positive('O preço deve ser um valor positivo'),
    category: Yup.object().required('Escolha uma categoria'),
    file: Yup.mixed()
      .required('Carregue um arquivo')
      .test('fileSize', 'Carregue arquivos de até 2MB', value => value && value[0]?.size <= 2097152)
      .test('type', 'Carregue arquivos JPEG ou PNG', value => value && (value[0]?.type === 'image/jpeg' || value[0]?.type === 'image/png'))
  });

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async data => {
    const productDataFormData = new FormData();
    
    productDataFormData.append('name', data.name);
    productDataFormData.append('price', data.price);
    productDataFormData.append('category_id', data.category.id);
    productDataFormData.append('file', data.file[0])

    await toast.promise(api.post('products', productDataFormData), {
        pending: 'Criando novo produto...',
        success: 'Produto criado com sucesso',
        error: 'Falha ao criar o produto'
    })
    setTimeout(() => {
      push('/listar-produtos')
    }, 2000);
  };

  useEffect(() => {
    async function loadCategories() {
      const { data } = await api.get('categories');
      setCategories(data);
    }
    loadCategories();
  }, []);

  return (
    <Container>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>Nome</Label>
          <Input type='text' {...register('name')} />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </div>
        <div>
          <Label>Preço</Label>
          <Input type='number' step='0.01' {...register('price')} />
          <ErrorMessage>{errors.price?.message}</ErrorMessage>
        </div>

        <div>
          <LabelUpload>
            {fileName || (
              <>
                <CloudUploadIcon />
                Carregue a Imagem do Produto
              </>
            )}
            <input
              type='file'
              id='image-input'
              accept='image/png, image/jpeg'
              {...register('file')}
              onChange={e => {
                if (e.target.files.length > 0) {
                  setFileName(e.target.files[0]?.name);
                }
              }}
            />
          </LabelUpload>
          <ErrorMessage>{errors.file?.message}</ErrorMessage>
        </div>

        <div>
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <ReactSelect
                {...field}
                options={categories}
                getOptionLabel={cat => cat.name}
                getOptionValue={cat => cat.id}
                placeholder='Categorias'
              />
            )}
          />
          <ErrorMessage>{errors.category?.message}</ErrorMessage>
        </div>

        <ButtonStyles type="submit">Adicionar Produto</ButtonStyles>
      </form>
    </Container>
  );
}

export default NewProduct;
