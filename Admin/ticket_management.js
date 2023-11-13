const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";
let role = window.localStorage.getItem("role");
if (role === undefined || role != 2)
  window.location.replace(front_end_url + "/Login/login.html");
