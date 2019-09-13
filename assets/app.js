// ===== FIREBASE SETUP AND INICIALIZATION ==== //

var firebaseConfig = {
    apiKey: "AIzaSyAUnyii3rEIO_yPIozHbEgodjuBSNlCOGo",
    authDomain: "what-you-like-9c7a9.firebaseapp.com",
    databaseURL: "https://what-you-like-9c7a9.firebaseio.com",
    projectId: "what-you-like-9c7a9",
    storageBucket: "",
    messagingSenderId: "428384929564",
    appId: "1:428384929564:web:673eb02c913c501c571cd9"
  };

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// ======= VARIABLES ====== //

var hourFormat = "HH:mm";
var children = [];
var intervalId;
var clockId;
var childNumber = 0;
var newTrainKey;

$("#display-current-time").text(moment().format("HH:mm:ss"));

// ==== TIMERS ==== //

intervalId = setInterval(populatePage, 1000 * 60);
clockId = setInterval(updateClock, 1000);

// ===== EVENTS ===== //

$("button").on("click", getUserInput);

$(document).on("click", ".update", updateElement);
$(document).on("click", ".remove", removeElement);

database.ref().on("child_added", getChildren);

// ++++++++++++   FIX THIS ++++++++++++ //
database.ref().on("child_removed", populatePage);

// ========= F U N C T I O N S ===================//

function getUserInput () {

    event.preventDefault();

    var newTrain = {
        trainName: $("#train-name").val().trim(),
        destination: $("#destination").val().trim(),
        firstTrainTime: $("#first-train-time").val().trim(),
        frequency: $("#frequency").val().trim(),
        key: "",
    }

    newTrainKey = database.ref().push(newTrain).key;
   
}

function getChildren (childSnapshot){

    //childSnapshot.val().key = childSnapshot.key;
    children.push(childSnapshot.val());
    console.log(children);
    
    var newRow = $("<tr>");

    var convertedHour = moment(childSnapshot.val().firstTrainTime, hourFormat);
    var timeLapse = moment().diff(convertedHour, "minutes");

    var minutesAway = childSnapshot.val().frequency - timeLapse % childSnapshot.val().frequency;
    var nextArrival = moment().add(minutesAway, "minutes");


    // TRAIN NAME - DESTINATION - FREQUENCY - NEXT ARRIVAL - MINUTES AWAY
    newRow.append("<td>" + childSnapshot.val().trainName + "</td>");
    newRow.append("<td>" + childSnapshot.val().destination + "</td>");
    newRow.append("<td>" + childSnapshot.val().frequency + "</td>");
    newRow.append("<td>" + nextArrival.format("HH:mm") + "</td>");
    newRow.append("<td>" + minutesAway + "</td>");
    newRow.append("<button data-key='" + childSnapshot.key + "' data-index='" + childNumber + "' class='update'>Update</button>" + "<button data-key='" + childSnapshot.key + "' data-index='" + childNumber + "' class='remove'>Remove</button>");

    $("tbody").append(newRow);

    children[childNumber].key = childSnapshot.key;
    childNumber++;

}

function populatePage () {

    $("tbody").empty();

    for (var i=0; i < children.length ; i++) {
        var newRow = $("<tr>");

        var convertedHour = moment(children[i].firstTrainTime, hourFormat);
        var timeLapse = moment().diff(convertedHour, "minutes");

        var minutesAway = children[i].frequency - timeLapse % children[i].frequency;
        var nextArrival = moment().add(minutesAway, "minutes");


        // TRAIN NAME - DESTINATION - FREQUENCY - NEXT ARRIVAL - MINUTES AWAY
        newRow.append("<td>" + children[i].trainName + "</td>");
        newRow.append("<td>" + children[i].destination + "</td>");
        newRow.append("<td>" + children[i].frequency + "</td>");
        newRow.append("<td>" + nextArrival.format("HH:mm") + "</td>");
        newRow.append("<td>" + minutesAway + "</td>");
        newRow.append("<button data-key='" + children[i].key + "' data-index='" + i + "' class='update'>Update</button>" + "<button data-key='" + children[i].key + "' data-index='" + i + "' class='remove'>Remove</button>");

        $("tbody").append(newRow);
    }
    console.log("Page populated");
}

function updateClock () {
    $("#display-current-time").text(moment().format("HH:mm:ss"));
}

function updateElement () {
    // AUN NO HACE NADA!!!!
    var currentKey = $(this).attr("data-key");
    var currentIndex = $(this).attr("data-index");
    console.log(currentKey, currentIndex); 


}

function removeElement () {
    // AUN NO HACE NADA!!!!
    var currentKey = $(this).attr("data-key");
    var currentIndex = $(this).attr("data-index");
    children.splice(currentIndex, 1);
    database.ref('/'+ currentKey).remove();
    
    console.log(children);
}

// function writeNewPost(uid, username, picture, title, body) {
//     // A post entry.
//     var postData = {
//       author: username,
//       uid: uid,
//       body: body,
//       title: title,
//       starCount: 0,
//       authorPic: picture
//     };
  
//     // Get a key for a new Post.
//     var newPostKey = firebase.database().ref().child('posts').push().key;
  
//     // Write the new post's data simultaneously in the posts list and the user's post list.
//     var updates = {};
//     updates['/posts/' + newPostKey] = postData;
//     updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  
//     return firebase.database().ref().update(updates);
//   }