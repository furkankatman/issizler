angular.module("issizlerApp").controller("MainController", function ($scope, $q, $mdSidenav, $mdDialog, $state, localStorageService, $log, $timeout) {
    $scope.Hello = "Hello";
    /*
  SideNav 
  */
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function () {
        return $mdSidenav('right').isOpen();
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
        $mdSidenav('right').close()
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
        $scope.fib.auth().signOut().then(function () {
            console.log('Signed Out');
            $scope.los.set("User", null);
            $scope.$apply();
        }, function (error) {
            console.error('Sign Out Error', error);
        });
        $state.go("Home");
    }
   
    $scope.fib.db.ref("Users").on("value", function (snapshot) {
        $scope.AppUsers = [];
        snapshot.forEach(function (val) {
            $scope.AppUsers.push(val.val())
        })
        setTimeout(() => {
            $scope.$apply()
        }, 100);
    })
 
    $scope.onSwipeLeft = function (ev, target) {
        console.log(ev);
        console.log(target);

    }

    // $.getJSON("http://localhost:3000/browser/www/scripts/bolumler.json", function (json) {
    //     $scope.Departments = json; // this will show the info it in firebug console
    // });


})