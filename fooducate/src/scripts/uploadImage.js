const admin = require('firebase-admin');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin SDK
const serviceAccount = require('../serviceAccountKey.json'); // Update the path to your Firebase service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://proj-5f207.appspot.com', // Replace with your Firebase storage bucket
});

const db = admin.firestore();
const storage = admin.storage().bucket();

const pixabayApiKey = '44947028-3d3baa417ba72a7597d894e63';
const pixabayUrl = 'https://pixabay.com/api/';

async function downloadImage(url) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
  });
  const buffer = Buffer.from(response.data, 'binary');
  return buffer;
}

async function uploadToFirebaseStorage(fileBuffer, fileName) {
  const file = storage.file(`images/${fileName}`);
  await file.save(fileBuffer, { contentType: 'image/jpeg' });
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/gs://proj-5f207.appspot.com/o/images%2F${encodeURIComponent(fileName)}?alt=media`;
  return publicUrl;
}

async function updateDocumentWithImageURL(docId, collectionName, imageURL) {
  const docRef = db.collection(collectionName).doc(docId);
  await docRef.update({
    imageURL,
  });
}

async function processImage(recipeName, docId, collectionName) {
  try {
    const response = await axios.get(pixabayUrl, {
      params: {
        key: pixabayApiKey,
        q: recipeName,
        per_page: 3,
        image_type: 'photo'
      },
    });
    if (response.data.hits.length === 0) {
      console.error(`No images found for recipe: ${recipeName}`);
      return;
    }
    const imageUrl = response.data.hits[0].webformatURL;

    const fileBuffer = await downloadImage(imageUrl);

    const fileName = `${uuidv4()}.jpg`;
    const publicUrl = await uploadToFirebaseStorage(fileBuffer, fileName);

    // Update Firestore document with the new image URL
    await updateDocumentWithImageURL(docId, collectionName, publicUrl);
    console.log(`Image for ${recipeName} uploaded successfully.`);
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

async function processCollection(collectionName) {
  const querySnapshot = await db.collection(collectionName).get();
  const promises = querySnapshot.docs.map(async (docSnapshot) => {
    const docData = docSnapshot.data();
    await processImage(docData.name, docSnapshot.id, collectionName);
  });
  await Promise.all(promises);
  console.log(`All documents in collection ${collectionName} have been processed.`);
}

async function processAllCollections() {
  const collections = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];
  const promises = collections.map(collectionName => processCollection(collectionName));
  await Promise.all(promises);
  console.log('All collections have been processed.');
}

// Run the script
processAllCollections()
  .then(() => console.log('Image processing completed.'))
  .catch(error => console.error('Error processing images:', error));