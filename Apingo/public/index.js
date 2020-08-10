
var database = firebase.database();
function createRoom() {
   var firebaseRef = firebase.database().ref();
   firebaseRef.child("Room").push(00004);
   window.alert("createRoom used, hopefully firebase updated too")
};

let btnTeacher = document.getElementById("btnTeacher")
//School\ExtraCurricular\HackThis2020\Actual Project\HackThis2020\Apingo TeacherSide