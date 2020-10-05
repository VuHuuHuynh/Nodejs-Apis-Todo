const PROD = require("../models/product.model");

exports.create = async (req, res) => {
  try {
    let prod = new PROD(req.body);
    prod.createBy = req.user;

    await prod.save();

    return res.jsonp({
      message: "success",
      id: prod._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).jsonp({
      message: error,
    });
  }
};

exports.prodByID = async (req, res, next, id) => {
  try {
    console.log(id);
    if (!req.user.roles.includes("SUPERUSER"))
      return res.status(401).json({
        message: "Do not exist product or Unauthorized",
      });

    const prod = await PROD.findOne({ _id: id });

    if (!prod) return res.status(404).jsonp({ message: "cannot find prod" });

    req.prod = prod; //luu tam thoi gia tri vao request -> call lai o trong delete func de thuc hien delete

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).jsonp({
      message: error,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const prods = req.prod;
    const updateObject = req.body;
    await prods.updateOne({ $set: updateObject });
    return res.jsonp({ message: "sucess" });
  } catch (error) {
    console.log(error);
    return res.status(500).jsonp({
      message: error,
    });
  }
};

exports.list = async (req, res) => {
  try {
    const prods = await PROD.find({})
      .select({
        createBy: 0,
      })
      .lean();

    return res.jsonp({ message: "success", prods });
  } catch (error) {
    console.log(error);
    return res.status(500).jsonp({
      message: error,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const prods = req.prod;
    await prods.remove();
    return res.jsonp({ message: "sucess" });
  } catch (error) {
    console.log(error);
    return res.status(500).jsonp({
      message: error,
    });
  }
};
