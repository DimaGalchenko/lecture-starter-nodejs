import {USER} from "../models/user.js";

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && emailRegex.test(email) && email.endsWith('@gmail.com');
}

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\+380\d{9}$/;
    return phoneNumber && phoneRegex.test(phoneNumber);
}

function isValidPassword(password) {
    return password && typeof password === 'string' && password.length >= 3;
}

function isBlank(value) {
    return !value || typeof value !== 'string' || value.trim() === ''
}

function validateUserFields(fields, object) {
    const errors = [];
    for (const field of fields) {
        const value = object[field];
        switch (field) {
            case 'firstName':
                if (isBlank(value)) {
                    errors.push('First name must be a non-empty string');
                }
                break;
            case 'lastName':
                if (isBlank(value)) {
                    errors.push('Last name must be a non-empty string');
                }
                break;
            case 'email':
                if (!isValidEmail(value)) {
                    errors.push('Email must be a valid gmail address');
                }
                break;
            case 'phoneNumber':
                if (!isValidPhoneNumber(value)) {
                    errors.push('Phone number must be in the format +380xxxxxxxxx');
                }
                break;
            case 'password':
                if (!isValidPassword(value)) {
                    errors.push('Password must be at least 3 characters long');
                }
        }
    }
    return errors;
}

function usersKeysExcludeId() {
    return Object.keys(USER).filter(key => key !== 'id');
}

function userRequestContainsAllFields(userRequest) {
    const userModelKeys = usersKeysExcludeId().sort();
    const userRequestKeys = Object.keys(userRequest).sort();
    return JSON.stringify(userModelKeys) === JSON.stringify(userRequestKeys);
}

function containsOnlyUserFields(user) {
    const userModelKeys = Object.keys(USER);
    const userKeys = Object.keys(user);
    return userKeys.every(field => userModelKeys.includes(field));
}

const createUserValid = (req, res, next) => {
    const userRequest = req.body;

    const hasAllUserFields = userRequestContainsAllFields(userRequest);

    if (!hasAllUserFields) {
        res.status(400);
        next(new Error('All user fields should be provided'))
        return;
    }

    const providedFields = Object.keys(userRequest);
    const errors = validateUserFields(providedFields, userRequest);

    if (errors.length > 0) {
        res.status(400);
        next(new Error(errors.join('\n')))
    }
    next();
};

const updateUserValid = (req, res, next) => {
    const fieldsToUpdate = req.body;

    const userModelKeys = usersKeysExcludeId();
    const providedFields = Object.keys(fieldsToUpdate);

    const hasAtLeastOneField = providedFields.some(field => userModelKeys.includes(field));

    if (!hasAtLeastOneField) {
        res.status(400);
        next(new Error('At least one field must be provided to update.'));
        return;
    }

    if (!containsOnlyUserFields(fieldsToUpdate)) {
        res.status(400);
        next(new Error('Request should contains only user fields'));
        return;
    }

    const errors = validateUserFields(providedFields, fieldsToUpdate);

    if (errors.length > 0) {
        res.status(400);
        next(new Error(errors.join('\n')));
        return;
    }

    next();
};

export {createUserValid, updateUserValid};
