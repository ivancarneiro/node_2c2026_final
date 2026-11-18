import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase.js";

const userCollection = collection(db, "users");

// Busca un usuario por su email
export const findByEmail = async (email) => {
    const querySnapshot = await getDocs(
        query(userCollection, where("email", "==", email))
    );
    
    if (querySnapshot.empty) return null;
    
    const userDoc = querySnapshot.docs[0];
    return {id: userDoc.id, ...userDoc.data()};
};

// Crear usuario en Firestore
export const create = async ({email, password}) => {
    const userRef = await addDoc(userCollection, {email, password});
    
    return {id: userRef.id, email, password};
};