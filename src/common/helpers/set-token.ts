import { Response } from 'express';
import { Token } from '../types/token.type';

export const setTokenToCookie = (res: Response, token: Token) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
  });
};
