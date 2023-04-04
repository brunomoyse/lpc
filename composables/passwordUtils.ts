// composables/passwordUtils.ts

// @ts-ignore
import bcrypt from "bcryptjs";

const saltRounds = 10;

// Function to hash a password
const hashPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

// Function to compare a plaintext password and a hashed password
const comparePasswords = async (
    plaintextPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    try {
        const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
}

export {
    hashPassword,
    comparePasswords,
};
