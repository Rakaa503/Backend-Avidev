import jwt, {
    type Secret,
    type SignOptions,
    type JwtPayload as DefaultJwtPayload,
    TokenExpiredError,
    JsonWebTokenError,
} from "jsonwebtoken";

export interface AccessTokenPayload {
    id: number;
    username: string;
    role: string;
}

export interface RefreshTokenPayload {
    id: number;
}

export interface JWTConfig {
    accessSecret: Secret;
    refreshSecret: Secret;
    accessExpiresIn?: SignOptions["expiresIn"];
    refreshExpiresIn?: SignOptions["expiresIn"];
}

export class JWT {
    private static config: Readonly<JWTConfig> | null = null;

    static configure(config: JWTConfig): void {
        JWT.config = Object.freeze({
            accessExpiresIn: "15m",
            refreshExpiresIn: "7d",
            ...config,
        });
    }

    private static getConfig(): Readonly<JWTConfig> {
        if (!JWT.config) {
            throw new Error(
                "JWT is not configured. Call JWT.configure() first."
            );
        }

        return JWT.config;
    }

    private static isAccessPayload(
        payload: unknown
    ): payload is AccessTokenPayload {
        return (
            typeof payload === "object" &&
            payload !== null &&
            "id" in payload &&
            "username" in payload &&
            "role" in payload
        );
    }

    private static isRefreshPayload(
        payload: unknown
    ): payload is RefreshTokenPayload {
        return (
            typeof payload === "object" &&
            payload !== null &&
            "id" in payload
        );
    }

    static signAccessToken(
        payload: AccessTokenPayload
    ): string {
        const config = JWT.getConfig();

        return jwt.sign(payload, config.accessSecret, {
            expiresIn: config.accessExpiresIn,
        });
    }

    static signRefreshToken(
        payload: RefreshTokenPayload
    ): string {
        const config = JWT.getConfig();

        return jwt.sign(payload, config.refreshSecret, {
            expiresIn: config.refreshExpiresIn,
        });
    }

    static verifyAccessToken(
        token: string
    ): AccessTokenPayload {
        try {
            const config = JWT.getConfig();

            const payload = jwt.verify(
                token,
                config.accessSecret
            );

            if (!JWT.isAccessPayload(payload)) {
                throw new Error("Invalid access token payload.");
            }

            return payload;
        } catch (error) {
            if (
                error instanceof TokenExpiredError ||
                error instanceof JsonWebTokenError
            ) {
                throw new Error("Invalid or expired access token.");
            }

            throw error;
        }
    }

    static verifyRefreshToken(
        token: string
    ): RefreshTokenPayload {
        try {
            const config = JWT.getConfig();

            const payload = jwt.verify(
                token,
                config.refreshSecret
            );

            if (!JWT.isRefreshPayload(payload)) {
                throw new Error("Invalid refresh token payload.");
            }

            return payload;
        } catch (error) {
            if (
                error instanceof TokenExpiredError ||
                error instanceof JsonWebTokenError
            ) {
                throw new Error("Invalid or expired refresh token.");
            }

            throw error;
        }
    }

    static decode(
        token: string
    ): DefaultJwtPayload | string | null {
        return jwt.decode(token);
    }

    static isExpired(token: string): boolean {
        const payload = jwt.decode(token);

        if (
            payload === null ||
            typeof payload === "string"
        ) {
            return true;
        }

        if (payload.exp === undefined) {
            return true;
        }

        return payload.exp * 1000 <= Date.now();
    }

    /**
     * Backward Compatibility
     */

    static signToken(
        payload: AccessTokenPayload
    ): string {
        return JWT.signAccessToken(payload);
    }

    static verifyToken(
        token: string
    ): AccessTokenPayload {
        return JWT.verifyAccessToken(token);
    }
}