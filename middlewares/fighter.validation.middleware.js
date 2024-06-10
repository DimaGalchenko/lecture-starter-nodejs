import {FIGHTER} from "../models/fighter.js";

function isBlank(value) {
    return !value || typeof value !== 'string' || value.trim() === ''
}

function isInRange(value, from, to) {
    return value && typeof value === 'number' && value >= from && value <= to;
}

function fighterRequestContainsAllFields(fighterRequest) {
    const fighterModelKeys = Object.keys(FIGHTER)
        .filter(key => key !== 'id')
        .filter(key => key !== 'health')
        .sort();
    const fighterRequestKeys = Object.keys(fighterRequest)
        .filter(key => key !== 'health')
        .sort();
    return JSON.stringify(fighterModelKeys) === JSON.stringify(fighterRequestKeys);
}

function validateFighterFields(fighter) {
    const fields = Object.keys(fighter);
    const errors = [];
    for (const field of fields) {
        const value = fighter[field];
        switch (field) {
            case 'name':
                if (isBlank(value)) {
                    errors.push('Name must be a non-empty string')
                }
                break;
            case 'health':
                if (!isInRange(value, 80, 120)) {
                    errors.push('Health must be in range from 80 to 120 inclusive');
                }
                break;
            case 'power':
                if (!isInRange(value, 1, 100)) {
                    errors.push('Power must be in range from 1 to 100 inclusive');
                }
                break;
            case 'defense':
                if (!isInRange(value, 1, 10)) {
                    errors.push('Defense must be in range from 1 to 10 inclusive')
                }
                break;
        }
    }
    return errors;
}

function containsOnlyFighterFields(fighter) {
    const fighterModelKeys = Object.keys(FIGHTER);
    const fighterKeys = Object.keys(fighter);
    return fighterKeys.every(field => fighterModelKeys.includes(field));
}

const createFighterValid = (req, res, next) => {
    const fighterRequest = req.body;
    const hasAllFighterFields = fighterRequestContainsAllFields(fighterRequest);

    if (!hasAllFighterFields) {
        res.status(400);
        next(new Error('All fighter fields should be provided'))
        return;
    }

    if (!fighterRequest.health) {
        fighterRequest.health = 85;
    }

    const errors = validateFighterFields(fighterRequest);

    if (errors.length > 0) {
        res.status(400);
        next(new Error(errors.join('\n')))
    }
    next();
}


function fighterKeysExcludeId() {
    return Object.keys(FIGHTER).filter(key => key !== 'id');
}

const updateFighterValid = (req, res, next) => {
    const fieldsToUpdate = req.body;

    const fighterModelKeys = fighterKeysExcludeId();
    const providedFields = Object.keys(fieldsToUpdate);

    const hasAtLeastOneField = providedFields.some(field => fighterModelKeys.includes(field));

    if (!hasAtLeastOneField) {
        res.status(400);
        next(new Error('At least one field must be provided to update.'));
        return;
    }


    if (!containsOnlyFighterFields(fieldsToUpdate)) {
        res.status(400);
        next(new Error('Request should contains only fighter fields'));
        return;
    }

    const errors = validateFighterFields(fieldsToUpdate);

    if (errors.length > 0) {
        res.status(400);
        next(new Error(errors.join('\n')));
        return;
    }

    next();
};

export {createFighterValid, updateFighterValid};
