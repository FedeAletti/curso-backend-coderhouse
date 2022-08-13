const express = require("express")
const fs = require("fs")

const app = express()

class Contenedor {
	constructor(nombreArchivo) {
		this.nombreArchivo = `./archivos/${nombreArchivo}.json`
	}

	async getData() {
		try {
			return await fs.promises.readFile(this.nombreArchivo, "utf8")
		} catch (err) {
			if (err.code == "ENOENT") {
				fs.writeFile(this.nombreArchivo, "[]", (err) => {
					if (err) throw err
					console.log("Se creo el archivo")
				})
			}
		}
	}

	async getAll() {
		const data = await this.getData()
		return JSON.parse(data)
	}

	async save(obj) {
		try {
			let fileContent = await this.getData()
			let jsonContent = JSON.parse(fileContent)
			let array = []
			const indice = jsonContent.map((x) => x.id).sort()
			obj.id = indice[indice.length - 1] + 1

			if (!obj.id) {
				obj.id = 1
				array = [{ ...obj }]
				await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(array))
				return array[0].id
			}

			jsonContent.push(obj)

			await fs.promises.writeFile(
				this.nombreArchivo,
				JSON.stringify(jsonContent)
			)
		} catch (err) {
			console.log(err)
		}
	}

	async getById(id) {
		const data = await this.getData()
		const jsonContent = JSON.parse(data)
		const obj = jsonContent.find((x) => x.id == id)
		return obj
	}

	async deleteById(id) {
		const data = await this.getData()
		const jsonContent = JSON.parse(data)
		const obj = jsonContent.find((x) => x.id == id)
		const index = jsonContent.indexOf(obj)
		jsonContent.splice(index, 1)
		await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(jsonContent))
	}

	async deleteAll() {
		try {
			fs.writeFile(this.nombreArchivo, "[]", (err) => {
				if (err) throw err
				console.log("Se creo el archivo")
			})
		} catch (err) {
			console.log(err)
		}
	}
}

const objetoContenedor = new Contenedor("productos")

const PORT = 8080

const server = app.listen(PORT, () => {
	console.log(`Servidor listening on port ${server.address().port}`)
})

server.on("error", (error) => console.log(`Error en servidor: ${error}`))

// Traer todos los productos
app.get("/productos", (req, res) => {
	objetoContenedor.getAll().then((data) => res.send(data))
})

// Traer producto random
app.get("/productoRandom", (req, res) => {
	objetoContenedor
		.getAll()
		.then((arrayProductos) =>
			objetoContenedor
				.getById(Math.floor(Math.random() * arrayProductos.length))
				.then((data) => res.send(data))
		)
})
