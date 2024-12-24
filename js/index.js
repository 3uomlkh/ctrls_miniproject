
import { categoryFn } from "./category.js";

categoryFn().then((categoryArr)=> {
    categoryArr.forEach(category => {
       let temp = `
       <option value="${category.large}">${category.large}</option>
       `;
       $('#categoryBox').append(temp);
    });
});

$("#categoryBtn").click(async function () {
    const category = $("#categoryBox option:selected").val();
    console.log(category);
});
