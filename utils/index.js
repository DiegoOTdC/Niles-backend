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

const analyseImage = async () => {
  try {
    const filename = "./oreo.jpg";

    const [result] = await client.labelDetection(filename);
    const allLabels = result.labelAnnotations;
    console.log("Labels:");
    console.log(allLabels[0].description);
    const label = allLabels[0].description;

    console.log("1st label:", label);
  } catch (e) {
    console.log(e.message);
  }
};

const searchEdamam = async (queryText) => {
  const app_id = process.env.EDAMAM_ID;
  const app_key = process.env.EDAMAM_KEY;

  const response = await axios.get(
    `https://api.edamam.com/search?q=${queryText}&app_id=${app_id}&app_key=${app_key}`
  );
  console.log(response.data.hits[0].recipe);
};

module.exports = { analyseImage, searchEdamam };
