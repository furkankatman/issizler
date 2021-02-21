angular.module("issizlerApp").controller("GameController", function ($scope) {
  console.log("WordGameController ");
  $scope.ShowGameSetting = false;
  if (!$scope.Words) {
    $scope.state.go("Home");
    return;
  }
  $scope.SetQuestion = function () {
    $scope.Game.QuestionWord =
      $scope.Words[Math.floor(Math.random() * $scope.Words.length)];
    $scope.GuessedWord = "";

    $scope.Game.QuestionWordArray = [];
    $scope.Game.QuestionWord.Value.split("").forEach((element) => {
      $scope.Game.QuestionWordArray.push({ Letter: element, Visible: false });
    });
    $scope.Game.GamePoint = $scope.Game.QuestionWordArray.length * 100;
  };
  $scope.OpenLetter = function (i) {
    if ($scope.Game.GamePoint == 0) return;
    $scope.Game.GamePoint = $scope.Game.GamePoint - 100;
    $scope.Game.QuestionWordArray[i].Visible = true;
  };
  $scope.Guess = function () {
    if (
      $scope.GuessedWord.toLowerCase() ==
      $scope.Game.QuestionWord.Value.toLowerCase()
    ) {
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
      $scope.SetQuestion();
    } else {
      alert("Bilemediniz...");
    }
  };
  $scope.Favorite = function (question) {
    const favoritesRef = $scope.fib.db.ref("Favorites");
    var key = favoritesRef.push().key;
    var questionFav = {
      Question: question,
      Created: moment().valueOf(),
      Email: $scope.los.get("User").email,
      Uid: $scope.los.get("User").uid,
    };
    favoritesRef.child(key).set(questionFav);
  };
  $scope.IsFavorite = function (question) {
    var isFavorite = false;
    $scope.Game.Favorites.forEach(function (item) {
      if (
        item.Question.Definition == question.Definition &&
        item.Question.CreatedByEmail == $scope.los.get("User").email
      ) {
        isFavorite = true;
      }
    });
    return isFavorite;
  };

  $scope.Today = moment().valueOf();

  $scope.SetQuestion();

  console.log($scope.Game.QuestionWord);
});
