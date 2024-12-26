import { getCategorys, selectCategory } from "./category.js";
import { getGroups, insertGroup } from "./group.js"

// 전역변수 index
let index = 1;

/* 카테고리 목록 불러오기 */
getCategorys().then((categoryArr) => {
    categoryArr.forEach(category => {
        let temp = `
       <option value="${category.name}">${category.name}</option>
       `;
        $('#category').append(temp);
        $('#categorySearch').append(temp);
    });
});

/* 카테고리 검색 */
$("#categoryBtn").click(async function () {
    const category = $("#categorySearch option:selected").val();
    var categoryGroupArr = await selectCategory(category);
    makeGroupCards(categoryGroupArr);
});

/* 소모임 카드 불러오기 */
getGroups().then((groupArr) => {
    makeGroupCards(groupArr);
});

/* 소모임 등록하기 */
$("#postingbtn").click(async function () {
    let title = $('#title').val();
    let contents = $('#contents').val();
    let image = $('#image').val();
    let category = $('#category').val();

    insertGroup(title, contents, image, category);
});

/* 소모임 상세 페이지 이동 */
$(".detail-btn").click(async function () {
    const groupId = $(this).data('id');
    window.location.href = `detail.html?id=${groupId}`;
});

function makeGroupCards(groupArr) {
    $('#card-container').empty();
    groupArr.forEach(group => {
        let dummy = 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg';
        let temp_html = `
        <div class="col mb-5">
            <div class="card h-100">
                <!-- Sale badge-->
                <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">${group.category}</div>
                <!-- Product image-->
                <img class="card-img-top" src="${group.image}" alt="..." />
                <!-- Product details-->
                <div class="card-body p-4">
                    <div class="text-center">
                        <!-- Product name-->
                        <h5 class="fw-bolder">${group.title}</h5>
                        <!-- Product price-->
                        ${group.contents}
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center"><a class="btn btn-outline-dark mt-auto detail-btn" data-id="${group.groupId}">상세페이지</a></div>
                </div>
            </div>
        </div>
        `;

        $('#card-container').append(temp_html);
    });
}