let mongoose = require('mongoose');
let product = require('../models/product');

/*
 * GET /product route to retrieve all the products.
 */
function getProducts(req, res) {
    let query = product.find({});
    query.exec((err, products) => {
        if(err) res.send(err);
        res.json(products);
    });
}

/*
 * POST /product to save a new product.
 */
function storeProduct(req, res) {
    var newproduct = new product(req.body);
    newproduct.save((err, product) => {
        if(err) {
            res.send(err);
        }
        else {
            res.json({
                message: "Product successfully added!", product
            });
        }
    });
}

/*
 * GET /product/:id route to retrieve a product given its id.
 */
function getProduct(req, res) {
    product.findById(req.params.id, (err, product) => {
        if(err) res.send(err);
        res.json(product);
    });
}

/*
 * DELETE /product/:id to delete a product given its id.
 */
function deleteProduct(req, res) {
    product.remove({_id: req.params.id}, (err, result) => {
        res.json({message: "Product successfully deleted!", result});
    });
}

/*
 * PUT /product/:id to updatea a product given its id
 */
function updateProduct(req, res) {
    product.findById({_id: req.params.id}, (err, product) => {
        if(err) res.send(err);
        Object.assign(product, req.body).save((err, product) => {
            if(err) res.send(err);
            res.json({message: 'Product updated!', product});
        });
    });
}

module.exports = {getProducts, storeProduct, getProduct, deleteProduct, updateProduct};
