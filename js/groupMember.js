// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

export async function selectGroupMember(groupId, memberId) {
    try {
        const groupMemberCollection = collection(db, "groupMember");
        const q = query(groupMemberCollection, where("groupId", "==", groupId), where("memberId", "==", memberId));
        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty) {
            let docSnapshot = querySnapshot.docs[0];
            let row = docSnapshot.data();
            return row;
        }
        return;
    } catch (err) {
        alert('selectGroupMember 에러 발생: ' + err);
        return;
    }
}

// 모임 가입하기
export async function insertGroupMember(groupId, memberId) {
    try {
        const groupMemberCollection = collection(db, "groupMember");
        const q = query(groupMemberCollection, where("groupId", "==", groupId), where("memberId", "==", memberId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            // 모임 가입
            const docRef = await addDoc(groupMemberCollection, {
                groupId,
                memberId
            });
        }
        alert('모임 가입 되었습니다!');
        window.location.reload();
    } catch (err) {
        alert('insertGroupMember 에러 발생: ' + err);
        return;
    }
}

// 모임 탈퇴하기
export async function deleteGroupMember(groupId, memberId) {
    try {
        let checkDel = confirm("정말 탈퇴하시겠습니까?");
        if(checkDel) {
            let q = query(collection(db, "groupMember"), where("groupId", "==", groupId), where("memberId", "==", memberId));
            let querySnapshot = await getDocs(q);
            let docSnapshot = querySnapshot.docs[0];
            await deleteDoc(doc(db, "group", docSnapshot.id));
            alert('모임 탈퇴처리 되었습니다!');
            window.location.reload();
        }
    } catch (err) {
        console.log('deleteGroupMember 에러 발생:' + err);
        return;
    }
}