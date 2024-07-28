import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the path to your Firebase configuration

const generateRandomNutritionInfo = () => {
  const getRandomValue = (min, max) => Math.random() * (max - min) + min;

  return {
    energy: getRandomValue(50, 500).toFixed(2),
    totalFat: getRandomValue(1, 30).toFixed(2),
    carbohydrates: getRandomValue(10, 100).toFixed(2),
    protein: getRandomValue(5, 50).toFixed(2),
    sugar: getRandomValue(0, 50).toFixed(2),
    fiber: getRandomValue(0, 15).toFixed(2),
    sodium: getRandomValue(0, 1500).toFixed(2)
  };
};

const updateNutritionInfo = async () => {
  const collections = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];

  try {
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      snapshot.forEach(async (docSnap) => {
        const nutritionInfo = generateRandomNutritionInfo();
        const docRef = doc(db, collectionName, docSnap.id);
        await updateDoc(docRef, {
          nutritionInfoPerServing: nutritionInfo
        });
        console.log(`Updated document ${docSnap.id} in collection ${collectionName} with nutritionInfoPerServing:`, nutritionInfo);
      });
    }
    alert('Nutrition info updated successfully.');
  } catch (error) {
    console.error('Error updating documents:', error);
    alert('Failed to update nutrition info.');
  }
};

export default updateNutritionInfo;