import { insertReply, getReply, updateReply, deleteReply } from "./reply.js";
import { selectGroup, deleteGroup, updateGroup } from "./group.js";

const url = new URL(window.location.href);
const globalGroupId = url.searchParams.get('id');
const globalMemberId = sessionStorage.getItem('memberId');

// reply 불러오기
let replyGroup = await getReply(globalGroupId);
replyGroup.forEach((doc) => {
    let replyId = doc.id;
    let contents = doc.contents;
    let createId = doc.createId;

    // if (createId == memberid) { // 멤버 아이디 유지해서 시험하기 번거로워서 임시 주석처리

    
    let temp_html = `
        <div class="d-flex mb-4">
            <div class="flex-shrink-0"><img class="rounded-circle" src="./assets/images/reply.png"
                    alt="..." /></div>
            <div class="input-group">
                <div class="ms-3">
                    <div class="fw-bold" id="${replyId}">
                        ${createId}
                        <button type="button" id="cmtRegBtn">수정</button>
                        <button type="button" id="cmtDelBtn">삭제</button>
                    </div>
                    <span id="${replyId}">${contents}</span>
                </div>
            </div>
        </div>`;
    // } else {
    //     let temp_html = `
    //         <div class="d-flex mb-4">
    //             <div class="flex-shrink-0"><img class="rounded-circle" src="./assets/images/reply.png"
    //                     alt="..." /></div>
    //             <div class="input-group">
    //                 <div class="ms-3">
    //                     <div class="fw-bold" id="${replyId}">
    //                         ${createId}
    //                     </div>
    //                     ${contents}
    //                 </div>
    //             </div>
    //         </div>`;
    // }
    $('#cmt').append(temp_html);


    // // if (createId == memberid) { // 멤버 아이디 유지해서 시험하기 번거로워서 임시 주석처리
    // let temp_html = `
    //             <div class = "testStyle">
    //                 <div class = "intr">
    //                     <span>${createId}</span>
    //                     <button type="button" id="cmtRegBtn">수정</button>
    //                     <button type="button" id="cmtDelBtn">삭제</button>
    //                 </div>
    //                 <p id="${replyId}">${contents}</p>
    //             </div>`;
    // //} else {
    // //    let temp_html = `
    // //        <div class = "testStyle">
    // //            <div class = "intr">
    // //                <span>${createId}</span>
    // //            </div>
    // //            <p>${contents}</p>
    // //        </div>`;
    // //}
    // $('#cmt').append(temp_html);
});

// Group 불러오기

let detailGroup = await selectGroup("1"); //여기 변수가 너무 대놓고 나와있어서 조금 걸림
let temp_html = `
    <div id="intrCnt" class="row gx-4 gx-lg-5 align-items-center">
        <div class="img-thumbnail col-md-4"><img class="card-img-top mb-5 mb-md-0" src="${detailGroup.image}" alt="..."></div>
        <div class="col-md-8">
            <div class="form-floating mb-3">
                <input type="email" class="form-control" id="floatingInputDisabled" placeholder="name@example.com" disabled="">
                <label for="floatingInputDisabled">${detailGroup.title}</label>
            </div>
            <div class="form-floating mb-3">
                <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2Disabled" style="height: 100px" disabled="">${detailGroup.contents}</textarea>
            </div>
            <div class="form-floating mb-3">
                <input type="email" class="form-control" id=" " placeholder="name@example.com" disabled="">
                <label for="floatingInputDisabled">${detailGroup.category}</label>
            </div>
        </div>
        <div class="buttons">
            <button type="button" id="groupDel" class="btn btn-danger float-end ms-2">삭제</button>
            <button type="button" id="groupModified" class="btn btn-warning float-end ms-2">수정</button>
            <button type="button" class="btn btn-primary float-start me-2" id="regGroupMemberBtn">가입</button>
            <button type="button" class="btn btn-secondary float-start me-2" id="delGroupMemberBtn">탈퇴</button>
        </div>
    </div>`;



