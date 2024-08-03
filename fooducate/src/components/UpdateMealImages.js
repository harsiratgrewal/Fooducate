import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const PIXABAY_API_KEY = '44947028-3d3baa417ba72a7597d894e63';
const PIXABAY_URL = "https://pixabay.com/api/";

const UpdateMealImages = () => {
  const [meals, setMeals] = useState([]);

 useEffect(() => {
    // Fetch breakfast meals from Firestore
    const fetchMeals = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'breakfast'));
        const mealsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMeals(mealsData);
      } catch (error) {
        console.error("Error fetching meals: ", error);
      }
    };

    fetchMeals();
  }, []);

  const searchImage = async (query) => {
    const params = {
      key: PIXABAY_API_KEY,
      q: query,
      image_type: 'photo',
      per_page: 3 // Adjusted to a valid value
    };

    try {
      const response = await axios.get(PIXABAY_URL, { params });
      if (response.data.hits.length > 0) {
        return response.data.hits[0].webformatURL;
      }
      return null;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  const updateMealImages = async () => {
    for (let meal of meals) {
      const imageUrl = await searchImage(meal.name);
      if (imageUrl) {
        const mealDoc = doc(db, 'breakfast', meal.id);
        await updateDoc(mealDoc, { imageUrl: imageUrl });
        console.log(`Updated ${meal.name} with image URL: ${imageUrl}`);
      } else {
        console.log(`No image found for ${meal.name}`);
      }
    }
  };

  return (
    <div>
      <h1>Update Meal Images</h1>
      <button onClick={updateMealImages}>Update Images</button>
    </div>
  );
};

export default UpdateMealImages;