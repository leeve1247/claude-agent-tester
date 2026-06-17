// demo.js - 리뷰 봇 데모용 파일 (의도적인 이슈 포함)

function getUser(users, id) {
  // off-by-one: i <= length 라서 users[length] (undefined) 접근
  for (var i = 0; i <= users.length; i++) {
    if (users[i].id == id) {  // 느슨한 비교(==)
      return users[i];
    }
  }
}

function runCommand(input) {
  return eval(input); // 임의 코드 실행 위험
}

module.exports = { getUser, runCommand };
