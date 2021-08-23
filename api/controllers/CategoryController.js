var Category = require('../models/Category')

exports.create = function (req, res) {
  var newCat = new Category(req.body)
  newCat.usr_id = req.usr_id

  Category.create(newCat, function (err, category) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({state: "Success", category: category});
  })
}

exports.search = function (req, res) {
  req.query.name = req.query.name === undefined ? "%" : "%" + req.query.name + "%"
  req.query.usr_id = req.usr_id
  Category.search(req.query, function (err, categories) {
    if (err) {
        res.status(500).send({ message: err.message});
    } else {
        console.log(categories);
        res.status(200).send({categories: categories});
    }
  })
}

exports.getDetail = function (req, res) {
    params = {
        cat_id: parseInt(req.params.cat_id),
        usr_id: req.usr_id
    }
    Category.getDetail(params, function (err, categories) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            res.status(200).send({category: categories[0]});
        }
    })
}

exports.update = function (req, res) {
    req.body.cat_id = parseInt(req.params.cat_id);
    req.body.usr_id = req.usr_id
    Category.update(req.body, function (err, cat) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            res.status(200).send({category: cat});
        }
    })
}