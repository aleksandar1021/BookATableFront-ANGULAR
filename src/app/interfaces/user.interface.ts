export interface User {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    image?: string;
}

export interface ActivateUser {
    email: string;
    activationCode: string;
}