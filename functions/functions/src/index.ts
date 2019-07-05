import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

// [START createProfile]
// add user profile to firestore user collection when new accoount created
export const createProfile = functions.auth.user()
    .onCreate(function (userRecord, context) {
        return admin.firestore().doc('/users/' + userRecord.uid).set({
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
            uid: userRecord.uid,
        });
    });
// [END createProfile]


// [START removeUserFromDatabase]
// remove user profile from firesotre when user is removed
export const removeUserFromDatabase = functions.auth.user()
    .onDelete(function (userRecord, context) {
        const uid = userRecord.uid;
        return admin.firestore().doc("/users/" + uid).delete();
    });


// [END createProfile]