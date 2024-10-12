angular.module("issizlerApp").controller("WordPoolController", function ($scope) {

    console.log("WordPoolController welcome");
    $scope.WordToAdd = { Value: "", Definition: "" };

    $scope.AddWord = function () {
        $scope.WordToAdd.CreatedByEmail = $scope.los.get("User").email;
        $scope.WordToAdd.CreatedByUsername = $scope.los.get("User").displayName;
        $scope.WordToAdd.Created = moment().valueOf();
        $scope.WordToAdd.CreatedByPhoto = $scope.los.get("User").photoURL;
        const wordRef = $scope.fib.db.ref("WordPool");
        wordRef.child(wordRef.push().key).set($scope.WordToAdd);
        console.log($scope.WordToAdd);
    }

    const wordsRef = $scope.fib.db.ref("WordPool");
    wordsRef.on("value", function (snapshot) {
        $scope.Words = [];
        snapshot.forEach(element => {
            $scope.Words.push(element.val())
        });
        setTimeout(() => {
            $scope.$apply()
        }, 100);
    })


})