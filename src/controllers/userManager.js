const userServiceInstance = require("../services/user.service.js");
const generateToken = require("../utils/jsonwebtoken.js");

class UserController {
  async userRegister(req, res) {
    let userData = req.body;

    try {
      const newUserRegister = await userServiceInstance.userRegister(userData);

      // Create token
      const token = generateToken({ id: newUserRegister._id });

      res.cookie("ecommerceCookie", token, { maxAge: 3600000, httpOnly: true });

      res.redirect("/login");
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async userLogin(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userServiceInstance.userLogin(email, password);
      const token = generateToken({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        rol: user.role,
        id: user._id,
      });

      res.cookie("ecommerceCookie", token, { maxAge: 3600000, httpOnly: true });

      res.redirect("/api/sessions/current");
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async current(req, res) {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "There is not user authenticated" });
    }
    const user = req.user;
    res.status(200).json(user);
  }

  async logout(req, res) {
    res.clearCookie("ecommerceCookie");
    res.redirect("/login");
  }
}

const userControllerInstance = new UserController();
module.exports = userControllerInstance;
