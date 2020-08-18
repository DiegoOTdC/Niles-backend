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
    const labels = result.labelAnnotations.map((item) => item.description);

    return labels;
  } catch (e) {
    console.log(e);
  }
};

const analyseBarcode = async (barcode) => {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { headers: { "User-Agent": "Niles - React Native - Version 1.0" } }
    );

    const { product_name, categories_tags, image_url } = response.data.product;

    const labels = categories_tags
      ? categories_tags.map((tag) => {
          const tagsplit = tag.split(":");

          return tagsplit[1];
        })
      : [`${product_name}`];

    const nameAndLabels = {
      name: product_name,
      labels: labels,
      url: image_url,
    };

    const productNotFound = {
      message: "Sorry, this product has not yet been added to our database",
    };

    if (product_name && labels) {
      return nameAndLabels;
    } else {
      return productNotFound;
    }
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

  const recipesNotFound = {
    message: `Sorry, we couldn't find any recipes with ${searchText}`,
  };
  if (!response.data.count) {
    return recipesNotFound;
  } else {
    return recipes;
  }
};

module.exports = { analyseImage, analyseBarcode, searchEdamam };
