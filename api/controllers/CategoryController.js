var Category = require('../models/Category')
var notifHelper = require('../helpers/NotifHelper');

exports.create = function (req, res) {
  var newCat = new Category(req.body)
  newCat.usr_id = req.usr_id

  Category.create(newCat, function (err, category) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({category: category, notif: notifHelper.getNotif("createCategorySuccess", [newCat.name])});
  })
}

exports.search = function (req, res) {
  req.query.name = req.query.name === undefined ? "%" : "%" + req.query.name + "%"
  req.query.usr_id = req.usr_id
  Category.search(req.query, function (err, categories) {
    if (err) {
        res.status(500).send({ message: err.message});
    } else {
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
            res.status(200).send({category: cat, notif: notifHelper.getNotif("updateCategorySuccess", [req.body.name])});
        }
    })
}

exports.getPortfolioValueForeachCat = function (req, res) {
    Category.getPortfolioValueForeachCat(req.usr_id, function (err, values) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            res.status(200).send({state: "Success", values: values})
        }
    })
}

exports.getPortfolioValueForeachType = function (req, res) {
    Category.getPortfolioValueForeachType(req.usr_id, function (err, values) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            res.status(200).send({state: "Success", values: values})
        }
    })
}

exports.getUserAssetsInEachCat = function (req, res) {
    console.log("geting")
    Category.getUserAssetsWithCategoryDetails(req.usr_id, function (err, values) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            const categories = values.map(item => item.cat_id).filter((value, index, self) => self.indexOf(value) === index);
            var assetsByCat = {}
            categories.forEach(c => {
                assetsByCat[c] = []
            })
            values.forEach(v => {
                assetsByCat[v.cat_id].push(v)
            });

            res.status(200).send({assetsByCat: assetsByCat, categoryIds: categories})
        }
    })
}