{/* <div class="intr" id="intr">
                <img class="intrImg" src="${detailGroup.image}">
                <div class="intrCnt" id="intrCnt">
                    <h2>${detailGroup.title}</h2>
                    <p>${detailGroup.contents}</p>
                    <div class="ctg">
                        <span>${detailGroup.category}</span>
                    </div>
                </div>
            </div> */}

$('#intrBox').append(temp_html);


$(document).ready(() => {

    //reply

    // reply 등록
    $("#replyRgstBtn").click(async () => {
        const groupId = globalGroupId; // 페이지 이동 시 받아오는 그룹 ID 맨위에 선언
        const contents = $("#replyCnt").val();
        const createId = globalMemberId; // 세션에서 가져온 멤버 ID 맨위에 선언

        if (!contents) { // 비어있는지 확인
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        await insertReply(groupId, createId, contents);
    });

    // reply 수정으로 변환
    $('#cmt').on('click', '#cmtRegBtn', function () {
        let modiCmtTag = $(this).parent().next('span'); // 클릭한 버튼에서 상위 한번 가까운 'p' 태그
        let asd = modiCmtTag.text();
        console.log(asd);
        // 'span' 태그를 'textarea'으로 변경
        let inputField = $('<textarea>', { class: 'form-control', rows: '2', text: asd, id: modiCmtTag.attr('id') });
        modiCmtTag.replaceWith(inputField); // 'span' 태그를 'textarea'으로 교체

        let cmtCmplBtn = $(this);
        cmtCmplBtn.text('완료').attr('id', 'cmtcmplBtn');
        console.log(cmtCmplBtn);

        let cmtCancleBtn = $(this).next('button');
        cmtCancleBtn.text('취소').attr('id', 'modiCancleBtn');
        console.log(cmtCancleBtn);
    });

    // reply 수정
    $('#cmt').on('click', '#cmtcmplBtn', async function () {
        let modiCmt = $(this).parent().next('textarea');
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
        let modiCmtid = $(this).parent().next('span').attr('id');
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
        <div id="intrCnt" class="row gx-4 gx-lg-5 align-items-center">
            <div class="img-thumbnail col-md-4"><img class="card-img-top mb-5 mb-md-0" src="${detailGroup.image}" alt="..."></div>
            <div id="intrCnt" class="col-md-8">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingTextarea2Disabled" style="height: 50px" value="${title}">
                </div>
                <div class="form-floating mb-3">
                    <textarea class="form-control"  id="floatingTextarea2Disabled" style="height: 50px" disabled="">${contents}</textarea>
                </div>
                <div class="form-floating mb-3">
                    <textarea class="form-control"  id="floatingTextarea2Disabled" style="height: 50px" disabled="">${image}</textarea>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control"  placeholder="name@example.com" >
                </div>
            </div>
            <div class="buttons">
                <button type="button" id="groupDel" class="btn btn-danger float-end ms-2">삭제</button>
                <button type="button" id="groupModified" class="btn btn-warning float-end ms-2">수정</button>
                <button type="button" class="btn btn-primary float-start me-2" id="regGroupMemberBtn">가입</button>
                <button type="button" class="btn btn-secondary float-start me-2" id="delGroupMemberBtn">탈퇴</button>
            </div>
        </div>`;
        $('#intrBox').append(temp_html);
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

    // group 가입하기
    $("#regGroupMemberBtn").click(async function () {
        if (globalGroupId && globalMemberId) {
            await insertGroupMember(globalGroupId, globalMemberId);
        }
    });

    // group 탈퇴하기
    $("#delGroupMemberBtn").click(async function () {
        if (globalGroupId && globalMemberId) {
            await deleteGroupMember(globalGroupId, globalMemberId);
        }
    });

});

selectGroupMember(globalGroupId, globalMemberId).then((groupMember) => {
    if (groupMember) {
        $('#regGroupMemberBtn').hide();
        $('#delGroupMemberBtn').show();
    } else {
        $('#regGroupMemberBtn').show();
        $('#delGroupMemberBtn').hide();
    }
});

