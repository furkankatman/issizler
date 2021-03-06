angular
  .module("issizlerApp")
  .controller("InvitesController", function ($scope) {
    console.log("Invites");
    $scope.Username = "";
    const invitesRef = $scope.fib.db.ref("Invites");
    const usersRef = $scope.fib.db.ref("Users");
    $scope.UsersFound = [];

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
  });
