//should be in utils/index.js
require("dotenv").config();
const vision = require("@google-cloud/vision");
const axios = require("axios");

//Google Cloud Vision API
const client = new vision.ImageAnnotatorClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
});

const analyseImage = async (image) => {
  try {
    const request = {
      image: {
        source: {
          imageUri: image,
        },
      },
    };
    const [result] = await client.labelDetection(request);
    console.log("what is result?", result);
    const labels = result.labelAnnotations.map((item) => item.description);

    return labels;
  } catch (e) {
    console.log(e);
  }
};

const analyseBarcode = async (barcode) => {
  console.log("what is barcode?", barcode);

  const response = await axios.get(
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
    { headers: { "User-Agent": "Niles - React Native - Version 1.0" } }
  );

  // console.log("What is the response?", response.data.product);

  const { product_name, categories_tags, brands } = response.data.product;
  console.log("product name:", product_name);
  console.log("catergory_tags", categories_tags);
  console.log("brands", brands);

  const labels = categories_tags.map((tag) => {
    const tagsplit = tag.split(":");

    return tagsplit[1];
  });

  console.log("are these tags without 'en:' ?", labels);

  const nameAndLabels = { name: product_name, labels: labels };

  return nameAndLabels;

  try {
  } catch (e) {
    console.log(e);
  }
};

const searchEdamam = async (searchText) => {
  const app_id = process.env.EDAMAM_ID;
  const app_key = process.env.EDAMAM_KEY;

  const response = await axios.get(
    `https://api.edamam.com/search?q=${searchText}&app_id=${app_id}&app_key=${app_key}&to=100`
  );

  const recipes = response.data.hits.map((i) => {
    const {
      label,
      image,
      source,
      url,
      yield,
      dietLabels,
      healthLabels,
      cautions,
      ingredientLines,
      ingredients,
      calories,
      totalTime,
      totalNutrients,
      totalDaily,
      totalWeight,
    } = i.recipe;

    return {
      title: label,
      image,
      source,
      sourceUrl: url,
      text: ingredientLines,
      ingredients,
      portion: yield,
      dietLabels,
      healthLabels,
      cautions,
      calories,
      totalTime,
      totalNutrients,
      totalDaily,
      totalWeight,
    };
  });

  return recipes;
};

module.exports = { analyseImage, analyseBarcode, searchEdamam };
