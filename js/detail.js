import { insertReply, getReply, updateReply, deleteReply } from "./reply.js";

// 댓글 불러오기
let replyGroup = await getReply(1);
replyGroup.forEach((doc) => {
    let replyId = doc.id;
    let groupId = doc.groupId;
    let contents = doc.contents;
    let createId = doc.createId;

    // if (createId == memberid) {
    let temp_html = `
                <div class = "testStyle">
                    <div class = "intr">
                        <span>${createId}</span>
                        <button type="button" id="cmtRegBtn">수정</button>
                        <button type="button" id="cmtDelBtn">삭제</button>
                    </div>
                    <p id="${replyId}">${contents}</p>
                </div>`;
    //} else {
    //    let temp_html = `
    //        <div class = "testStyle">
    //            <div class = "intr">
    //                <span>${createId}</span>
    //            </div>
    //            <p>${contents}</p>
    //        </div>`;
    //}
    $('#cmt').append(temp_html);
});


$(document).ready(() => {

    // 댓글 등록
    $("#replyRgstBtn").click(async () => {
        const groupId = 1; // 페이지 이동 시 받아오는 그룹 ID 맨위에 선언
        const contents = $("#replyCnt").val();
        const createId = 'test123123'; // 쿠키에서 가져온 멤버 ID 맨위에 선언

        if (!contents) { // 비어있는지 확인
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            await insertReply(groupId, createId, contents);
        } catch (error) {
            console.error("댓글 등록 중 에러 발생:", error);
        }
    });

    // 댓글 수정으로 변환
    $('#cmt').on('click', '#cmtRegBtn', function () {
        let modiCmtTag = $(this).parent().parent().closest('div').find('p'); // 클릭한 버튼에서 상위 한번 가까운 'p' 태그
        console.log(modiCmtTag);
        // 'p' 태그를 'input'으로 변경
        let inputField = $('<input>', { type: 'text', value: modiCmtTag.text(), id: modiCmtTag.attr('id') });
        modiCmtTag.replaceWith(inputField); // 'p' 태그를 'input'으로 교체

        let cmtCmplBtn = $(this);
        cmtCmplBtn.text('완료').attr('id', 'cmtcmplBtn');
        console.log(cmtCmplBtn);

        let cmtCancleBtn = $(this).next('button');
        cmtCancleBtn.text('취소').attr('id', 'modiCancleBtn');
        console.log(cmtCancleBtn);
    });

    $('#cmt').on('click', '#cmtcmplBtn', async function () {
        let modiCmt = $(this).parent().parent().closest('div').find('input');
        let modiCnt = modiCmt.val();
        let modiId = modiCmt.attr('id');

        await updateReply(modiCnt, modiId);
    });

    // 댓글 수정 취소
    $('#cmt').on('click', '#modiCancleBtn', function () {
        window.location.reload();
    });

    // 댓글 삭제
    $('#cmt').on('click', '#cmtDelBtn', async function () {
        let modiCmtid = $(this).parent().parent().closest('div').find('p').attr('id');
        console.log(modiCmtid);
        await deleteReply(modiCmtid);
    });



});

