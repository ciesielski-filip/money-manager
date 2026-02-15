const express = require('express')
const app = express()
const cors = require('cors')
const port = 3001
const dbConfig = require('./databaseConfig/databaseConfig')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(dbConfig.url, {
}).then(() => {
    console.log("Database connected")
}).catch(err => {
    console.log("test", err);
    process.exit();
})

const path = require('node:path');
const fs = require('node:fs');
const folderPath = 'public/banery';
const multer = require('multer')

app.use(cors()) 
app.use(express.json());
app.use('/public', express.static('public'))
//////////////////////////////////////////////////

//Banery
const BaneryModel = require("./models/banery")
app.get("/banery", (req, res) => {
    BaneryModel.find()
    .then(banery => res.json(banery))
    .catch(err => res.json(err))
});

app.get("/baneryPublic", (req, res) => {
  res.send(fs.readdirSync(folderPath).map(fileName => {
    return {
      path: path.join(folderPath, fileName),
      name: fileName
    }
  }));
})

app.delete("/banery/:id", (req, res) => {
  const { id } = req.params;

  BaneryModel.findByIdAndDelete(id)
      .then(() => {
          console.log(`Baner - ${id} - usunięty`);
          res.status(200).send();
      })
      .catch(err => {
          console.error(`Błąd w usuwaniu - ${id}`, err);
          res.status(500).send();
      });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/banery')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })

app.post("/upload-image", upload.single("image"), async (req, res) => {
  console.log(req.body)
  const imageName = req.file.filename

  try {
    await BaneryModel.create({url: "http://localhost:3001/public/banery/"+imageName})
    res.json({ status: "ok" })
  } 
  catch (error) {
    res.json({ status: error })
  }
})

app.post("/restoreBanner", async (req, res) => {
  const imageName = req.body.fileName

  try {
    if (fs.existsSync(folderPath)) {
      const imageUrl = `http://localhost:3001/public/banery/${imageName}`;
      await BaneryModel.create({url: imageUrl})
      res.json({ status: "ok" })
    }
    else {
      res.json({ status: "nok" })
    }
  } catch (err) {
    console.error(err);
    res.json({ status: "nok" })
  }
})

app.get("/get-image", async(req, res) => {
  try {
    BaneryModel.find({}).then(data => {
      res.send({status: "ok", data: data})
    })
  }
  catch (error) {
    res.json({ status: error })
  }
})
//////////////////////////////////////////////////

//Opinie
const OpinieModel = require("./models/opinie")
app.get("/opinie", (req, res) => {
    OpinieModel.find()
    .then(opinie => res.json(opinie))
    .catch(err => res.json(err))
});

app.delete("/opinie/:id", (req, res) => {
  const { id } = req.params;

  OpinieModel.findByIdAndDelete(id)
      .then(() => {
          console.log(`Opinia - ${id} - usunięta `);
          res.status(200).send();
      })
      .catch(err => {
          console.error(`Błąd w usuwaniu - ${id}`, err);
          res.status(500).send();
      });
});
//////////////////////////////////////////////////

//Newsletter
const NewsletterModel = require("./models/newsletter")
app.get("/newsletter", (req, res) => {
    NewsletterModel.find()
    .then(mail => res.json(mail))
    .catch(err => res.json(err))
});

app.post("/restoreMails", async (req, res) => {
  const mail = req.body.inputData
  try {
    await NewsletterModel.create({mail: mail})
    res.json({ status: "ok" })
  } 
  catch (error) {
    res.json({ status: error })
  }
})

app.delete("/mails/:id", (req, res) => {
  const { id } = req.params;

  NewsletterModel.findByIdAndDelete(id)
      .then(() => {
          console.log(`Mail - ${id} - usunięty `);
          res.status(200).send();
      })
      .catch(err => {
          console.error(`Błąd w usuwaniu - ${id}`, err);
          res.status(500).send();
      });
});
//////////////////////////////////////////////////


//Produkt 
const ProduktModel = require("./models/produkt")
app.get("/produkt", (req, res) => {
    ProduktModel.find()
    .then(produkt => res.json(produkt))
    .catch(err => res.json(err))
});

app.get("/produkt-sort", async (req, res) => {
  try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 9;
    const search = req.query.search || "";
		let sort = req.query.sort ? req.query.sort.split(",") : ["cena"];
		let kategoria = req.query.kategoria || "All";
		const categoryOptions = await KategorieModel.distinct("nazwaKategorii");

		kategoria === "All"
			? (kategoria = [...categoryOptions])
			: (kategoria = req.query.kategoria.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const productsSort = await ProduktModel.find({ nazwa: { $regex: search, $options: "i" } })
      .where("kategoria")
			.in([...kategoria])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await ProduktModel.countDocuments({
			kategoria: { $in: kategoria },
			nazwa: { $regex: search, $options: "i" },
		});

		res.status(200).json({
      error: false,
      total,
      page: page + 1,
      limit,
      categories: categoryOptions,
      productsSort,
    });

	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

const guidMap = []
const storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!guidMap.filter( x => {
      return x.guid == req.body.guid
    }).length){
      const mainFolder = `public/produkty/${Date.now()}-${req.body.name}`;
      const subFolder = path.join(mainFolder, 'zdjecia');

      fs.mkdirSync(mainFolder, { recursive: true });
      fs.mkdirSync(subFolder, { recursive: true });

      guidMap.push({ guid: req.body.guid, mainFolder: mainFolder, subFolder: subFolder, mainFile: "", array: [] })
    }
    const element = guidMap.find( x => x.guid == req.body.guid)
    const mainFolder = element.mainFolder

    console.log("Glowny folder - " + mainFolder);
    
    cb(null, mainFolder);
  },
  filename: function (req, file, cb) {
    const uniqueFileMain = `${Date.now()}-${file.originalname}`;
    const uniqueFileOther = `/zdjecia/${Date.now()}-${file.originalname}`;

    let mainObject = guidMap.find( x => x.guid == req.body.guid)

    let mainName = null
    const czyToPierwszyPlik = file.fieldname === "image"
    if (czyToPierwszyPlik) {
      console.log("Glowne zdjecie - " + uniqueFileMain);
      mainName = uniqueFileMain
      mainObject.mainFile = uniqueFileMain
    }
    else {
      console.log("Reszta zdjec - " + uniqueFileOther);
      mainName = uniqueFileOther
      
      mainObject.array.push(uniqueFileOther)
    }

    cb(null, mainName);
  },

});

const uploadProduct = multer({ storage: storageProduct })
app.post("/upload-product", uploadProduct.fields([{ name: "image", maxCount: 1}, { name: "multipleImages", maxCount: 4 }]), async (req, res) => {
  let mainObject = guidMap.find( x => x.guid == req.body.guid)

  guidMap == [
    ...guidMap.filter(x => x.guid != req.body.guid)
  ]

  try {
    const singleImagePath = `http://localhost:3001/${mainObject.mainFolder}/${mainObject.mainFile}`
    const multipleImages = mainObject.array.map( x => `http://localhost:3001/${mainObject.mainFolder}${x}`)

    let funkcjeArray = req.body.selectedOptions.split(",");

    await ProduktModel.create({
      nazwa: req.body.name,
      cena: req.body.price,
      cena_prom: req.body.promoPrice,
      opis: req.body.description,
      krotki_opis: req.body.shortDescription,
      funkcje: funkcjeArray,
      ilosc: req.body.quantity,
      glowne_zdjecie: singleImagePath,
      zdjecia: multipleImages,
      kategoria: req.body.selectedCategory,
      link: req.body.link
    })
    res.json({ status: "ok" })
  } 
  catch (error) {
    res.json({ status: error })
    console.log(error)
  }
})

app.delete("/produkt/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params)

  try {
    const product = await ProduktModel.findById(id);

    if (!product) {
      return res.status(404).send("nie ma produktu o podanym id");
    }

    await ProduktModel.findByIdAndDelete(id);
    console.log(`Produkt - ${id} - usunięta z bazy`);

    const folderPathtable = product.glowne_zdjecie.split("/")
    const folderPath = path.join(__dirname, 'public', 'produkty', folderPathtable[5])

    fs.rmdirSync(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Błąd podczas usuwania katalogu:', err);
        return res.status(500).send("blad");
      }
      console.log('Folder produktu został usunięty:', folderPath);
    });
    res.status(200).send();

  } catch (err) {
    console.error(`Błąd w usuwaniu produktu - ${id}`, err);
    res.status(500).send("blad");
  }
});


