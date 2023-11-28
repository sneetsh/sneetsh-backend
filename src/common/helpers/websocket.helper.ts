import { Pagination } from '../interfaces/pagination.interface';

export const getPagination = (page: string, limit: string): Pagination => {
  // parse values
  let currPage = Number.parseInt(page);
  let perPage = Number.parseInt(limit);

  // check validity and set defaults where necessary
  currPage = currPage.toString() === Number.NaN.toString() ? 1 : currPage;
  perPage = perPage.toString() === Number.NaN.toString() ? 50 : perPage;

  // set boundaries
  currPage = currPage <= 0 ? 1 : currPage;
  perPage = perPage > 100 ? 100 : perPage;

  return {
    skip: currPage * perPage - perPage,
    take: perPage,
  };
};
