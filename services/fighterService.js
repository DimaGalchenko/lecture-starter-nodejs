import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {

    create(fighter) {
        const fighterWithSameName = fighterRepository.getOne({
            name: fighter.name
        });

        if (fighterWithSameName) {
            throw new Error(`Fighter with name '${fighter.name}' already exist`)
        }

        return fighterRepository.create(fighter);
    }

    getAll() {
       return fighterRepository.getAll();
    }

    getById(id) {
        const user = fighterRepository.getOne({id: id});
        if (!user) {
            throw new Error(`Fighter with id '${id}' does not exist`);
        }
        return user;
    }

    updateById(id, fieldsToUpdate) {
        const user = fighterRepository.getOne({id: id});
        if (!user) {
            const error = new Error(`Fighter with id '${id}' does not exist`);
            error.code = 404;
            throw error;
        }
        if (fieldsToUpdate.name) {
            const fighterWithSameName = fighterRepository.getOne({
                name: fieldsToUpdate.name
            });

            if (fighterWithSameName) {
                const error = new Error(`Fighter with name '${fieldsToUpdate.name}' already exist`);
                error.code = 400;
                throw error;
            }
        }

        return fighterRepository.update(id, fieldsToUpdate);
    }

    deleteById(id) {
        const fighter = fighterRepository.getOne({
            id: id
        });
        if (!fighter) {
            throw new Error(`User with id '${id}' does not exist`)
        }
        return fighterRepository.delete(id);
    }
}

const fighterService = new FighterService();

export { fighterService };
