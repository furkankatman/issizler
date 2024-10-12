angular.module("issizlerApp").controller("GameController", function ($scope) {
  console.log("WordGameController ");
  $scope.ShowGameSetting = false;
  $scope.isGuessed = false;
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
    $scope.isGuessed = false;
  };
  $scope.OpenLetter = function (i) {
    if ($scope.Game.GamePoint == 0) return;
    $scope.Game.GamePoint = $scope.Game.GamePoint - 100;
    $scope.Game.QuestionWordArray[i].Visible = true;
  };
  $scope.Guess = function () {
    if ($scope.isGuessed) return;
    $scope.isGuessed = true;
    //WINNER CASE
    if (
      $scope.GuessedWord.toLowerCase() ==
      $scope.Game.QuestionWord.Value.toLowerCase()
    ) {
      $scope.OpenQuestionWord(0);
      //   $scope.ScoreHistories = [];
      const scoreHistoryRef = $scope.fib.db.ref("ScoreHistory");
      let key = scoreHistoryRef.push().key;
      var question = {
        EmailAnsweredBy: $scope.los.get("User").email,
        UidAnsweredBy: $scope.los.get("User").uid,
        QuestionAnswered: $scope.Game.QuestionWord,
        Score: $scope.Game.GamePoint,
      };
      question.Created = moment().valueOf();
      scoreHistoryRef.child(key).set(question);
      const scoreBoardRef = $scope.fib.db.ref("ScoreBoard");
      scoreBoardRef
        .orderByChild("uid")
        .equalTo($scope.los.get("User").uid)
        .once("value")
        .then((snapshot) => {
          if (snapshot.numChildren() > 0) {
            let newValue = snapshot.val()[Object.keys(snapshot.val())[0]];

            newValue.point = newValue.point + $scope.Game.GamePoint;
            snapshot.forEach((x) => {
              scoreBoardRef.child(x.key).update({
                point: newValue.point,
                picture: $scope.los.get("User").photoUrl
                  ? $scope.los.get("User").photoUrl
                  : "",
              });
            });
          } else {
            console.log("ilk defa puan aldi");
            let keyScore = scoreBoardRef.push().key;
            let scoreBoardObject = {
              uid: $scope.los.get("User").uid,
              point: $scope.Game.GamePoint,
              created: question.Created,
              username: $scope.los.get("User").displayName,
              picture: $scope.los.get("User").photoUrl,
            };
            scoreBoardRef.child(keyScore).set(scoreBoardObject);
          }
        });

      //alert("Bildiniz...");
    } else {
      //LOOSER CASE
      $scope.LooserSignal();
      // alert("Bilemediniz...");
    }
  };
  $scope.OpenQuestionWord = function (i) {
    $scope.Game.QuestionWordArray[i].Visible = true;
    setTimeout(() => {
      if (i < $scope.Game.QuestionWordArray.length - 1) {
        $scope.OpenQuestionWord(i + 1);
        $scope.$apply();
        if (i == $scope.Game.QuestionWordArray.length - 2) {
          $scope.WinnerSignal();
        }
      }
    }, 200);
  };
  $scope.WinnerSignal = function () {
    angular
      .element(document.getElementsByClassName("Signal")[0])
      .addClass("visible");
    angular
      .element(document.getElementsByClassName("Signal")[0])
      .addClass("animate__flash");
    setTimeout(() => {
      angular
        .element(document.getElementsByClassName("Signal")[0])
        .removeClass("visible");
      angular
        .element(document.getElementsByClassName("Signal")[0])
        .removeClass("animate__flash");

      $scope.SetQuestion();

      $scope.$apply();
    }, 2000);
  };
  $scope.LooserSignal = function () {
    angular
      .element(document.getElementsByClassName("Signal")[0])
      .addClass("visible BgRed");
    angular
      .element(document.getElementsByClassName("Signal")[0])
      .addClass("animate__flash");
    setTimeout(() => {
      angular
        .element(document.getElementsByClassName("Signal")[0])
        .removeClass("visible BgRed");
      angular
        .element(document.getElementsByClassName("Signal")[0])
        .removeClass("animate__flash");
      $scope.isGuessed = false;
      $scope.$apply();
    }, 2000);
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
