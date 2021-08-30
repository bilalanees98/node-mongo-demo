const db = global.db;
const validator = require("../../../lib/validators/users");

module.exports = (router) => {
  router.post("/signup", validator.signup, async (req, res) => {
    const emailExists = await db.Users.countDocuments({
      email: req.body.email,
    });
    if (emailExists) {
      return res.http400("Email already exists");
    }
    req.body.password = db.Users.getHashedPassword(req.body.password);
    const user = await db.Users.create(req.body);

    res.http200({ user: user, token: user.createAPIToken() });
  });

  router.post("/login", validator.login, async (req, res) => {
    const user = await db.Users.findOne({
      email: req.body.email,
      password: db.Users.getHashedPassword(req.body.password),
    });
    if (user) {
      res.http200({ user: user, token: user.createAPIToken() });
    } else {
      res.http400("Invalid email or password");
    }
  });

  router.get("/profile", async (req, res) => {
    res.http200({ user: req.user });
  });

  router.put("/", async (req, res) => {
    const user = await db.Users.updateOne({ _id: req.user._id }, req.body);
    res.http200({ user: user });
  });

  router.get("/posts", async (req, res) => {
    try {
      const posts = await db.Posts.find({ user: req.user._id }).populate(
        "user"
      );
      res.http200({ posts: posts });
    } catch (error) {
      res.http400({ error: error.toString() });
    }
  });
};
