// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyA8Do_4_ZDADE64D6v1gbF36_NfaRDvh24",
  authDomain: "ctrls-miniproject.firebaseapp.com",
  projectId: "ctrls-miniproject",
  storageBucket: "ctrls-miniproject.appspot.com",
  messagingSenderId: "496866464655",
  appId: "1:496866464655:web:8d866192211cf7699d31fa",
  measurementId: "G-SGY1JM32JF",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOMContentLoaded 이벤트
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");

  if (!container) {
    console.error("Container not found!");
    return;
  }

  // UI 상태 토글 함수
  window.toggle = () => {
    container.classList.toggle("sign-in");
    container.classList.toggle("sign-up");
  };

  setTimeout(() => {
    container.classList.add("sign-in");
  }, 200);

  // 회원가입 버튼 이벤트 핸들러
  const signUpBtn = document.getElementById("sign-up-btn");
  if (signUpBtn) {
    signUpBtn.addEventListener("click", async () => {
      const id = document.getElementById("sign-up-id").value;
      const password = document.getElementById("sign-up-password").value;

      if (id && password) {
        try {
          const docRef = await addDoc(collection(db, "members"), {
            id,
            password
          });
          console.log("Member signed up with ID:", docRef.id);
          alert("회원가입 성공!");
        } catch (e) {
          console.error("Error during sign up:", e);
          alert("회원가입에 실패했습니다.");
        }
      } else {
        alert("ID와 Password를 입력해주세요.");
      }
    });
  }
});

