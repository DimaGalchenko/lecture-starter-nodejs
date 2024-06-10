import {userRepository} from "../repositories/userRepository.js";

class UserService {

    search(search) {
        const item = userRepository.getOne(search);
        if (!item) {
            return null;
        }
        return item;
    }

    create(user) {
        const userWithSameEmail = userRepository.getOne({
            email: user.email
        });
        if (userWithSameEmail) {
            throw new Error(`User with email '${user.email}' already exist.`);
        }
        const userWithSamePhoneNumber = userRepository.getOne({
            phoneNumber: user.phoneNumber
        })
        if (userWithSamePhoneNumber) {
            throw new Error(`User with phone number '${user.phoneNumber}' already exist`)
        }
        return userRepository.create(user);
    }

    getById(id) {
        const user = userRepository.getOne({
            id: id
        });
        if (!user) {
            throw new Error(`User with id '${id}' does not exist`)
        }
        return user;
    }

    getAll() {
        return userRepository.getAll();
    }

    updateById(id, user) {
        const existedUser = userRepository.getOne({
            id: id
        });
        if (!existedUser) {
            const error = new Error(`User with id '${id}' does not exist`);
            error.code = 404;
            throw error;
        }

        if (user.email) {
            const userWithSameEmail = userRepository.getOne({
                email: user.email
            });
            if (userWithSameEmail) {
                const error = new Error(`User with email '${user.email}' already exist.`);
                error.code = 400;
                throw error;
            }
        }

        if (user.phoneNumber) {
            const userWithSamePhoneNumber = userRepository.getOne({
                phoneNumber: user.phoneNumber
            })
            if (userWithSamePhoneNumber) {
                const error = new Error(`User with phone number '${user.phoneNumber}' already exist`);
                error.code = 400;
                throw error;
            }
        }

        return userRepository.update(id, user);
    }

    deleteById(id) {
        const user = userRepository.getOne({
            id: id
        });
        if (!user) {
            throw new Error(`User with id '${id}' does not exist`)
        }
        return userRepository.delete(id);
    }
}

const userService = new UserService();

export {userService};
