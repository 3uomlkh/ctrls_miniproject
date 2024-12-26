import { insertReply, getReply, updateReply, deleteReply } from "./reply.js";
import { selectGroup, deleteGroup, updateGroup } from "./group.js";

// reply 불러오기
let replyGroup = await getReply(1);
replyGroup.forEach((doc) => {
    let replyId = doc.id;
    let groupId = doc.groupId;
    let contents = doc.contents;
    let createId = doc.createId;

    // if (createId == memberid) { // 멤버 아이디 유지해서 시험하기 번거로워서 임시 주석처리
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

// Group 불러오기

let detailGroup = await selectGroup(1); //여기 변수가 너무 대놓고 나와있어서 조금 걸림
let temp_html = `
            <div class="intr" id="intr">
                <img class="intrImg" src="${detailGroup.image}">
                <div class="intrCnt" id="intrCnt">
                    <h2>${detailGroup.title}</h2>
                    <p>${detailGroup.contents}</p>
                    <div class="ctg">
                        <span>${detailGroup.category}</span>
                    </div>
                </div>
            </div>`;

$('#intrBox').append(temp_html);


$(document).ready(() => {

    //reply

    // reply 등록
    $("#replyRgstBtn").click(async () => {
        const groupId = 1; // 페이지 이동 시 받아오는 그룹 ID 맨위에 선언
        const contents = $("#replyCnt").val();
        const createId = 'test123123'; // 쿠키에서 가져온 멤버 ID 맨위에 선언

        if (!contents) { // 비어있는지 확인
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        await insertReply(groupId, createId, contents);
    });

    // reply 수정으로 변환
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

    // reply 수정 취소
    $('#cmt').on('click', '#modiCancleBtn', function () {
        window.location.reload();
    });

    // reply 삭제
    $('#cmt').on('click', '#cmtDelBtn', async function () {
        let modiCmtid = $(this).parent().parent().closest('div').find('p').attr('id');
        console.log(modiCmtid);
        await deleteReply(modiCmtid);
    });


    // Group 

    // Group 삭제
    $("#groupDel").click(async function () {
        deleteGroup(groupIdNow);
    })

    // Group 수정화면으로 변경
    $("#groupModified").click(async function () {
        $("#intrCnt").remove();
        detailGroup

        let category = detailGroup.category;
        let title = detailGroup.title;
        let contents = detailGroup.contents;
        let image = detailGroup.image;

        let temp_html = `
        <div>
            <form class="intrCnt">
                제목 <input type="text" id="titleCnt" value="${title}">
                이미지 <input type="text" id="imageCnt" value="${image}">
                소개 <input type="text" id="contentsCnt" value="${contents}">
                카테고리 <input type="text" id="categoryCnt" value="${category}">
            </form>
            <button type="button" id="modifiedBtn">수정완료</button>
            <button type="button" id="cancleBtn">수정취소</button>
        </div>`;
        $('#intr').append(temp_html);
    })

    // Group 수정 완료 버튼
    $(document).on("click", "#modifiedBtn", async function () {

        let groupId = groupIdNow;// 페이지 이동시 받아옴
        let title = $('#titleCnt').val();
        let image = $('#imageCnt').val();
        let contents = $('#contentsCnt').val();
        let category = $('#categoryCnt').val();

        updateGroup(groupId, title, contents, image, category);
    })

    // group 수정 취소 버튼
    $(document).on("click", "#cancleBtn", function () {
        window.location.reload();
    })


});

