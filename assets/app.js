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

$("#display-current-time").text(moment().format("HH:mm:ss"));

// ==== TIMERS ==== //

intervalId = setInterval(populatePage, 1000 * 60);
clockId = setInterval(updateClock, 1000);

// ===== EVENTS ===== //

$("button").on("click", getUserInput);

database.ref().on("child_added", getChildren);

// ========= F U N C T I O N S ===================//

function getUserInput () {

    event.preventDefault();

    var newTrain = {
        trainName: $("#train-name").val().trim(),
        destination: $("#destination").val().trim(),
        firstTrainTime: $("#first-train-time").val().trim(),
        frequency: $("#frequency").val().trim()
    }

    database.ref().push(newTrain);
   
}

function getChildren (childSnapshot){

    children.push(childSnapshot.val());
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
    newRow.append("<button data-number='" + childNumber + "' class='update'" + ">Update</button>" + "<button data-number='" + childNumber + "' class='remove'" + ">Remove</button>");

    $("tbody").append(newRow); 

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

        $("tbody").append(newRow);
    }
    console.log("Page populated");
}

function updateClock () {
    $("#display-current-time").text(moment().format("HH:mm:ss"));
}