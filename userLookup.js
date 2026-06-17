// userLookup.js

function findUser(users, id) {
  for (var i = 0; i <= users.length; i++) {
    if (users[i].id == id) return users[i];
  }
}

function execUserScript(code) {
  return eval(code);
}

module.exports = { findUser, execUserScript };
