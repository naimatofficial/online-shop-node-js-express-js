const { Console } = require("console");
const fs = require("fs");
const path = require("path");

const p = path.join(
	path.dirname(process.mainModule.filename),
	"data",
	"cart.json"
);

module.exports = class Cart {
	static addToCart(id, productPrice) {
		// fetch the privous cart
		fs.readFile(p, (err, fileContent) => {
			let cart = { products: [], totalPrice: 0 };
			if (!err) {
				cart = JSON.parse(fileContent);
			}
			// Analyze the cart ==> find existing product
			const existingProductIndex = cart.products.findIndex(
				(prod) => prod.id === id
			);

			const existingProduct = cart.products[existingProductIndex];
			// add new product / increse the quantity and price
			let updatedProduct;
			if (existingProduct) {
				updatedProduct = { ...existingProduct };
				updatedProduct.quantity = updatedProduct.quantity + 1;
				cart.products = [...cart.products];
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				updatedProduct = { id: id, quantity: 1 };
				cart.products = [...cart.products, updatedProduct];
			}
			console.log("productPrice = ", productPrice);
			cart.totalPrice = cart.totalPrice + +productPrice;
			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.log(err);
			});
		});
	}

	// delete item from cart
	static deleteProductFromCart(id, _product) {
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				return;
			}
			// access the cart data from fileContent or data
			const updatedCart = { ...JSON.parse(fileContent) };
			// find the given product to delete them from the list
			const product = updatedCart.products.find((prod) => prod.id === id);
			if (!product) {
				return;
			}
			//  get the updated quantity
			const productQty = product.quantity;
			// filter the cart array -->  updatedCart from product array
			updatedCart.products = updatedCart.products.filter(
				(prod) => prod.id !== id
			);
			console.log("updated: ", productQty, _product.price);
			// update the total price
			updatedCart.totalPrice =
				updatedCart.totalPrice - _product.price * productQty;
			console.log("updatedtotalPirce: ", updatedCart.totalPrice);
			// save the updateCart in the file
			fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
				console.log(err);
			});
		});
	}

	static getCart(cb) {
		fs.readFile(p, (err, fileContent) => {
			const cart = JSON.parse(fileContent);
			if (err) {
				cb(null);
			} else {
				cb(cart);
			}
		});
	}
};
