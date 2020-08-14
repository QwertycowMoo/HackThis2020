var roomKey;
var numOfRooms = 1;
var dbKey;
var studentName;
let unsubscribeQNA;
const btnTeacher = document.querySelector("#btnTeacher");
const btnStudent = document.querySelector("#btnStudent");
const btnReset = document.querySelector("#btnReset");
const divAnswer = document.querySelector("#divAnswer");
const formName = document.querySelector("#formName");
const formEnter = document.querySelector("#formEnter");
const btnEnterRoom = document.querySelector("#btnEnterRoom");
const divStudent = document.querySelector("#student");
const divEnter = document.querySelector("#enterRoom");
const formQuestion = document.querySelector("#formQuestion");
const btnNewQuestion = document.querySelector("#btnNewQuestion")
const divQuestion = document.querySelector("#question");
const lblQuestion = document.querySelector("#lblQuestion");
const lblQStudent = document.querySelector("#lblQuestionStudent");
const btnSubmitAnswer = document.querySelector("#btnSubmitAnswer");
const btnPing = document.querySelector("#btn-ping-student");
const ulAnswers = document.querySelector("#ulAnswers");
const ulPingAnswers = document.querySelector("#ulPinged-Answers")

//Teacher button
btnTeacher.addEventListener('click', function(evt) {
   cleanDatabase();
   var rKey = makeRoomId();
   while (rKey == false) {
      rKey = makeRoomId();
      console.log(rKey)
   }

   let divTeacher = document.querySelector("#teacher");
   divTeacher.style.display = "inline-block";
   btnStudent.style.display = "none";
   btnTeacher.disabled = true;
   btnTeacher.style.backgroundColor = "#FFC107";
   btnTeacher.style.color = "#303F9F";
   btnReset.style.display = "inline-block";

})

function cleanDatabase() {
   var d = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
   var oneDayAgo = firebase.firestore.Timestamp.fromDate(d)
   db.collection('rooms').where('timestamp', "<", oneDayAgo).get().then(function(snapshot) {
      snapshot.docs.forEach(doc => {
         doc.ref.delete();
      })
      console.log("Database cleaned")
   }).catch(function(error) {
      console.log("something wrong with deleting " + error)
   })
}

