const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
	console.log(`Server listen on port: ${server.address().port}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let prods = [
	{
		id: 1,
		name: "Producto 1",
		price: 100,
	},
	{
		id: 2,
		name: "Producto 2",
		price: 200,
	},
	{
		id: 3,
		name: "Producto 3",
		price: 300,
	},
]

app.get("/productos", (req, res) => {
	res.json(prods)
})

app.get("/producto", (req, res) => {
	const { query } = req
	if (query.price) {
		let prodFiltered = prods.filter((x) => x.price == query.price)
		res.json(prodFiltered)
	} else {
		res.json(prods)
	}
})

app.get("/producto/:id", (req, res) => {
	const { id } = req.params
	const found = prods.find((x) => x.id == id)
	if (found) {
		res.json(found)
	} else {
		res.status(404).send("Producto no encontrado")
	}
})

app.post("/producto", (req, res) => {
	const { body } = req
	console.log()
	prods.push(body)
	res.json(prods)
})

app.put("/producto/:id", (req, res) => {
	const { id } = req.params
	const { body } = req
	const found = prods.find((x) => x.id == id)
	if (found) {
		let newProduct = {
			...found,
			...body,
		}
		// found.name = body.name
		// found.price = body.price
		console.log(newProduct)
		res.json(newProduct)
	} else {
		res.status(404).send("Producto no encontrado")
	}
})

app.delete("/producto/:id", (req, res) => {
	const { id } = req.params
	const productsFilteredById = prods.filter((x) => x.id != id)
	if (productsFilteredById) {
		res.json(productsFilteredById)
	} else {
		res.status(404).send("Producto no encontrado")
	}
})
