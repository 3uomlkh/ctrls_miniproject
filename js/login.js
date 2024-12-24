document.addEventListener('DOMContentLoaded', () => {
  let container = document.getElementById('container');

  if (container) {
    console.log('Container found:', container);
  } else {
    console.error('Container not found!');
    return; // container가 없으면 나머지 코드 실행 방지
  }

  toggle = () => {
    container.classList.toggle('sign-in');
    container.classList.toggle('sign-up');
  };

  setTimeout(() => {
    container.classList.add('sign-in');
  }, 200);
});
