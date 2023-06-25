export interface PayloadJwt {
  sub: number;
  email: string;
}

export interface JwtVerifyPayload extends PayloadJwt {
  iat: number;
  exp: number;
}
