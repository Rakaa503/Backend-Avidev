import bcrypt from "bcrypt";

export interface PasswordOptions {
    saltRounds?: number;
}

export class Password {
    private static readonly DEFAULT_OPTIONS = Object.freeze({
        saltRounds: 12,
    });

    static async hash(
        password: string,
        options?: PasswordOptions
    ): Promise<string> {
        if (!password) {
            throw new Error("Password is required.");
        }

        const saltRounds =
            options?.saltRounds ??
            Password.DEFAULT_OPTIONS.saltRounds;

        return bcrypt.hash(password, saltRounds);
    }

    static async verify(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        if (!password || !hashedPassword) {
            return false;
        }

        return bcrypt.compare(
            password,
            hashedPassword
        );
    }

    static needsRehash(
        hashedPassword: string,
        options?: PasswordOptions
    ): boolean {
        try {
            const saltRounds =
                options?.saltRounds ??
                Password.DEFAULT_OPTIONS.saltRounds;

            return (
                bcrypt.getRounds(hashedPassword) !==
                saltRounds
            );
        } catch {
            return true;
        }
    }

    /**
     * Backward Compatibility
     */

    static async hashPassword(
        password: string
    ): Promise<string> {
        return Password.hash(password);
    }

    static async comparePassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return Password.verify(
            password,
            hashedPassword
        );
    }
}