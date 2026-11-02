import jwt, { SignOptions } from 'jsonwebtoken';
import { envConfig } from '../../config/env.config';

export interface JwtTokenPayload {
  id: string;
  username?: string;
  memberCode?: string;
  type: string;
}

export class JwtUtil {
  /** Sign JWT token with payload */
  static sign(payload: JwtTokenPayload, options?: SignOptions): string {
    const signOptions: SignOptions = {
      expiresIn: envConfig.jwtExpiresIn as any,
      ...options,
    };
    return jwt.sign(payload, envConfig.jwtSecret, signOptions);
  }

  /** Verify JWT token and return payload */
  static verify(token: string): JwtTokenPayload {
    return jwt.verify(token, envConfig.jwtSecret) as JwtTokenPayload;
  }
}
