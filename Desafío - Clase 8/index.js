const express = require("express")
const { Router } = express

const app = express()
const router = Router()
const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
	console.log(`Server listen on port: ${server.address().port}`)
})

server.on("error", (err) => console.log(`Error en el servidor: ${err}`))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/public", express.static(__dirname + "/public"))

app.use("/api/products", router)

let productsMock = [
	{
		title: "Zomo Dry Zahara",
		price: 680,
		thumbnail:
			"https://cdn.zomoofficial.com/wp-content/uploads/2020/02/ZOMO_2019_PY_50G_DRY_SAHARA.jpg",
		id: 1,
	},
	{
		title: "Zomo Framboera",
		price: 600,
		thumbnail:
			"https://cdn.zomoofficial.com/wp-content/uploads/2020/11/ZOMO_2019_PY_50G_FRAMBOERA.png",
		id: 2,
	},
	{
		title: "Zomo Cola Mint",
		price: 680,
		thumbnail:
			"https://cdn.zomoofficial.com/wp-content/uploads/2020/02/ZOMO_2019_PY_50G_COLA_MINT.jpg",
		id: 3,
	},
]

class Products {
	constructor(products) {
		this.products = products
	}

	getAll() {
		return this.products
	}

	findOne(id) {
		return this.products.find((product) => product.id == id)
	}

	addOne(product) {
		const lastItem = this.products[this.products.length - 1]
		let lastId = lastItem.id
		if (lastItem) {
			lastId = lastItem.id + 1
		}
		product.id = lastId
		this.products.push(product)
		return this.products[this.products.length - 1]
	}

	updateOne(id, product) {
		const productToInsert = { ...products, id }

		this.products.forEach((product) => {
			if (product.id == id) {
				product = productToInsert
				return product
			}
		})
	}

	deleteOne(id) {
		const foundProducto = this.findOne(id)
		if (foundProducto) {
			this.products = this.products.filter((product) => product.id != id)
			return id
		}
		return undefined
	}
}

// Form de carga de productos
app.get("/form", (req, res) => {
	console.log("Entra")
	res.sendFile(__dirname + "/index.html")
})

// Logica APIRest
router.get("/", (req, res) => {
	const prods = new Products(productsMock)
	res.json(prods.getAll())
})

router.get("/:id", (req, res) => {
	const prods = new Products(productsMock)
	const productSearched = prods.findOne(req.params.id)
	if (productSearched) {
		res.json(productSearched)
	} else {
		res.json({ error: "Producto no encontrado" })
	}
})

router.post("/", (req, res) => {
	const { body } = req
	body.price = parseInt(body.price)

	if (body.title && body.price && body.thumbnail) {
		const prods = new Products(productsMock)
		const productAdded = prods.addOne(body)
		res.json({ success: "ok", new: productAdded })
	} else {
		res.json({ error: "Datos incompletos, vuelva a cargar el product" })
	}
})

router.put("/:id", (req, res) => {
	const { id } = req.params
	const { title, price, thumbnail } = req.body
	price = parseInt(price)

	const prods = new Products(productsMock)
	const productUpdated = prods.updateOne(id, { title, price, thumbnail })
	if (productUpdated) {
		res.json({ success: "ok", id })
	} else {
		res.json({ error: "Producto no encontrado" })
	}
})

router.delete("/:id", (req, res) => {
	const { id } = req.params
	const prods = new Products(productsMock)

	id = parseInt(id)

	const productDeleted = prods.deleteOne(id)

	if (productDeleted) {
		res.json({ success: "ok", id })
	} else {
		res.json({ error: "Producto no encontrado" })
	}
})
