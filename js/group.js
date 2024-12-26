// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

// Group 데이터 
let groupArr = [];
export async function getGroups() {
    try {
        let docs = await getDocs(collection(db, "group"));
        docs.forEach((doc) => {
            groupArr.push(doc.data());
        });
        return groupArr;
    } catch (err) {
        console.log("getGroups 에러 발생", err);
        return;
    }

}
export default groupArr;

// Group 등록
export async function insertGroup(title, contents, image, category) {
    try {
        let groupDocs = await getDocs(collection(db, "group"));
        let newGroupId = groupDocs.size > 0
            ? Math.max(...groupDocs.docs.map(doc => doc.data().groupId)) + 1
            : 1;

        await addDoc(collection(db, "group"), {
            title: title,
            contents: contents,
            image: image,
            category: category,
            groupId: newGroupId
        });

        alert('소모임 등록 완료!');
        window.location.reload();
    } catch (error) {
        alert('등록 중 오류 발생: ' + error.message);
    }
}