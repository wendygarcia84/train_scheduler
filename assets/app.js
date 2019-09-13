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

$("button").on("click", function(){

    event.preventDefault();

    var newTrain = {
        trainName: $("#train-name").val().trim(),
        destination: $("#destination").val().trim(),
        firstTrainTime: $("#first-train-time").val().trim(),
        frequency: $("#frequency").val().trim(),
    }

    database.ref().push(newTrain);
   
});

database.ref().on("child_added", function(childSnapshot){
    
});