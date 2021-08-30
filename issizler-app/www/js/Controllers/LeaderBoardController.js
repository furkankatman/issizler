angular
  .module("issizlerApp")
  .controller("LeaderBoardController", function ($scope) {
    console.log("LeaderBoard");

    console.log($scope.Score, "Toplam Tüm Scorelar ddddd");

    $scope.PlayersScores = [];
    $scope.Score.ScoreHistories.forEach((element) => {
      var itemIndex = $scope.PlayersScores.findIndex((x) => {
        return x.EmailAnsweredBy == element.EmailAnsweredBy;
      });

      if (itemIndex != -1) {
        $scope.PlayersScores[itemIndex].Score += element.Score;
      } else {
        $scope.PlayersScores.push({
          Score: element.Score,
          EmailAnsweredBy: element.EmailAnsweredBy,
        });
      }
    });
  });
