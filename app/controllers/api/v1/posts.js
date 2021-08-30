const db = global.db;
const validator = require("../../../lib/validators/categories");

//TODO: add validation on post atleast
module.exports = (router) => {
  router.get("/", async (req, res) => {
    const posts = await db.Posts.find({ deleted: false })
      .sort({ _id: -1 })
      .skip(req.query.offset ? parseInt(req.query.offset) : 0)
      .limit(req.query.limit ? parseInt(req.query.limit) : 0);

    res.http200({ data: posts });
  });

  router.get("/:id", async (req, res) => {
    const post = await db.Posts.findOne({ _id: req.params.id, deleted: false });
    res.http200({ data: post });
  });

  router.post("/", async (req, res) => {
    try {
      req.body.user = req.user;

      const post = await db.Posts.create(req.body);
      res.http200({ data: post });
    } catch (error) {
      res.http400({ error: error.toString() });
    }
  });

  router.put("/:id", async (req, res) => {
    const post = await db.Posts.updateOne({ _id: req.params.id }, req.body);
    res.http200({ data: post });
  });

  router.delete("/:id", async (req, res) => {
    const post = await db.Posts.delete({ _id: req.params.id });
    res.http200({ data: post });
  });
};
