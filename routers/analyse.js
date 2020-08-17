const { Router } = require("express");
const { analyseImage } = require("../utils");
const { analyseBarcode } = require("../utils");
const router = new Router();

router.post("/image", async (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  try {
    const labels = await analyseImage(imageUrl);
    console.log("do we get he labels?", labels);
    res.send({ labels });
  } catch (e) {
    res.status(400).send({ message: "Sorry! Something went wrong" });
    next(e);
  }
});

router.get("/barcode/:barcodeId", async (req, res, next) => {
  const barcode = req.params.barcodeId;

  try {
    const response = await analyseBarcode(barcode);
    console.log("what is in labels here?", response);
    res.send(response);
  } catch (e) {
    res.status(400).send({ message: "Sorry! Something went wrong" });
    next(e);
  }
});

module.exports = router;