//Funkcje
const FunkcjeModel = require("./models/funkcje")
app.get("/funkcje", (req, res) => {
  FunkcjeModel.find()
    .then(funkcje => res.json(funkcje))
    .catch(err => res.json(err))
});

app.post("/restoreFunkcje", async (req, res) => {
  const functionName = req.body.functionName
  try {
    await FunkcjeModel.create({funkcja: functionName})
    res.json({ status: "ok" })
  } 
  catch (error) {
    res.json({ status: error })
  }
})

app.delete("/funkcje/:id", (req, res) => {
  const { id } = req.params;

  FunkcjeModel.findByIdAndDelete(id)
      .then(() => {
          console.log(`Funkcja - ${id} - usunięta `);
          res.status(200).send();
      })
      .catch(err => {
          console.error(`Błąd w usuwaniu - ${id}`, err);
          res.status(500).send();
      });
});
//////////////////////////////////////////////////

//Kategorie
const KategorieModel = require("./models/kategorie")
app.get("/kategorie", (req, res) => {
  KategorieModel.find()
    .then(kategorie => res.json(kategorie))
    .catch(err => res.json(err))
});

const storageCategories = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/kategorie')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + file.originalname)
  }
})
const uploadCategories = multer({ storage: storageCategories })
app.post("/upload-category", uploadCategories.single("image"), async (req, res) => {
  console.log(req.body)
  const iconName = req.file.filename
  const categoryName = req.body.categoryName
  const categoryDescription = req.body.categoryDescription

  try {
    await KategorieModel.create({ikona: "http://localhost:3001/public/kategorie/"+iconName, nazwaKategorii: categoryName, opisKategorii: categoryDescription})
    res.json({ status: "ok" })
  } 
  catch (error) {
    res.json({ status: error })
  }
})

app.delete("/kategorie/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await KategorieModel.findById(id);
    if (!category) {
      return res.status(404).send("nie ma kategorii");
    }

    await KategorieModel.findByIdAndDelete(id);
    console.log(`Kategoria - ${id} - usunięta z bazy`);

    const imagePath = path.join(__dirname, 'public', 'kategorie', path.basename(category.ikona));

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Błąd podczas usuwania pliku:', err);
        return res.status(500).send("blad");
      }
      console.log('Plik zdjęcia usunięty:', imagePath);
    });
    res.status(200).send();

  } catch (err) {
    console.error(`Błąd w usuwaniu kategorii - ${id}`, err);
    res.status(500).send("blad");
  }
});
//////////////////////////////////////////////////




//////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})