import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Pagination } from '../interfaces/pagination.interface';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // parse values
    let page = Number.parseInt(req.query.page as string);
    let perPage = Number.parseInt(req.query.limit as string);

    // check validity and set defaults where necessary
    page = page.toString() === Number.NaN.toString() ? 1 : page;
    perPage = perPage.toString() === Number.NaN.toString() ? 50 : perPage;

    // set boundaries
    page = page <= 0 ? 1 : page;
    perPage = perPage > 100 ? 100 : perPage;

    const pagination: Pagination = {
      skip: page * perPage - perPage,
      take: perPage,
    };

    req['pagination'] = pagination;
    next();
  }
}
