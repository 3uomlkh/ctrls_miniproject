import { getReply, insertReply, updateReply, deleteReply } from "./reply";

// 댓글 등록
$("#replyRgstBtn").click(async function () {

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