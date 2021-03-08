angular
  .module("issizlerApp")
  .controller("InvitesController", function ($scope) {
    console.log("Invites");
    $scope.Username = "";
    const invitesRef = $scope.fib.db.ref("Invites");
    const usersRef = $scope.fib.db.ref("Users");
    $scope.UsersFound = [];
    $scope.InvitesFromMe = [];
    $scope.InvitesToMe = [];

    invitesRef
      .orderByChild("ToEmail")
      .equalTo($scope.los.get("User").email)
      .on("value", function (snapshot) {
        $scope.InvitesToMe = [];
        snapshot.forEach((element) => {
          $scope.InvitesToMe.push(element.val());
        });
        setTimeout(() => {
          $scope.$apply();
        }, 100);
      });

    invitesRef
      .orderByChild("FromEmail")
      .equalTo($scope.los.get("User").email)
      .on("value", function (snapshot) {
        $scope.InvitesFromMe = [];
        snapshot.forEach((element) => {
          $scope.InvitesFromMe.push(element.val());
        });
        setTimeout(() => {
          $scope.$apply();
        }, 100);
      });

    $scope.Search = function () {
      console.log("aranıyor...");
      usersRef
        .orderByChild("Username")
        .equalTo($scope.Username)
        .once("value")
        .then(function (snapshot) {
          snapshot.forEach((element) => {
            $scope.UsersFound.push(element.val());
          });
          setTimeout(() => {
            $scope.$apply();
          }, 100);
        });
    };

    $scope.SendInvite = function (user) {
      console.log(user);
      var invite = {
        FromUsername: $scope.los.get("User").displayName,
        ToUsername: user.Username,
        FromEmail: $scope.los.get("User").email,
        ToEmail: user.Email,
        FromUid: $scope.los.get("User").uid,
        ToUid: user.Uid,
        Created: moment().valueOf(),
        Status: 0,
      };
      var key = invitesRef.push().key;
      invitesRef
        .child(key)
        .set(invite)
        .then(function () {
          console.log("Davet Gönderildi.");
        });
    };
  });
