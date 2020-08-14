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
  console.log("image", image);
  try {
    //detect from external url
    const request = {
      // features: [
      //   {
      //     type: "WEB_DETECTION",
      //   },
      // ],
      image: {
        source: {
          imageUri: image,
        },
      },
    };

    //detect image from local storage
    const [result] = await client.labelDetection(request);
    console.log("the result:", result);
    const allLabels = result.labelAnnotations.map((item) => item.description);
    // console.log("Labels:");
    // console.log(allLabels[0].description);
    // const label = allLabels[0].description;

    // console.log("1st label:", label);
    console.log("these are all the labels", allLabels);
    return allLabels;
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

  console.log("this is the repsonse", response);
  const recipes = response.data.hits.map((i) => {
    const {
      label,
      image,
      source,
      sourceUrl,
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
      sourceUrl,
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
  console.log("recipes length", recipes.length);
  return recipes;
};

module.exports = { analyseImage, searchEdamam };
