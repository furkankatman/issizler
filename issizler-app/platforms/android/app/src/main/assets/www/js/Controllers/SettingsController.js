angular
  .module("issizlerApp")
  .controller("SettingsController", function ($scope) {
    console.log("Settings");

    const SettingsRef = $scope.fib.db.ref("Settings");

    SettingsRef.orderByChild("Email")
      .equalTo($scope.los.get("User").email)
      .once("value")
      .then(function (snapshot) {
        if (snapshot.hasChildren()) {
          snapshot.forEach((element) => {
            $scope.Settings = element.val();
          });
          console.log(snapshot);
        } else {
          var key = SettingsRef.push().key;
          $scope.Settings = {
            Mute: false,
            Email: $scope.los.get("User").email,
            Uid: $scope.los.get("User").uid,
          };
          SettingsRef.child(key).set($scope.Settings);
        }
      });

    $scope.MuteChange = function () {
      SettingsRef.orderByChild("Email")
        .equalTo($scope.los.get("User").email)
        .once("value")
        .then(function (snapshot) {
          if (snapshot.hasChildren()) {
            snapshot.forEach((element) => {
              $scope.Settings.Email = $scope.los.get("User").email;
              $scope.Settings.Uid = $scope.los.get("User").uid;
              SettingsRef.child(element.key).set($scope.Settings);
            });
            console.log(snapshot);
          } else {
            var key = SettingsRef.push().key;
            $scope.Settings = {
              Mute: false,
              Email: $scope.los.get("User").email,
              Uid: $scope.los.get("User").uid,
            };
            SettingsRef.child(key).set($scope.Settings);
          }
        });
    };

    $scope.SendResetPasswordEmail = function () {
      $scope.fib
        .auth()
        .sendPasswordResetEmail($scope.los.get("User").email)
        .then(function () {
          alert("Mail Gönderildi...");
        });
    };
  });