function makeRoomId() {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   for ( var i = 0; i < 4; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   db.collection('rooms').where('roomKey', "==", result).get().then(function(snapshot) {
      console.log(snapshot.size);
      if (snapshot.size == 0) {
         let txtRoom = document.querySelector("#roomKey");
         txtRoom.innerHTML = "Room Key: " + result;
         createRoom(result)
         
         return result;
      }else {
         return false;
      }
      
   })
}
function createRoom(rKey) { 
   
   db.collection("rooms").add({
     roomKey: rKey,
     teacher: "Mr.Zhou",
     timestamp: firebase.firestore.Timestamp.fromDate(new Date())
  })
  .then(function(docRef) {
     console.log("New Doc with ID: ", docRef.id);
     dbKey = docRef.id;
  })
  .catch(function(error) {
     console.error("Error adding document: ", error);
  })
};

//reset
btnReset.addEventListener('click', function(evt) {
   btnCloseRoom.click();
   location.reload();
});

//close room
btnCloseRoom.addEventListener('click', function(evt) {
   db.collection('rooms').doc(dbKey).delete().then(function() {
      console.log("room deleted")
   })
   location.reload();
})

//teacher answer
formQuestion.addEventListener('submit', function(evt){
   evt.preventDefault();
   var qstion = this.txtQuestion.value;
   console.log(dbKey);
   db.doc("rooms/" + dbKey + "/qna/question").set({
      question: qstion
   });
   clearAnswers();
   showStudentAnswers(qstion);
   startStudentListen()
});

function showStudentAnswers(question) {
   formQuestion.style.display = "none";
   lblQuestion.innerHTML = question;
   divQuestion.style.display = "block";
};

function clearAnswers() {
   ulAnswers.innerHTML = "";
};

function startStudentListen() {
   
   unsubscribeQNA = db.collection("rooms").doc(dbKey).collection("qna").onSnapshot(function(qSnapshot) {
      qSnapshot.docChanges().forEach(function(change) {
         console.log(change)
         var name = change.doc.data().name
         var answer = change.doc.data().answer
         if (change.type === "added") {
            console.log("New: ", change.doc.data());
            if (name != undefined && answer != undefined){
               createNewAnswerElem(name, answer, change.doc.id);
            }     
        }
        if (change.type === "modified") {
            console.log("Modified: ", change.doc.id);
            console.log("Modified: ", change.doc.data());
            var ping = change.doc.data().ping
            if (name != undefined && answer != undefined){
               changeAnswerElem(change.doc.data().answer, change.doc.id);   
            }
            if (ping != undefined) {
               if (change.doc.data().ping) {
                  changePing(true, change.doc.id);
               } else {
                  changePing(false, change.doc.id);
               }
               
            }  
            

        }
        if (change.type === "removed") {
            console.log("Removed: ", change.doc.data());
        }
      });
   })

   

}

function createNewAnswerElem(name, answer, docId) {
   var newListElem = document.createElement('li');
   var newDiv = document.createElement('div');
   var newDivName = document.createElement('div');
   var newDivAnswer = document.createElement('div');
   var newName = document.createElement('h3');
   var newAnswer = document.createElement('h4');
   var newIcon = document.createElement('ion-icon');
   var newDivNameAnswer = document.createElement('div');

   newName.innerText = name;
   newAnswer.innerText = answer;
   newDivNameAnswer.setAttribute("id", "div-" + docId);
   newDivName.setAttribute("id", "div-name");
   newDivAnswer.setAttribute("id", "div-answer");
   newIcon.setAttribute("id", "teacher-ping-" + docId);
   newIcon.setAttribute("src", "icons/bell.svg")
   newIcon.setAttribute("class", "ion-icon default-hidden")
   newDiv.setAttribute("class", "flex ul-div");
   newDivName.setAttribute("class", "div-ans-name");
   newDivAnswer.setAttribute("class", "div-ans-answer");
   newName.setAttribute("class", "ans-name reg");
   newAnswer.setAttribute("class", "ans-answer reg");

   //moving inside to out
   newDivName.appendChild(newName);
   newDivAnswer.appendChild(newAnswer);
   newDivNameAnswer.appendChild(newDivName);
   newDivNameAnswer.appendChild(newDivAnswer);
   newDiv.appendChild(newDivNameAnswer);
   newDiv.appendChild(newIcon);
   newListElem.append(newDiv);
   ulAnswers.appendChild(newListElem);
}

function changeAnswerElem(newAnswer, docId) {
   console.log("inside changeelem");
   console.log(document.getElementById("div-answer-Kev"))
   var changeDiv = document.getElementById("div-" + docId);
   var changeDivAnswer = changeDiv.childNodes[1];
   var changeAnswer = changeDivAnswer.childNodes[0];
   console.log(changeAnswer);
   changeAnswer.innerText = newAnswer;
}

function changePing(toShow, docId) {
   var changeDiv = document.getElementById("div-" + docId);
   var changeIcon = document.getElementById("teacher-ping-" + docId);
   if (toShow) {
      changeIcon.style.display = "inline-block";
      changeDiv
   } else {
      changeIcon.style.display = "none";
   }
   
}

btnNewQuestion.addEventListener('click', function(evt) {
   unsubscribeQNA();
   db.collection("rooms").doc(dbKey).collection("qna").get().then(function (snapshot) {
      snapshot.docs.forEach(doc => {
         doc.ref.delete();
         console.log("deleted: ");
         console.log(doc.data())
      })
      db.collection("rooms").doc(dbKey).collection("qna").doc("question").set({
         question: "Wait for the next question!",
      })
   })
  
   divQuestion.style.display = "none";
   formQuestion.style.display = "inline-block";
   formQuestion.txtQuestion.value = "";
   clearAnswers();
})

//clearing the enter room textbox
txtEnterRoom.addEventListener('click', function(evt) {
   txtEnterRoom.placeholder = "";
   txtEnterRoom.value = "";
   txtEnterRoom.style.setProperty("font-size", "x-large");
})

//student button clicked
btnStudent.addEventListener('click', function(evt) {
   studentClick();
   btnReset.style.display = "inline-block";
})

function studentClick(){
   btnTeacher.style.setProperty("display", "none") ;//remember to make a back button -- reset for right now
   let divEnter = document.querySelector("#enterRoom");
   divEnter.style.display = "inline-block";
   btnStudent.disabled = true;
   btnStudent.style.backgroundColor = "#FFC107";
   btnStudent.style.color = "#303F9F";
};

//entering a room
formEnterRoom.addEventListener('submit', function(evt) {
   evt.preventDefault();
   var tryRoomKey = this.txtEnterRoom.value.toUpperCase()
   db.collection('rooms').where('roomKey', "==", tryRoomKey).get().then(function(snapshot) {
      console.log(snapshot.size);
      if (snapshot.size == 0) {
         btnEnterRoom.innerText = "Try Again"
      } else if (snapshot.size == 1) {
         snapshot.docs.forEach(doc => {
            if(doc.exists) {
               dbKey = doc.id
               showStudentName();
            } else {
               console.log("This room does not exist!")
            }
   
         })
      } else {
         console.log("there is more than one room with this room id!")
      }
      
   })
})


function showStudentName() {
   divEnter.style.display =  "none";
   divStudent.style.display = "inline-block";
   formName.style.display = "inline-block";
}

formName.addEventListener('submit', function(evt) {
   evt.preventDefault();
   studentName = this.txtName.value
   showStudentAnswerForm()
})

function showStudentAnswerForm() {
   formName.style.display = "none";
   divAnswer.style.display = "inline-block"
   getQuestion()
}


function getQuestion() {
  
   db.collection("rooms").doc(dbKey).collection("qna").onSnapshot(function(qSnapshot) {
      qSnapshot.docChanges().forEach(function(change) {
         console.log(change.doc.data())
         if (change.type === "added") {
            console.log("New: ", change.doc.data());
            if (change.doc.data().question != undefined){
               lblQStudent.innerText = change.doc.data().question
               studentButtonReturn();
            }
        }
        if (change.type === "modified") {
            console.log("Modified: ", change.doc.data());
            if (change.doc.data().question != undefined){
               lblQStudent.innerText = change.doc.data().question
               studentButtonReturn();
            }
            
        }
        if (change.type === "removed") {
            console.log("Removed: ", change.doc.data());
            lblQStudent.innerText = "Room Ended!"
        }
      });
   })
}

function studentButtonReturn() {
   btnPing.style.color = "#303F9F";
   btnSubmitAnswer.innerText = "Submit Answer";
   btnSubmitAnswer.style.backgroundColor = "#303F9F";
   btnSubmitAnswer.style.borderColor = "#FFC107";
   btnSubmitAnswer.style.color = "#FFFFFF"
   lblSubConfirm.innerText = "";
}
//add something that lets the user know that the answer is submitted
formAnswer.addEventListener('submit', function(evt) {
   evt.preventDefault();
   db.collection("rooms").doc(dbKey).collection("qna").doc("answer-"+studentName).set({
      name: studentName,
      answer: this.txtAnswer.value,
      ping: false
   })
   .then(function() {
      var lblSubConfirm = document.querySelector("#lblSubConfirm")
      lblSubConfirm.innerText = "Answer submitted!";
      btnSubmitAnswer.innerText = "Change Answer";
      btnSubmitAnswer.style.backgroundColor = "#FFC107";
      btnSubmitAnswer.style.borderColor = "#303F9F";
      btnSubmitAnswer.style.color = "#303F9F"
      btnPing.style.color = "#303F9F";
   })
   .catch(function(error) {
      window.alert("Error adding answer. Please try again or reload the page!")
   })
})

//the ping part of apingo
btnPing.addEventListener('click', function(evt) {
   //connect to the firebase server
   db.collection("rooms").doc(dbKey).collection("qna").doc("answer-" +studentName).update({
      ping: true
   }).then(function() {
      console.log(studentName + " just pinged");
      btnPing.style.color = "#FFC107";
   }).catch(function(error) {
      console.log("ah shoot" + error);
      btnPing.style.color = "#303F9F";
   })
   
})
//  cd School\ExtraCurricular\HackThis2020\Actual Project\HackThis2020\Apingo