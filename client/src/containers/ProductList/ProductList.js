import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Product from '../../components/Product/Product';
import Loader from '../../components/Loader/Loader';
import {
  PRODUCT_ADDED_TO_CHECKOUT_SUCCESS,
  FETCH_DEPARTMENT_DATA_ERROR,
  FETCH_PRODUCT_DATA_ERROR,
  MULTIPLE_ERRORS,
} from '../../constants/constants';
import * as checkoutApi from '../../services/checkoutApi';
import './ProductList.css';
import { getAllFiltersByBrand } from './productsList.utils';
import { useDeparments } from '../../hooks/useDepartmens';
import { useProducts } from '../../hooks/useProducts';

function ProductList({ updateCheckoutCount }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [filtersByBrand, setFiltersByBrand] = useState([]);
  const [filtersByDepartment, setFiltersByDepartment] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const { products, error: productsError } = useProducts();
  const { departments, error: departmentsError } = useDeparments();

  useEffect(() => {
    if (departments.length > 0 || departmentsError === true) {
      setFiltersByDepartment(departments);
    }

    if (departmentsError) {
      setError(true);
      setFiltersByDepartment(FETCH_DEPARTMENT_DATA_ERROR);
    }

    setLoading(false);
  }, [departments, departmentsError]);

  useEffect(() => {
    if (products.length > 0 && !productsError) {
      const allFiltersByBrand = getAllFiltersByBrand(products);
      setFiltersByBrand(allFiltersByBrand);
    }

    if (productsError) {
      setError(true);
      setFiltersByBrand(FETCH_PRODUCT_DATA_ERROR);
    }

    setLoading(false);
  }, [products, productsError]);

  useEffect(() => {
    if (error === true) {
      if (
        products === FETCH_PRODUCT_DATA_ERROR &&
        filtersByDepartment === FETCH_DEPARTMENT_DATA_ERROR
      ) {
        setErrMsg(MULTIPLE_ERRORS);
      } else if (products === FETCH_PRODUCT_DATA_ERROR) {
        setErrMsg(FETCH_PRODUCT_DATA_ERROR);
      } else {
        setErrMsg(FETCH_DEPARTMENT_DATA_ERROR);
      }
    } else {
      setErrMsg('');
    }
  }, [error, products, filtersByDepartment]);

  const addItemToCheckout = async (product) => {
    const productAdded = await checkoutApi.addItemToCheckout(product);
    if (productAdded === PRODUCT_ADDED_TO_CHECKOUT_SUCCESS) {
      updateCheckoutCount();
      toast.success(PRODUCT_ADDED_TO_CHECKOUT_SUCCESS);
    } else {
      toast.error(productAdded);
    }

    setLoading(false);
    setErrMsg('');
    setError(false);
  };

  const onFilterChange = (filter) => {
    if (activeFilters.includes(filter)) {
      const filterIndex = activeFilters.indexOf(filter);
      const newFilters = [...activeFilters];
      newFilters.splice(filterIndex, 1);
      setActiveFilters(newFilters);
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  let filteredList;

  if (
    activeFilters.length === 0 ||
    activeFilters.length === filtersByBrand.length + filtersByDepartment.length
  ) {
    filteredList = products;
  } else {
    filteredList = products.filter(
      (item) =>
        activeFilters.includes(item.brand) ||
        activeFilters.includes(item.departmentId)
    );
  }

  return (
    <div className="product-list-container">
      <section className="filter-wrapper">
        <p className="filter-title">Filter by Department</p>
        <div className="filter-data">
          {error ? <p>Cannot load department filters.</p> : null}
          {!error &&
          filtersByDepartment.length &&
          typeof filtersByDepartment !== 'string'
            ? filtersByDepartment.map((filter) => (
                <span key={filter.id} className="filter-item">
                  <label htmlFor={filter.id}>{filter.name}</label>
                  <input
                    className="filter-checkbox"
                    id={filter.id}
                    type="checkbox"
                    checked={activeFilters.includes(filter.id)}
                    onChange={() => onFilterChange(filter.id)}
                  />
                </span>
              ))
            : null}
        </div>
        <p className="filter-title">Filter by Brand</p>
        <div className="filter-data">
          {error ? <p>Cannot load product brand filters.</p> : null}
          {!error && filtersByBrand.length
            ? filtersByBrand.map((filter) => {
                const key = filter.value;
                return (
                  <span key={key} className="filter-item">
                    <label htmlFor={key}>{filter.name}</label>
                    <input
                      className="filter-checkbox"
                      id={key}
                      type="checkbox"
                      checked={activeFilters.includes(filter.value)}
                      onChange={() => onFilterChange(filter.value)}
                    />
                  </span>
                );
              })
            : null}
        </div>
      </section>
      <h1 className="product-list-header">My Products</h1>
      <section className="products-container">
        {error ? (
          <p className="product-list-message">
            {errMsg} Please refresh the page or try again later.
          </p>
        ) : null}
        {loading ? <Loader message="Loading product list..." /> : null}
        <div className="product-list-product-wrapper">
          {!loading && !error && filteredList.length
            ? filteredList.map((product) => (
                <Product
                  key={product.id}
                  product={product}
                  addItemToCheckout={addItemToCheckout}
                />
              ))
            : null}
          {!loading && !error && !filteredList.length ? (
            <p className="product-list-message">
              There are no products that match your filters. Please clear some
              filters to see more producs.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default ProductList;

ProductList.propTypes = {
  updateCheckoutCount: PropTypes.func.isRequired,
};
