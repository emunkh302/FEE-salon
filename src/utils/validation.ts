// A simple email validation regex
export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// A simple phone number validation (e.g., 10 digits)
export const isValidPhoneNumber = (phone: string): boolean => {
    const regex = /^\d{10}$/;
    return regex.test(phone.replace(/\D/g, '')); // Remove non-digits before testing
};

// Password must be at least 8 characters long
export const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
};
