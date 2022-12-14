const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render("shop/product-list", {
			prods: products,
			pageTitle: "All Products",
			path: "/products",
		});
	});
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render("shop/index", {
			prods: products,
			pageTitle: "Shop",
			path: "/",
		});
	});
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product.findById(productId, (product) => {
		res.render("shop/product-detail", {
			product: product,
			pageTitle: "Product Detail - " + product.title,
			path: `/products/:${product.id}`,
		});
	});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.addToCart(prodId, product.price);
	});

	res.redirect("/cart");
};

exports.getCart = (req, res, next) => {
	Cart.getCart((cart) => {
		// fetch the products
		Product.fetchAll((products) => {
			const cartProducts = [];
			for (p of products) {
				const cartProductData = cart.products.find((prod) => prod.id === p.id);
				if (cartProductData) {
					cartProducts.push({
						productData: p,
						quantity: cartProductData.quantity,
					});
				}
			}
			res.render("shop/cart", {
				path: "/cart",
				pageTitle: "Your Cart",
				products: cartProducts,
			});
		});
	});
};

exports.postDeleteCartProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.deleteProductFromCart(prodId, product);
		res.redirect("/cart");
	});
};

exports.getOrders = (req, res, next) => {
	res.render("shop/orders", {
		path: "/orders",
		pageTitle: "Your Orders",
	});
};

exports.getCheckout = (req, res, next) => {
	res.render("shop/checkout", {
		path: "/checkout",
		pageTitle: "Checkout",
	});
};
