angular
  .module("issizlerApp")
  .controller(
    "MainController",
    function (
      $scope,
      $q,
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
          $scope.Words.push(element.val());
        });
        setTimeout(() => {
          $scope.$apply();
        }, 100);
      });
      $scope.Score = { TotalScore: 0 };

      $scope.SetScoreBoards = function () {
        $scope.Score.ScoreBoards = [];
        const scoreBoardRef = $scope.fib.db.ref("ScoreBoard");
        scoreBoardRef.on("value", function (snapshot) {
          $scope.Score.ScoreBoards = [];
          snapshot.forEach(function (val) {
            $scope.Score.ScoreBoards.push(val.val());
          });
        });

        $scope.Score.ScoreHistories = [];
        const scoreHistoryRef = $scope.fib.db.ref("ScoreHistory");
        scoreHistoryRef.on("value", function (snapshot) {
          $scope.Score.ScoreHistories = [];
          $scope.Score.TotalScore = 0;
          snapshot.forEach(function (val) {
            $scope.Score.ScoreHistories.push(val.val());
            $scope.Score.TotalScore = $scope.Score.TotalScore + val.val().Score;
          });
        });
      };
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
    }
  );
