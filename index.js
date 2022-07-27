const fs = require("fs")

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

const objetoInicial = {
	title: "Narguila Blunt Rey",
	price: 15000,
	thumbnail:
		"https://http2.mlstatic.com/D_NQ_NP_736500-MLA47459981465_092021-W.jpg",
}

const objeto1 = new Contenedor("productos")
objeto1.getData()
objeto1.save(objetoInicial)
objeto1.getById(1).then((data) => console.log(data))
objeto1.deleteById(1)
objeto1.deleteAll()
