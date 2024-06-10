import { userService } from "./userService.js";

class AuthService {
  login(userData) {
    const user = userService.search(userData);
    if (!user) {
      throw Error("User not found");
    }
    console.log(user)
    return user;
  }
}

const authService = new AuthService();

export { authService };
