const dotenv = require("dotenv");
const vision = require("@google-cloud/vision");

dotenv.config();

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
    const labels = result.labelAnnotations;
    console.log("Labels:");
    labels.forEach((label) => console.log(label.description));
  } catch (e) {
    console.log(e.message);
  }
};

analyseImage();
