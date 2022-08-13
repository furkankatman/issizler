angular
  .module("issizlerApp")
  .controller("InvitesController", function ($scope) {
    console.log("Invites");
    $scope.Username = "";
    const invitesRef = $scope.fib.db.ref("Invites");
    const gamesRef = $scope.fib.db.ref("Games");
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
          let invite = { val: element.val(), key: element.key };
          $scope.InvitesToMe.push(invite);
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
          let invite = { val: element.val(), key: element.key };
          $scope.InvitesFromMe.push(invite);
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

    $scope.AcceptInvite = function (i) {
      console.log(i, "ssss");
      // console.log(user);
      // var invite = {
      //   FromUsername: $scope.los.get("User").displayName,
      //   ToUsername: user.Username,
      //   FromEmail: $scope.los.get("User").email,
      //   ToEmail: user.Email,
      //   FromUid: $scope.los.get("User").uid,
      //   ToUid: user.Uid,
      //   Created: moment().valueOf(),
      //   Status: 0,
      // };
      $scope.fib.db
        .ref("Invites/" + i.key)
        .update({ Status: 1, AcceptedWhen: moment().valueOf() });

      // Acceptor = player1 :)
      var gameKey = gamesRef.push().key;
      var Game = {};
      Game.Player1 = i.val.FromUid;
      Game.Player2 = i.val.ToUid;
      Game.Player1Username = i.val.FromUsername;
      Game.Player2Username = i.val.ToUsername;
      Game.Turn = 1;
      Game.Questions =
        "-MldXc1dYiexketPElNa,-MldXc1dYiexketPElNa,-MldXc1dYiexketPElNa,-MldXc1dYiexketPElNa,-MldXc1dYiexketPElNa";
      Game.Opens1 = "";
      Game.Opens2 = "";
      Game.Opens3 = "";
      Game.Opens4 = "";
      Game.Opens5 = "";
      Game.Winner1 = "";
      Game.Winner2 = "";
      Game.Winner3 = "";
      Game.Winner4 = "";
      Game.Winner5 = "";
      Game.ActiveQuestion = 0;
      gamesRef.child(gameKey).set(angular.copy(Game));
    };
  });
