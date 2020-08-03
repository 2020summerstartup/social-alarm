const functions = require('firebase-functions');
var fetch  = require("node-fetch");

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.updateDoc = functions.firestore.document('groups/{groupId}').onCreate((snapshot, context) =>{
  //snapshot.ref.update({text: "Hi"})
});

exports.groupsUpdated = functions.firestore.document('users/{userId}').onUpdate((snapshot, context) =>{
  console.log("heyheyhey")
  //snapshot.after.ref.update({ohhi: "ohhi"})
  const oldData = snapshot.before.data();
  const newData = snapshot.after.data();

  if(oldData.groups.length != newData.groups.length) {
    //snapshot.after.ref.update({text: "Hi"})
    console.log('helllloooo')
  }
  
});

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
