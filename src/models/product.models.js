import {
collection,
getDocs,
getDoc,
addDoc,
deleteDoc,
doc,
} from "firebase/firestore";
import { db } from "../config/firebase.js";

// Referencia a collección productos
const productsCollection = collection(db, "products");

// Obtiene todos los productos de la colección products
export const findAll = async () => {
    const productsSnapshot = await getDocs(productsCollection);
    return productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
};

// Obtiene un producto por id de la colección products
export const findById = async (id) => {
    const docRef = doc(productsCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return {id: docSnap.id, ...docSnap.data()};
};

// Crea una nuevo producto en la coleccion products
export const create = async (productData) => {
    const productRef = await addDoc(productsCollection, productData);
    return { id: productRef.id, ...productData };
};

// Elimina un producto por id de la colección products
export const remove = async (id) => {
    const docRef = doc(productsCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    await deleteDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() };
};