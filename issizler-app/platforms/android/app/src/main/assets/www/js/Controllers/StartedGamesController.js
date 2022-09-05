try {
  angular
    .module("issizlerApp")
    .controller("StartedGamesController", function ($scope, $mdDialog) {
      const gamesRef = $scope.fib.db.ref("Games");
      $scope.Games = [];
      $scope.ActiveGame = null;
      $scope.ActiveGameKey = "";
      $scope.isPlayer1 = false;
      $scope.GuessedWord2 = { val: "" };
      $scope.WordPoint = { val: 0 };
      gamesRef
        .orderByChild("Player1")
        .equalTo($scope.los.get("User").uid)
        .on("value", function (snapshot) {
          snapshot.forEach((element) => {
            var game = element.val();
            if (game.Winner5 != 1 && game.Winner5 != 2) {
              game.key = element.key;
              $scope.Games.push(game);
            }
          });
          setTimeout(() => {
            $scope.$apply();
          }, 100);
        });

      gamesRef
        .orderByChild("Player2")
        .equalTo($scope.los.get("User").uid)
        .on("value", function (snapshot) {
          snapshot.forEach((element) => {
            var game = element.val();
            if (game.Winner5 != 1 && game.Winner5 != 2) {
              game.key = element.key;
              $scope.Games.push(game);
            }
          });
          setTimeout(() => {
            $scope.$apply();
          }, 100);
        });

      $scope.setActiveGame = function (game) {
        $scope.ActiveGameKey = game.key;
        if (game.Player1 == $scope.los.get("User").uid) {
          $scope.isPlayer1 = true;
        }
        gamesRef.child(game.key).on("value", function (snapshot) {
          var nextState = snapshot.val();
          if (nextState.Winner5 != "") {
            var winner = $scope.CheckWinner(nextState);

            return;
          }
          $scope.ActiveGame = nextState;
          $scope.ActiveQuestion = $scope.Words.find(
            (x) =>
              x.key ==
              $scope.ActiveGame.Questions.split(",")[
                $scope.ActiveGame.ActiveQuestion
              ]
          );
          $scope.QuestionWordArray = [];
          $scope.ActiveQuestion.Value.split("").forEach((element) => {
            $scope.QuestionWordArray.push({
              Letter: element,
              Visible: false,
            });
          });
          if ($scope.ActiveGame.ActiveQuestion == 0) {
            var opennedLetters = $scope.ActiveGame.Opens1.split(",");
            $scope.WordPoint.val = $scope.QuestionWordArray.length * 100;
            opennedLetters.forEach((x) => {
              if (x.indexOf("$") != -1) {
                $scope.WordPoint.val = $scope.WordPoint.val - 100;

                $scope.QuestionWordArray[x[2]].Visible = true;
              }
            });
            /////
          }
          if ($scope.ActiveGame.ActiveQuestion == 1) {
            $scope.WordPoint.val = $scope.QuestionWordArray.length * 100;
            var opennedLetters = $scope.ActiveGame.Opens2.split(",");
            opennedLetters.forEach((x) => {
              if (x.indexOf("$") != -1) {
                $scope.WordPoint.val = $scope.WordPoint.val - 100;
                $scope.QuestionWordArray[x[2]].Visible = true;
              }
            });
            /////
          }
          if ($scope.ActiveGame.ActiveQuestion == 2) {
            $scope.WordPoint.val = $scope.QuestionWordArray.length * 100;
            var opennedLetters = $scope.ActiveGame.Opens3.split(",");
            opennedLetters.forEach((x) => {
              if (x.indexOf("$") != -1) {
                $scope.WordPoint.val = $scope.WordPoint.val - 100;

                $scope.QuestionWordArray[x[2]].Visible = true;
              }
            });
            /////
          }
          if ($scope.ActiveGame.ActiveQuestion == 3) {
            $scope.WordPoint.val = $scope.QuestionWordArray.length * 100;
            var opennedLetters = $scope.ActiveGame.Opens4.split(",");
            opennedLetters.forEach((x) => {
              if (x.indexOf("$") != -1) {
                $scope.WordPoint.val = $scope.WordPoint.val - 100;

                $scope.QuestionWordArray[x[2]].Visible = true;
              }
            });
            /////
          }
          if ($scope.ActiveGame.ActiveQuestion == 4) {
            $scope.WordPoint.val = $scope.QuestionWordArray.length * 100;
            var opennedLetters = $scope.ActiveGame.Opens5.split(",");
            opennedLetters.forEach((x) => {
              if (x.indexOf("$") != -1) {
                $scope.WordPoint.val = $scope.WordPoint.val - 100;

                $scope.QuestionWordArray[x[2]].Visible = true;
              }
            });
            /////
          }

          $scope.isGuessed = false;
          setTimeout(() => {
            $scope.$apply();
          }, 100);
        });
      };

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
          $scope.Game.QuestionWordArray.push({
            Letter: element,
            Visible: false,
          });
        });
        $scope.Game.GamePoint = $scope.Game.QuestionWordArray.length * 100;
        $scope.isGuessed = false;
      };
      $scope.OpenLetter = function (i) {
        if ($scope.ActiveGame.Turn == 1 && $scope.isPlayer1 != true) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title("Uyarı!")
              .textContent("senin sıran değil")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent((e) => {
                console.log(e);
              })
          );
          return;
        } else if ($scope.ActiveGame.Turn == 2 && $scope.isPlayer1 == true) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title("Uyarı!")
              .textContent("senin sıran değil")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent((e) => {
                console.log(e);
              })
          );
          return;
        }
        $scope.WordPoint.val = $scope.WordPoint.val - 100;
        // if ($scope.GamePoint == 0) return;
        // $scope.GamePoint = $scope.GamePoint - 100;
        $scope.QuestionWordArray[i].Visible = true;
        if ($scope.isPlayer1) {
          switch ($scope.ActiveGame.ActiveQuestion) {
            case 0:
              {
                gamesRef.child($scope.ActiveGameKey).update({
                  Opens1: $scope.ActiveGame.Opens1.concat("1$" + i + ","),
                  Turn: 2,
                });
              }
              break;
            case 1:
              {
                gamesRef.child($scope.ActiveGameKey).update({
                  Opens2: $scope.ActiveGame.Opens2.concat("1$" + i + ","),
                  Turn: 2,
                });
              }
              break;
            case 2:
              {
                gamesRef.child($scope.ActiveGameKey).update({
                  Opens3: $scope.ActiveGame.Opens3.concat("1$" + i + ","),
                  Turn: 2,
                });
              }
              break;
            case 3:
              {
                gamesRef.child($scope.ActiveGameKey).update({
                  Opens4: $scope.ActiveGame.Opens4.concat("1$" + i + ","),
                  Turn: 2,
                });
              }
              break;
            case 4: {
              gamesRef.child($scope.ActiveGameKey).update({
                Opens5: $scope.ActiveGame.Opens5.concat("1$" + i + ","),
                Turn: 2,
              });
            }

            default:
              break;
          }
        } else {
          switch ($scope.ActiveGame.ActiveQuestion) {
            case 0:
              {
                gamesRef.child($scope.ActiveGameKey).update({
                  Opens1: $scope.ActiveGame.Opens1.concat("2$" + i + ","),
                  Turn: 1,
                });
              }
              break;
            case 1:
              {
                gamesRef.child($scope.ActiveGameKey).update({
                  Opens2: $scope.ActiveGame.Opens2.concat("2$" + i + ","),
                  Turn: 1,
                });
              }
              break;
            case 2:
              {
                gamesRef.child($scope.ActiveGameKey).update({
                  Opens3: $scope.ActiveGame.Opens3.concat("2$" + i + ","),
                  Turn: 1,
                });
              }
              break;
            case 3:
              {
                gamesRef.child($scope.ActiveGameKey).update({
                  Opens4: $scope.ActiveGame.Opens4.concat("2$" + i + ","),
                  Turn: 1,
                });
              }
              break;
            case 4: {
              gamesRef.child($scope.ActiveGameKey).update({
                Opens5: $scope.ActiveGame.Opens5.concat("2$" + i + ","),
                Turn: 1,
              });
            }

            default:
              break;
          }
        }
      };
      $scope.Guess = function (w) {
        if ($scope.ActiveGame.Turn == 1 && $scope.isPlayer1 != true) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title("Uyarı!")
              .textContent("senin sıran değil")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent((e) => {
                console.log(e);
              })
          );
          return;
        } else if ($scope.ActiveGame.Turn == 2 && $scope.isPlayer1 == true) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title("Uyarı!")
              .textContent("senin sıran değil")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent((e) => {
                console.log(e);
              })
          );
          return;
        }
        if ($scope.isGuessed) return;
        $scope.isGuessed = true;
        //WINNER CASE
        if (w.val.toLowerCase() == $scope.ActiveQuestion.Value.toLowerCase()) {
          $scope.OpenQuestionWord(0);
          //   $scope.ScoreHistories = [];
          const scoreHistoryRef = $scope.fib.db.ref("ScoreHistory");
          var key = scoreHistoryRef.push().key;
          var question = {
            EmailAnsweredBy: $scope.los.get("User").email,
            UidAnsweredBy: $scope.los.get("User").uid,
            QuestionAnswered: $scope.ActiveQuestion,
            Score: $scope.WordPoint.val,
            GameKey: $scope.ActiveGameKey,
          };
          question.Created = moment().valueOf();
          scoreHistoryRef.child(key).set(question);

          //alert("Bildiniz...");
        } else {
          //LOOSER CASE
          $scope.LooserSignal();
          // alert("Bilemediniz...");
        }
      };
      $scope.OpenQuestionWord = function (i) {
        $scope.QuestionWordArray[i].Visible = true;
        setTimeout(() => {
          if (i < $scope.QuestionWordArray.length - 1) {
            $scope.OpenQuestionWord(i + 1);
            $scope.$apply();
            if (i == $scope.QuestionWordArray.length - 2) {
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
          if ($scope.ActiveGame.ActiveQuestion == 0) {
            gamesRef.child($scope.ActiveGameKey).update({
              Winner1: $scope.ActiveGame.Turn,
              ActiveQuestion: $scope.ActiveGame.ActiveQuestion + 1,
            });
          } else if ($scope.ActiveGame.ActiveQuestion == 1) {
            gamesRef.child($scope.ActiveGameKey).update({
              Winner2: $scope.ActiveGame.Turn,
              ActiveQuestion: $scope.ActiveGame.ActiveQuestion + 1,
            });
          } else if ($scope.ActiveGame.ActiveQuestion == 2) {
            gamesRef.child($scope.ActiveGameKey).update({
              Winner3: $scope.ActiveGame.Turn,
              ActiveQuestion: $scope.ActiveGame.ActiveQuestion + 1,
            });
          } else if ($scope.ActiveGame.ActiveQuestion == 3) {
            gamesRef.child($scope.ActiveGameKey).update({
              Winner4: $scope.ActiveGame.Turn,
              ActiveQuestion: $scope.ActiveGame.ActiveQuestion + 1,
            });
          } else if ($scope.ActiveGame.ActiveQuestion == 4) {
            gamesRef.child($scope.ActiveGameKey).update(
              {
                Winner5: $scope.ActiveGame.Turn,
              },
              function (err) {
                if (!err) {
                  console.log("game is done");
                }
              }
            );
          }
          //$scope.SetQuestion();
          $scope.GuessedWord2.val = "";
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
          if ($scope.isPlayer1) {
            gamesRef.child($scope.ActiveGameKey).update({
              Turn: 2,
            });
          } else {
            gamesRef.child($scope.ActiveGameKey).update({
              Turn: 1,
            });
          }
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
      $scope.CheckWinner = function (g) {
        var p1Wins = 0;
        var p2Wins = 0;
        if (g.Winner1 == "1") {
          p1Wins += 1;
        }
        if (g.Winner1 == "2") {
          p2Wins += 1;
        }
        if (g.Winner2 == "1") {
          p1Wins += 1;
        }
        if (g.Winner2 == "2") {
          p2Wins += 1;
        }
        if (g.Winner3 == "1") {
          p1Wins += 1;
        }
        if (g.Winner3 == "2") {
          p2Wins += 1;
        }
        if (g.Winner4 == "1") {
          p1Wins += 1;
        }
        if (g.Winner4 == "2") {
          p2Wins += 1;
        }
        if (g.Winner5 == "1") {
          p1Wins += 1;
        }
        if (g.Winner5 == "2") {
          p2Wins += 1;
        }
        if ($scope.isPlayer1 && p1Wins > p2Wins) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title("Uyarı!")
              .textContent(
                g.Player2Username +
                  " ile olan oyununuzu kazandınız. " +
                  "Siz:" +
                  p1Wins +
                  "- Rakibiniz:" +
                  p2Wins
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent((e) => {
                console.log(e);
              })
          );
        } else if ($scope.isPlayer1 && p1Wins < p2Wins) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title("Uyarı!")
              .textContent(
                g.Player2Username +
                  " ile olan oyununuzu kaybetttiniz. " +
                  "Siz:" +
                  p1Wins +
                  "- Rakibiniz:" +
                  p2Wins
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent((e) => {
                console.log(e);
              })
          );
        }
        if (!$scope.isPlayer1 && p1Wins < p2Wins) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title("Uyarı!")
              .textContent(
                g.Player1Username +
                  " ile olan oyununuzu kazandınız. " +
                  "Siz:" +
                  p2Wins +
                  "- Rakibiniz:" +
                  p1Wins
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent((e) => {
                console.log(e);
              })
          );
        } else if (!$scope.isPlayer1 && p1Wins > p2Wins) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title("Uyarı!")
              .textContent(
                g.Player1Username +
                  " ile olan oyununuzu kaybetttiniz. " +
                  "Siz:" +
                  p2Wins +
                  "- Rakibiniz:" +
                  p1Wins
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent((e) => {
                console.log(e);
              })
          );
        }
      };
      $scope.Today = moment().valueOf();
    });
} catch (error) {
  console.log(error);
}
