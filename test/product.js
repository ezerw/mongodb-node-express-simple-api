process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

let should = chai.should();

chai.use(chaiHttp);

let Product = require('../models/product');

describe('Products', () => {
    beforeEach((done) => { //Clear DB before tests
        Product.remove({}, (err) => {
            done();
        });
    });

// GET Test getting all products
    describe('/GET products', () => {
        it('Should GET all the products', (done) => {
            chai.request(server)
                .get('/products')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

// POST Test storing product
    describe('/POST products', () => {
        it('Should not POST a product without price field', (done) => {
            let product = {
                name: "Google Pixel C",
                sku: "pixel_c",
            }

            chai.request(server)
                .post('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('price');
                    res.body.errors.price.should.have.property('kind').eql('required');
                    done();
                });
        });

        it('Should POST a product ', (done) => {
            let product = {
                name: "Google Chromecast Ultra",
                sku: "chromecast_ultra",
                price: 109,
            }

            chai.request(server)
                .post('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Product successfully added!');
                    res.body.product.should.have.property('name');
                    res.body.product.should.have.property('sku');
                    res.body.product.should.have.property('price');
                    done();
                });
        });
    });

// GET Test getting one product
    describe('/GET/:id products', () => {
        it('Should GET a product by the given id', (done) => {
            let product = new Product({
                name: "Pixel C Keyboard",
                sku: "pixel_c_keyboard",
                price: 219
            });

            product.save((err, product) => {
                chai.request(server)
                    .get('/products/' + product.id)
                    .send(product)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('sku');
                        res.body.should.have.property('price');
                        res.body.should.have.property('_id').eql(product.id);
                        done();
                    });
            });
        });
    });

// PUT Test updating a product
    describe('/PUT/:id product', () => {
        it('Should UPDATE a product given the id', (done) => {

            let product = new Product({
                name: "USB Type-C to HDMI Adapter",
                sku: "usb_type_c_to_hdmi_adapter",
                price: 69.99
            });

            product.save((err, product) => {
                chai.request(server)
                    .put('/products/' + product.id)
                    .send({
                        name: "USB Type-C to HDMI Adapter",
                        sku: "usb_type_c_to_hdmi_adapter",
                        price: 48.35
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Product updated!');
                        res.body.product.should.have.property('price').eql(48.35);
                        done();
                    });
            });
        });
    });

// DELETE Test deleting a product
    describe('/DELETE/:id product', () => {
        it('Should DELETE a product given the id', (done) => {

            let product = new Product({
                name: "USB Type-C to DisplayPort Cable",
                sku: "usb_type_c_to_displayport_cable",
                price: 69.99
            });

            product.save((err, product) => {
                chai.request(server)
                    .delete('/products/' + product.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Product successfully deleted!');
                        res.body.result.should.have.property('ok').eql(1);
                        res.body.result.should.have.property('n').eql(1);
                        done();
                    });
            });
        });
    });
});