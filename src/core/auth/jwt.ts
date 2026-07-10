import jwt, {
    type Secret,
    type SignOptions,
    type JwtPayload as DefaultJwtPayload,
} from "jsonwebtoken";
import { env } from "../config";

export interface AccessTokenPayload {
    id: number;
    username: string;
    role: string;
}

export interface RefreshTokenPayload {
    id: number;
}

const ACCESS_SECRET: Secret = env.JWT_SECRET;
const REFRESH_SECRET: Secret =
    env.JWT_REFRESH_SECRET ?? env.JWT_SECRET;

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

export const signAccessToken = (
    payload: AccessTokenPayload
): string => {
    const options: SignOptions = {
        expiresIn: ACCESS_EXPIRES_IN,
    };

    return jwt.sign(payload, ACCESS_SECRET, options);
};

export const signRefreshToken = (
    payload: RefreshTokenPayload
): string => {
    const options: SignOptions = {
        expiresIn: REFRESH_EXPIRES_IN,
    };

    return jwt.sign(payload, REFRESH_SECRET, options);
};

export const verifyAccessToken = (
    token: string
): AccessTokenPayload => {
    return jwt.verify(
        token,
        ACCESS_SECRET
    ) as AccessTokenPayload;
};

export const verifyRefreshToken = (
    token: string
): RefreshTokenPayload => {
    return jwt.verify(
        token,
        REFRESH_SECRET
    ) as RefreshTokenPayload;
};

export const decodeToken = (
    token: string
): DefaultJwtPayload | string | null => {
    return jwt.decode(token);
};

/**
 * Backward Compatibility
 */

export const signToken = signAccessToken;
export const verifyToken = verifyAccessToken;