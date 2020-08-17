const { Router } = require("express");
const { analyseImage } = require("../utils");
const { analyseBarcode } = require("../utils");
const router = new Router();

router.post("/image", async (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  try {
    const imageLabel = await analyseImage(imageUrl);
    res.send({ imageLabel });
  } catch (e) {
    res.status(400).send({ message: "Sorry! Something went wrong" });
    next(e);
  }
});

router.get("/barcode", async (req, res, next) => {
  const barcode = 8710398159458;
  try {
    const barcodeLabels = await analyseBarcode(barcode);

    res.send({ barcodeLabels });
  } catch (e) {
    res.status(400).send({ message: "Sorry! Something went wrong" });
    next(e);
  }
});

module.exports = router;
