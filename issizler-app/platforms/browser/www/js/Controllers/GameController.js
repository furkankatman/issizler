angular.module("issizlerApp").controller("GameController", function ($scope) {
  console.log("WordGameController ");
  $scope.ShowGameSetting = false;
  if (!$scope.Words) {
    $scope.state.go("Home");
    return;
  }
  $scope.Game.QuestionWord =
    $scope.Words[Math.floor(Math.random() * $scope.Words.length)];
  $scope.GuessedWord = "";
  $scope.Today = moment().valueOf();
  $scope.Game.QuestionWordArray = [];
  $scope.Game.QuestionWord.Value.split("").forEach((element) => {
    $scope.Game.QuestionWordArray.push({ Letter: element, Visible: false });
  });
  $scope.Game.GamePoint = $scope.Game.QuestionWordArray.length * 100;
  console.log($scope.Game.QuestionWord);

  $scope.OpenLetter = function (i) {
    if ($scope.Game.GamePoint == 0) return;
    $scope.Game.GamePoint = $scope.Game.GamePoint - 100;
    $scope.Game.QuestionWordArray[i].Visible = true;
  };

  $scope.Guess = function () {
    if ($scope.GuessedWord == $scope.Game.QuestionWord.Value) {
      //   $scope.ScoreHistories = [];
      const scoreHistoryRef = $scope.fib.db.ref("ScoreHistory");
      var key = scoreHistoryRef.push().key;
      var question = {
        Email: $scope.los.get("User").email,
        Uid: $scope.los.get("User").uid,
        Question: $scope.Game.QuestionWord,
        Score: $scope.Game.GamePoint,
      };
      question.Created = moment().valueOf();
      scoreHistoryRef.child(key).set(question);
      alert("Bildiniz...");
    } else {
      alert("Bilemediniz...");
    }
  };
});
