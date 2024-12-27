// Firebase SDK import
import { collection, getDocs, doc, query, where, addDoc, updateDoc, deleteDoc, db } from './scripts.js'

// Groups 불러오기
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
        //로그인된 사용자 아이디 가져옴
        const createId = sessionStorage.getItem('memberId');
        if (!createId) {
            alert('로그인이 필요합니다.');
            return;
        }
        let groupDocs = await getDocs(collection(db, "group"));
        let newGroupId = groupDocs.size > 0
            ? Math.max(...groupDocs.docs.map(doc => Number(doc.data().groupId))) + 1
            : 1;
        newGroupId += "";

        await addDoc(collection(db, "group"), {
            title: title,
            contents: contents,
            image: image,
            category: category,
            groupId: newGroupId,
            createId: createId // creatId추가
        });

        const groupMemberCollection = collection(db, "groupMember");
        const q = query(groupMemberCollection, where("groupId", "==", newGroupId), where("memberId", "==", createId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            // 모임 가입
            const docRef = await addDoc(groupMemberCollection, {
                groupId : newGroupId,
                memberId : createId
            });
        }
        alert('소모임 등록 완료!');
        window.location.reload();
    } catch (error) {
        alert('등록 중 오류 발생: ' + error.message);
    }
}

// Group 조회 
export async function selectGroup(groupId) {
    try {
        let groupQ = query(collection(db, "group"), where("groupId", "==", groupId)); // 그룹 아이디가 일치하는 문서만 불러온다
        let querySnapshot = await getDocs(groupQ);
        let docSnapshot = querySnapshot.docs[0];
        let row = docSnapshot.data();
        return row;
    } catch (err) {
        console.log("selectGroup 에러 발생", err);
        return;
    }
}

// Group 수정
export async function updateGroup(groupId, title, contents, image, category) {
    try {
        let groupQ = query(collection(db, "group"), where("groupId", "==", groupId)); // 그룹 아이디가 일치하는 문서만 불러온다
        let querySnapshot = await getDocs(groupQ);
        let docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
            'category': category,
            'title': title,
            'contents': contents,
            'image': image
        });
        alert('수정되었습니다!');
        window.location.reload();
    } catch (err) {
        console.log("updateGroup 에러 발생", err);
        return;
    }
}

// Group 삭제
export async function deleteGroup(groupId) {
    try {
        let checkDel = confirm("정말 삭제하시겠습니까?");
        if (checkDel) {
            let q = query(collection(db, "group"), where("groupId", "==", groupId)); // 그룹 아이디가 일치하는 문서만 불러온다
            let querySnapshot = await getDocs(q);
            let docSnapshot = querySnapshot.docs[0];
            await deleteDoc(doc(db, "group", docSnapshot.id));

            let memberQ = query(collection(db, "groupMember"), where("groupId", "==", groupId)); // 그룹 삭제시 소속 멤버 자동 삭제
            let memberQuerySnapshot = await getDocs(memberQ);
            memberQuerySnapshot.docs.forEach(async (memberDoc) => {
                await deleteDoc(doc(db, "groupMember", memberDoc.id));
            });

            let replyQ = query(collection(db, "reply"), where("groupId", "==", groupId)); // 그룹 삭제시 댓글 자동 삭제
            let replyQuerySnapshot = await getDocs(replyQ);
            replyQuerySnapshot.docs.forEach(async (replyDoc) => {
                await deleteDoc(doc(db, "reply", replyDoc.id));
            });

            alert('삭제되었습니다!');
            var hostIndex = location.href.indexOf(location.host) + location.host.length;
            var context = location.href.substring(hostIndex, location.href.indexOf('/', hostIndex + 1));
            window.location.href = context + "/main.html";
        }
    } catch (err) {
        console.log("deleteGroup 에러 발생", err);
        return;
    }
}

