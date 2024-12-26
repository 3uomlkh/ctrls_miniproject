import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc, query, where, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyA8Do_4_ZDADE64D6v1gbF36_NfaRDvh24",
    authDomain: "ctrls-miniproject.firebaseapp.com",
    projectId: "ctrls-miniproject",
    storageBucket: "ctrls-miniproject.firebasestorage.app",
    messagingSenderId: "496866464655",
    appId: "1:496866464655:web:8d866192211cf7699d31fa",
    measurementId: "G-SGY1JM32JF"
}
// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
// 받아올 예정? 이후 어떻게 받을지 아님 직점 만들지 정해서 맨위에 한번 선언해서 계속 쓸듯
const url = new URL(window.location.href);
let groupIdNow = url.searchParams.get('id');
let memberId = sessionStorage.getItem('memberId');

// reply 데이터 불러오기

export async function getReply(groupId) {
    try {
        let replyArr = [];
        let cmtQ = query(collection(db, "reply"), where("groupId", "==", 1)); // 그룹 아이디가 일치하는 댓글만 불러온다
        let docs = await getDocs(cmtQ);
        docs.forEach((doc) => {
            replyArr.push({
                id: doc.id, // 댓글 ID
                ...doc.data() // 댓글 데이터
            });
        });
        return replyArr;
    } catch (err) {
        console.log("getReply 에러 발생", err);
        return;
    }
}

// reply 등록 (attr: groupId, createId, contents)
export async function insertReply(groupId, createId, contents) {
    try {
        console.log('gr : '+groupId);
        console.log('co : '+contents);
        console.log('cr : '+createId);
        let doc = {
            'groupId': groupId,
            'contents': contents,
            'createId': createId
        }
        await addDoc(collection(db, "reply"), doc);
        alert('댓글 등록!');
        window.location.reload();
    } catch (err) {
        console.log("insertReply 에러 발생", err);
        return;
    }
}

// reply 수정 (attr: modiCnt, modiId)
export async function updateReply(modiCnt, modiId) {
    try {
        const replyModi = doc(db, "reply", modiId);
        await updateDoc(replyModi, {
            contents: modiCnt
        });
        alert('수정되었습니다!');
        window.location.reload();
    } catch (err) {
        console.log("updateReply 에러 발생", err);
        return;
    }
}

// reply 삭제 (attr: modiCmtId)
export async function deleteReply(modiCmtId) {
    try {
        let check = confirm('댓글을 삭제하시겠습니까?');
        if (check) {
            await deleteDoc(doc(db, "reply", modiCmtId));
            window.location.reload();
        }
    } catch (err) {
        console.log("deleteReply 에러 발생", err);
        return;
    }
}