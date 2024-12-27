import { insertReply, getReply, updateReply, deleteReply } from "./reply.js";
import { selectGroup, deleteGroup, updateGroup } from "./group.js";
import { getCategorys } from "./category.js";
import { selectGroupMember, insertGroupMember, deleteGroupMember } from "./groupMember.js"

const url = new URL(window.location.href);
const globalGroupId = url.searchParams.get('id');
const globalMemberId = sessionStorage.getItem('memberId');
let isGroupMember = false;


// Group 불러오기
getCategorys().then(async (categoryArr) => {
    let detailGroup = await selectGroup(globalGroupId);
    let image = detailGroup.image != '' && isValidUrl(detailGroup.image) ? detailGroup.image : `./assets/images/noImage.png`;
    let tempCategory;
    categoryArr.forEach(category => {
        tempCategory += `<option value="${category.name}">${category.name}</option>`;
    });
    let temp_html = `
    <div class="row gx-4 gx-lg-5 align-items-center">
        <div class="img-thumbnail col-md-4"><img class="card-img-top mb-5 mb-md-0" src="${image}" alt="..."></div>
        <div class="col-md-8">
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="groupTitle" placeholder="소모임명" disabled="disabled" value="${detailGroup.title}">
            </div>
            <div class="form-floating mb-3">
                <textarea class="form-control" placeholder="소개글" id="groupContents" style="height: 100px" disabled="">${detailGroup.contents}</textarea>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control display-hide" id="groupImage" placeholder="대표이미지" value="${detailGroup.image}">
                <label for="groupImage">대표이미지</label>
            </div>
            <div class="form-floating mb-3">
                <select class="form-select" id="groupCategory" disabled="disabled">
                </select>
            </div>
        </div>
        <div class="buttons">
            <button type="button" class="btn btn-danger float-end ms-2 display-hide" id="groupDel">삭제</button>
            <button type="button" class="btn btn-warning float-end ms-2 display-hide" id="groupModified">수정</button>
            <button type="button" class="btn btn-primary float-start me-2 display-hide" id="regGroupMemberBtn">가입</button>
            <button type="button" class="btn btn-secondary float-start me-2 display-hide" id="delGroupMemberBtn">탈퇴</button>
        </div>
    </div>`;

    $('#intrBox').append(temp_html);
    $('#groupCategory').append(tempCategory);
    $('#groupCategory').val(detailGroup.category).prop("selected", true);

    // group 정보가 모두 출력되고 난 후 모임 가입/탈퇴 버튼 toggle
    selectGroupMember(globalGroupId, globalMemberId).then((groupMember) => {
        if (groupMember) {
            isGroupMember = true;
            if (detailGroup.createId != globalMemberId) {
                $("#delGroupMemberBtn").show();
            }
        } else {
            $("#regGroupMemberBtn").show();
        }
    });

    // 그룹을 만든 id에게만 수정, 삭제 버튼 표시
    if ( detailGroup.createId == globalMemberId ) {
        $('#groupDel').toggle();
        $('#groupModified').toggle();
    } 


    // Group 수정화면으로 변경
    $("#groupModified").click(async function () {
        let tempBtns = `
        <button type="button" id="modifiedBtn" class="btn btn-success float-end ms-2">수정</button>
        <button type="button" id="cancleBtn" class="btn btn-secondary float-end ms-2">취소</button>
    `;
        $("#groupTitle").removeAttr("disabled");
        $("#groupContents").removeAttr("disabled");
        $("#groupCategory").removeAttr("disabled");
        $("#groupImage").toggle();

        $(".buttons").empty();
        $(".buttons").append(tempBtns);
    });

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

}); // group end

// reply 불러오기
let replyGroup = await getReply(globalGroupId);
let joinMember = selectGroupMember(globalGroupId, globalMemberId);
replyGroup.forEach((doc) => {
    let replyId = doc.id;
    let contents = doc.contents;
    let createId = doc.createId;
    if (createId == globalMemberId) { // 멤버 아이디 유지해서 시험하기 번거로워서 임시 주석처리
        let temp_html = `
        <div class="d-flex mb-4">
            <div class="flex-shrink-0"><img class="rounded-circle" src="./assets/images/reply.png"
                    alt="..." /></div>
            <div class="input-group">
                <div class="ms-3 modimodiTest">
                    <div class="fw-bold" id="${createId}">
                        ${createId}
                        <button type="button" class="modimodi" id="cmtRegBtn">수정</button>
                        <button type="button" class="modimodi" id="cmtDelBtn">삭제</button>
                    </div>
                    <span id="${replyId}">${contents}</span>
                </div>
            </div>
        </div>`;
        $('#cmt').append(temp_html);
    } else {
        let temp_html = `
            <div class="d-flex mb-4">
                <div class="flex-shrink-0"><img class="rounded-circle" src="./assets/images/reply.png"
                        alt="..." /></div>
                <div class="input-group">
                    <div class="ms-3 '">
                        <div class="fw-bold" id="${replyId}">
                            ${createId}
                        </div>
                        <span id="${replyId}">${contents}</span>
                    </div>
                </div>
            </div>`;
        $('#cmt').append(temp_html);
    }
}); // reply end

// reply
// reply 등록
$("#replyRgstBtn").click(async () => {
    const contents = $("#replyCnt").val();

    if (!contents) { // 비어있는지 확인
        alert("댓글 내용을 입력해주세요.");
        return;
    }
    if (!isGroupMember) {
        alert("모임 멤버만 댓글 등록 가능합니다.");
        return;
    }
    await insertReply(globalGroupId, globalMemberId, contents);
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
$(document).on("click", "#groupDel", async function () {
    deleteGroup(globalGroupId);
})

// Group 수정 완료 버튼
$(document).on("click", "#modifiedBtn", async function () {
    let groupId = globalGroupId;// 페이지 이동시 받아옴
    let title = $('#groupTitle').val();
    let image = $('#groupImage').val();
    let contents = $('#groupContents').val();
    let category = $('#groupCategory option:selected').val();

    updateGroup(groupId, title, contents, image, category);
})

// group 수정 취소 버튼
$(document).on("click", "#cancleBtn", function () {
    window.location.reload();
})

/* 이미지 등록 시 주소값 유효 체크 */
function isValidUrl(url) {
    const urlRegex = /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i;
    return urlRegex.test(url);
}

document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem("memberId"); // 로그인 취소
    window.location.href = "index.html";  // 로그인 페이지로 이동
});