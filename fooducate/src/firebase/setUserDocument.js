import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const setUserDocument = async (user, additionalData) => {
  if (!user) return;

  const { uid, email } = user;
  const { firstName, lastName, password, fats, proteins, carbs, goals } = additionalData;

  try {
    const userDoc = doc(db, 'users', uid);
    await setDoc(userDoc, {
      uid: uid,
      email: email,
      firstName: firstName,
      lastName: lastName, // Ensure name is not undefined
      password: password, // Note: Do not store passwords like this in a real app
      fats: fats,
      proteins: proteins, 
      carbs: carbs, 
      goals: goals,


    }, { merge: true });
  } catch (error) {
    console.error("Error setting user document: ", error);
  }
};

export default setUserDocument;