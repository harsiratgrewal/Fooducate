import { getDocs, query, where, collection } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the path to your Firebase configuration

const fetchRecipeById = async (recipeId) => {
  const collections = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];

  for (const collectionName of collections) {
    try {
      const q = query(collection(db, collectionName), where('recipeId', '==', recipeId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data(), collection: collectionName };
      }
    } catch (error) {
      console.error(`Error fetching recipe from ${collectionName}:`, error);
    }
  }

  return null;
};

export default fetchRecipeById;