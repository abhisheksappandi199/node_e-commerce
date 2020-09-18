const Category = require('../models/category')
const categoryController = {}

categoryController.list = (req, res) => {
    Category.find()
        .then((categorys) => {
            res.json(categorys)
        })
        .catch((err) => {
            res.json(err)
        })
}

categoryController.show = (req, res) => {
    const id = req.params.id
    Category.findById(id)
        .then((category) => {
            if (category) {
                res.json(category)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}
// admin-rights
categoryController.create = (req, res) => {
        const body = req.body 
        const category = new Category(body)
        category.save()
            .then((category) => {
                res.json(category)
            })
            .catch((err) => {
                res.json(err)
            })
}

// admin - rights
categoryController.update = (req, res) => {
    const id = req.params.id
    const body = req.body
    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .then((category) => {
            if (category) {
                res.json(category)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

categoryController.destroy = (req, res) => {
    const id = req.params.id
    Category.findByIdAndDelete(id)
        .then((category) => {
            if (category) {
                res.json(category)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}


module.exports = categoryController