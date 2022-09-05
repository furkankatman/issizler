import * as functions from "firebase-functions";
import * as admin  from "firebase-admin";
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.makeUppercase = functions.database.ref('/Invites/{id}')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      
      functions.logger.log('Uppercasing', context.params.id,"---", original);
      const sendNtf = snapshot.ref.root.child("PushTokens").child(original.ToUid).once("value");
      const payload = {
        notification: {
            "title": "Oyun Davetiniz Var.",
            "body":  snapshot.val().FromUsername+" size bir oyun davet gönderdi." ,
            "icon": "",
            "sound": "default",
            "click_action": "FCM_PLUGIN_ACTIVITY"
        },
        data: {
            type: "newgame",
            invite_ref:context.params.id,
            inviter_uid:original.FromUid
        }
    };
    sendNtf.then(snapshot => {
        var token = {} as any;
        token = snapshot.val();
        if (token != null)
            return admin.messaging().sendToDevice(token.Token, payload);
            return null;
    });
  
    });