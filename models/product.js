const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

// set the path
const p = path.join(
	path.dirname(process.mainModule.filename),
	"data",
	"products.json"
);

const getProductsFromFile = (cb) => {
	// fileContent or data
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb([]); // callback function
		} else {
			cb(JSON.parse(fileContent));
		}
	});
};

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		// set the data
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			// if the given product have existing product then update its values only
			if (this.id) {
				// find the index of the product from given id
				const existingProductIndex = products.findIndex(
					(prod) => prod.id === this.id
				);
				// set the updatedProducts array
				const updatedProducts = [...products];
				// update the product data from existing product index
				updatedProducts[existingProductIndex] = this;
				// save the data in file and check the eroors
				// if error is come than display in the console
				fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
					console.log(err);
				});
			}
			// if the given data is not existing from its array or list
			// than add them new product in array
			else {
				// set the random id (unique id for every product)
				this.id = Math.floor(
					Math.random() * Math.floor(Math.random() * Date.now())
				).toString();
				// push or add the data from its given products array
				products.push(this);
				// save the product data in the file
				fs.writeFile(p, JSON.stringify(products), (err) => {
					console.log(err);
				});
			}
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static findById(id, cb) {
		getProductsFromFile((products) => {
			const product = products.find((p) => p.id === id);
			cb(product);
		});
	}

	static deleteById(id) {
		getProductsFromFile((products) => {
			const product = products.find((prod) => prod.id === id);
			// filter the existing product list and save on new list expect the deleled product
			const updatedProducts = products.filter((prod) => prod.id !== id);
			fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
				if (!err) {
					Cart.deleteProductFromCart(id, product);
				}
			});
		});
	}
};
