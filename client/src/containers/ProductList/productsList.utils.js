import { formatFilters } from '../../helpers/formatFilters';

export const getAllFiltersByBrand = (products) => {
  const allFiltersByBrand = formatFilters(products, 'brand').sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  return allFiltersByBrand;
};
