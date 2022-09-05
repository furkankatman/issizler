angular
  .module("issizlerApp")
  .controller(
    "MainController",
    function (
      $scope,
      $q,
      $filter,
      $mdSidenav,
      $mdDialog,
      $state,
      localStorageService,
      $log,
      $timeout,
      $transitions
    ) {
      $scope.Hello = "Hello";
      /*
  SideNav 
  */
      $scope.toggleLeft = buildToggler("left");
      $scope.toggleRight = buildToggler("right");
      $scope.isOpenRight = function () {
        return $mdSidenav("right").isOpen();
      };
      function buildToggler(navID) {
        return function () {
          // Component lookup should always be available since we are not using `ng-if`
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
        };
      }
      $scope.close = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav("right")
          .close()
          .then(function () {
            //$log.debug("close RIGHT is done");
          });
      };
      /*
   SideNavEnd 
   */
      $scope.state = $state;
      $scope.fib = firebase;
      $scope.fib.db = firebase.database();
      $scope.los = localStorageService;

      $scope.Logout = function () {
        $scope.fib
          .auth()
          .signOut()
          .then(
            function () {
              console.log("Signed Out");
              // $scope.los.set("User", null);
              localStorage.clear();
              $scope.$apply();
            },
            function (error) {
              console.error("Sign Out Error", error);
            }
          );
        $state.go("Home");
      };

      $scope.fib.db
        .ref("Users")
        .orderByChild("Status")
        .equalTo(1)
        .on("value", function (snapshot) {
          $scope.los.set("OnlineCount", snapshot.numChildren());
          setTimeout(() => {
            $scope.$apply();
          }, 100);
        });

      $scope.onSwipeLeft = function (ev, target) {
        console.log(ev);
        console.log(target);
      };

      // $.getJSON("http://localhost:3000/browser/www/scripts/bolumler.json", function (json) {
      //     $scope.Departments = json; // this will show the info it in firebug console
      // });

      $scope.GameTypes = { Training: 0, Opponent: 1 };
      $scope.Game = { Favorites: [] };
      $scope.StartGame = function (type) {
        switch (type) {
          case $scope.GameTypes.Training:
            {
              console.log("Kendi kendine oyun açılıyor.....");
              $scope.Game.Type = $scope.GameTypes.Training;
              $scope.Game.Created = moment().valueOf();
              $scope.state.go("Game");
            }
            break;

          default:
            break;
        }
      };
      const wordsRef = $scope.fib.db.ref("WordPool");
      wordsRef.on("value", function (snapshot) {
        $scope.Words = [];
        snapshot.forEach((element) => {
          var word = element.val();
          word.key = element.key;
          $scope.Words.push(word);
        });
        setTimeout(() => {
          $scope.$apply();
        }, 100);
      });
      $scope.Score = { TotalScore: 0 };

      $scope.SetScoreBoards = function () {
        console.log("score ...");
        $scope.Score.ScoreBoards = [];
        const scoreBoardRef = $scope.fib.db.ref("ScoreBoard");
        scoreBoardRef.on("value", function (snapshot) {
          $scope.Score.ScoreBoards = [];
          snapshot.forEach(function (val) {
            $scope.Score.ScoreBoards.push(val.val());
          });
        });

        const scoreHistoryRef = $scope.fib.db.ref("ScoreHistory");
        scoreHistoryRef.on("value", function (snapshot) {
          $scope.Score.ScoreHistories = [];
          $scope.Score.PlayersScores = [];
          var s = 0;
          $scope.Score.TotalScore = 0;
          snapshot.forEach(function (val) {
            $scope.Score.ScoreHistories.push(val.val());
            if (val.val().EmailAnsweredBy == $scope.los.get("User").email) {
              $scope.Score.TotalScore =
                $scope.Score.TotalScore + val.val().Score;
            }
            var itemIndex = $scope.Score.PlayersScores.findIndex((x) => {
              return x.EmailAnsweredBy == val.val().EmailAnsweredBy;
            });

            if (itemIndex != -1) {
              $scope.Score.PlayersScores[itemIndex].Score += val.val().Score;
            } else {
              $scope.Score.PlayersScores.push({
                Score: val.val().Score,
                EmailAnsweredBy: val.val().EmailAnsweredBy,
              });
            }
          });
          $scope.Score.PlayersScores = $filter("orderBy")(
            $scope.Score.PlayersScores,
            "Score",
            true
          );
          var index = $scope.Score.PlayersScores.findIndex(
            (x) => x.EmailAnsweredBy == $scope.los.get("User").email
          );
          $scope.Score.MyPosition = index + 1;
          setTimeout(() => {
            $scope.$apply();
          }, 100);
        });
      };
      /*
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
      */

      $scope.GetFavorites = function () {
        const favoritesRef = $scope.fib.db
          .ref("Favorites")
          .orderByChild("Email")
          .equalTo($scope.los.get("User").email);
        favoritesRef.on("value", function (snapshot) {
          $scope.Game.Favorites = [];
          snapshot.forEach(function (item) {
            $scope.Game.Favorites.push(item.val());
          });
        });
      };
      $scope.PleaseLogin = function (ev) {
        console.log(ev);
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title("Lütfen Giriş Yapınız.")
            .textContent("Üzgünüz ancak hesabınızla giriş yapmanız gerekli.")
            .ariaLabel("Alert Dialog Demo")
            .ok("OK")
            .targetEvent(ev)
        );
      };
      //Token generation
      if ($scope.los.get("User") != null) {
        setTimeout(() => {
          $scope.getToken_x($scope.los.get("User").uid);
        }, 2000);
      }
      $transitions.onSuccess({}, function (transition) {
        console.log(
          "Successful Transition from " +
            transition.from().name +
            " to " +
            transition.to().name
        );
        if (transition.to().name == "Home" && $scope.los.get("User") != null) {
          $scope.SetScoreBoards();
          $scope.GetFavorites();
        }
      });

      $scope.getToken_x = function (uid) {
        //FCMPlugin.onTokenRefresh(function (token) {
        //    if (token === "" || token === null)
        //        return;
        //    // save this server-side and use it to push notifications to this device
        //    if (token !== null && token !== $scope.los.get("Driver").Token) {
        //        $scope.ptoken = token;
        //        token = {
        //            "IsActive": true,
        //            "Token": "",
        //            "Created": "",
        //            "Driver": {}
        //        };
        //        token.Driver = $scope.los.get("Driver");
        //        token.Created = moment.utc().format();
        //        token.Token = $scope.ptoken;
        //        $http.post(DevServiceUrl[0].url + "/push/AddNewToken", token).then(function (res) {

        //        });
        //    }
        //});

        FCMPlugin.getToken(function (token) {
          if (token === "" || token === null) {
            alert("no token");
            return;
          }
          $scope.ptoken = token;
          token = {
            Token: "",
            Created: "",
            Uid: "",
          };
          token.Created = moment.utc().format();
          token.Token = $scope.ptoken;
          token.Uid = uid;

          $scope.fib.db
            .ref("PushTokens")
            .child(uid)
            .set(token)
            .catch(function (err) {});
        });
        //FCMPlugin.onNotification( onNotificationCallback(data), successCallback(msg), errorCallback(err) )
        //Here you define your application behaviour based on the notification data.
        FCMPlugin.onNotification(function (data) {
          if ($scope.Notifications === null) $scope.Notifications = new Array();
          if (data.wasTapped) {
            //Notification was received on device tray and tapped by the user.
            //$scope.Notifications.push(data);
            if (data.type == "NF") {
              $scope.Notifications.NF = true;
            } else {
              if ((data.type = "NMYC")) {
                $firebaseStorage(
                  firebase
                    .storage()
                    .ref("DriverImages/" + data.SenderUid + ".jpg")
                )
                  .$getDownloadURL()
                  .then(function (url) {
                    data.pic = url;
                  });
              }
              $scope.Notifications.push(data);
            }
            $scope.$apply();
          } else {
            //Notification was received in foreground. Maybe the user needs to be notified.
            if (data.type == "NMYC") {
              $firebaseStorage(
                firebase
                  .storage()
                  .ref("DriverImages/" + data.SenderUid + ".jpg")
              )
                .$getDownloadURL()
                .then(function (url) {
                  data.pic = url;
                });
            }
            $scope.Notifications.push(data);
            if (data.type == "NF") {
              $scope.Notifications.NF = true;
            }
            $scope.$apply();
          }
        });
      };
    }
  );
