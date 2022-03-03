import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import {
  ADD_NEW_PRODUCT_ERROR,
  ADD_NEW_PRODUCT_SUCCESS,
  FETCH_DEPARTMENT_DATA_ERROR,
} from '../../constants/constants';
import { useDeparments } from '../../hooks/useDepartmens';
import * as productApi from '../../services/productApi';
import './ProductForm.css';

const defaultsForNewProduct = {
  departmentId: null,
  name: '',
  brand: '',
  description: '',
  retailPrice: 0,
};

function ProductForm() {
  const [newProduct, setNewProduct] = useState({ ...defaultsForNewProduct });
  const [loading, setLoading] = useState(true);
  const { departments, error } = useDeparments();

  useEffect(() => {
    if (departments.length > 0 || error === true) {
      setLoading(false);
    }
  }, [departments, error]);

  const onChange = (propName, val) => {
    const updatedProduct = { ...newProduct };
    updatedProduct[propName] = val;
    setNewProduct(updatedProduct);
  };

  const isValid = () => {
    if (!newProduct.departmentId) {
      return false;
    }
    if (!newProduct.name) {
      return false;
    }
    if (!newProduct.brand) {
      return false;
    }
    if (!newProduct.retailPrice) {
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    setLoading(true);
    const addProduct = await productApi.addNewProduct(newProduct);
    if (addProduct !== ADD_NEW_PRODUCT_ERROR) {
      setNewProduct({ ...defaultsForNewProduct });
      toast.success(ADD_NEW_PRODUCT_SUCCESS);
    } else {
      toast.error(`${addProduct} Please refresh the page and try again.`);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="product-form-header">Add A New Product</h1>
      {loading ? <Loader message="Loading new product form data..." /> : null}
      {error ? (
        <div className="fatal-error">{`${FETCH_DEPARTMENT_DATA_ERROR} Please try again later`}</div>
      ) : null}
      {!loading && !error ? (
        <form className="product-form">
          <ul className="product-form-list">
            <li className="product-form-list-item">
              <label htmlFor="department">Department</label>
              <select
                className="product-form-dropdown"
                id="department"
                value={newProduct.departmentId || ''}
                onChange={(e) =>
                  onChange('departmentId', Number(e.target.value) || null)
                }
              >
                <option key={-1} value="">
                  Please select a department...
                </option>
                {departments.length > 0
                  ? departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))
                  : null}
              </select>
            </li>
            <li className="product-form-list-item">
              <label htmlFor="name">Product Name</label>
              <input
                className="product-form-input"
                id="name"
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => onChange('name', e.target.value)}
              />
            </li>
            <li className="product-form-list-item">
              <label htmlFor="brand">Brand</label>
              <input
                className="product-form-input"
                id="brand"
                type="text"
                placeholder="Brand"
                value={newProduct.brand}
                onChange={(e) => onChange('brand', e.target.value)}
              />
            </li>
            <li className="product-form-list-item">
              <label htmlFor="description">Description</label>
              <textarea
                className="product-form-input"
                id="description"
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => onChange('description', e.target.value)}
              />
            </li>
            <li className="product-form-list-item">
              <label htmlFor="price">Retail Price</label>
              <input
                className="product-form-input"
                id="price"
                type="number"
                min="0"
                placeholder="Retail Price in Cents"
                value={newProduct.retailPrice}
                onChange={(e) =>
                  onChange('retailPrice', Number(e.target.value))
                }
              />
            </li>
            <li className="product-form-list-item">
              <button
                data-testid="submit"
                type="button"
                className="primary"
                onClick={onSubmit}
                disabled={!isValid()}
              >
                Submit
              </button>
            </li>
          </ul>
        </form>
      ) : null}
    </div>
  );
}

export default ProductForm;
