// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA8Do_4_ZDADE64D6v1gbF36_NfaRDvh24",
    authDomain: "ctrls-miniproject.firebaseapp.com",
    projectId: "ctrls-miniproject",
    storageBucket: "ctrls-miniproject.firebasestorage.app",
    messagingSenderId: "496866464655",
    appId: "1:496866464655:web:8d866192211cf7699d31fa",
    measurementId: "G-SGY1JM32JF"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


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
        let querySnapShot = name!='' ? await getDocs(q) : await getDocs(groupCollection);
        querySnapShot.forEach((doc) => {
            categoryGroupArr.push(doc.data());
        });
        return categoryGroupArr;
    } catch (err) {
        console.log("selectCategory 에러 발생", err);
        return;
    }
}

