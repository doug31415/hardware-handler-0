import { useEffect, useState } from 'react';
import { getAllProducts } from '../services/productApi';
import { FETCH_PRODUCT_DATA_ERROR } from '../constants/constants';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getAllProducts();
      if (allProducts === FETCH_PRODUCT_DATA_ERROR) {
        setError(true);
      }

      setProducts(allProducts);
    };

    fetchProducts();
  }, []);

  return { products, error };
};

export { useProducts };
