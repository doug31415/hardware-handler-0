import { useEffect, useState } from 'react';
import { FETCH_CHECKOUT_PRODUCTS_ERROR } from '../constants/constants';
import { getAllCheckoutItems } from '../services/checkoutApi';

const useCheckoutItems = (checkoutUpdated) => {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [error, setError] = useState(false);
  const [checkoutCount, setCheckoutCount] = useState(0);

  useEffect(() => {
    const fetchCheckoutItems = async () => {
      const allCheckoutItems = await getAllCheckoutItems();
      if (allCheckoutItems === FETCH_CHECKOUT_PRODUCTS_ERROR) {
        setError(true);
        setCheckoutCount('n/a');
      } else {
        setCheckoutCount(allCheckoutItems.length);
      }

      setCheckoutItems(allCheckoutItems);
    };

    fetchCheckoutItems();
  }, [checkoutUpdated, checkoutItems]);

  return { checkoutItems, checkoutCount, setCheckoutItems, error };
};

export { useCheckoutItems };
