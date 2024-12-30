// Firebase SDK import
import { collection, getDocs, doc, query, where, addDoc, updateDoc, deleteDoc, db } from './scripts.js'

let categoryArr = [];
export async function getCategorys() {
    try {
        let docs = await getDocs(collection(db, "category"));
        docs.forEach((doc) => {
            categoryArr.push(doc.data());
        });
        return categoryArr;
    } catch (err) {
        console.log("getCategorys 에러 발생", err);
        return;
    }

}
export default categoryArr;


export async function selectCategory(name) {
    try {
        let categoryGroupArr = [];
        let groupCollection = collection(db, "group");
        let q = query(groupCollection, where("category", "==", name));
        let querySnapShot = name != '' ? await getDocs(q) : await getDocs(groupCollection);
        querySnapShot.forEach((doc) => {
            categoryGroupArr.push(doc.data());
        });
        return categoryGroupArr;
    } catch (err) {
        console.log("selectCategory 에러 발생", err);
        return;
    }
}

