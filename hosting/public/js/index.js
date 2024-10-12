var app = angular.module("issizlerApp", [
  "ngMaterial",
  "ngSanitize",
  "ngLocale",
  "LocalStorageModule",
  "ui.router",
  "angular.filter",
]);

$(document).ready(function () {
  angular
    .module("issizlerApp")
    .config(function (
      localStorageServiceProvider,
      $stateProvider,
      $urlRouterProvider,
      $mdDateLocaleProvider,
      $mdThemingProvider
    ) {
      localStorageServiceProvider
        .setPrefix("issizlerApp")
        .setNotify(true, true);

      $mdThemingProvider.theme("altTheme").primaryPalette("green");
      $mdThemingProvider.setDefaultTheme("altTheme");
      // $mdDateLocaleProvider.formatDate = function(date) {
      //     return moment(date).format('DD-MM-YYYY');
      //  };
      // Example uses moment.js to parse and format dates.
      $mdDateLocaleProvider.parseDate = function (dateString) {
        var m = moment(dateString, "L", true);
        return m.isValid() ? m.toDate() : new Date(NaN);
      };

      $mdDateLocaleProvider.formatDate = function (date) {
        if (date == null) return "";
        var m = moment(date);
        return m.isValid() ? m.format("L") : "";
      };

      $urlRouterProvider.otherwise("/Home");
      // Now set up the states
      if (localStorage.getItem("issizlerApp.User") != null) {
        firebase
          .database()
          .ref("Users")
          .orderByChild("Uid")
          .equalTo(JSON.parse(localStorage.getItem("issizlerApp.User")).uid)
          .once("value")
          .then(function (snapshot) {
            snapshot.forEach((element) => {
              firebase
                .database()
                .ref("Users")
                .child(element.key)
                .update({ Status: 1 });
            });
          });
      }
      $stateProvider
        .state("Home", {
          url: "/Home",
          templateUrl: "Templates/Home.html",
        })
        .state("Profile", {
          url: "/Profile",
          templateUrl: "Templates/Profile.html",
          controller: "ProfileController",
        })
        .state("Register", {
          url: "/Register",
          templateUrl: "Templates/Register.html",
          controller: "RegisterController",
        })
        .state("WordPool", {
          url: "/WordPool",
          templateUrl: "Templates/WordPool.html",
          controller: "WordPoolController",
        })
        .state("Game", {
          url: "/Game",
          templateUrl: "Templates/Game.html",
          controller: "GameController",
        })
        .state("LeaderBoard", {
          url: "/LeaderBoard",
          templateUrl: "Templates/LeaderBoard.html",
          controller: "LeaderBoardController",
        })
        .state("FavoriteWords", {
          url: "/FavoriteWords",
          templateUrl: "Templates/FavoriteWords.html",
          controller: "FavoriteWordsController",
        })
        .state("Settings", {
          url: "/Settings",
          templateUrl: "Templates/Settings.html",
          controller: "SettingsController",
        })
        .state("StartedGames", {
          url: "/StartedGames",
          params: { game: "" },
          templateUrl: "Templates/StartedGames.html",
          controller: "StartedGamesController",
        })
        .state("Invites", {
          url: "/Invites",
          templateUrl: "Templates/Invites.html",
          controller: "InvitesController",
        });
    });
  angular.bootstrap(document.body, ["issizlerApp"]);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (localStorage.getItem("issizlerApp.User") != null) {
      firebase
        .database()
        .ref("Users")
        .orderByChild("Uid")
        .equalTo(JSON.parse(localStorage.getItem("issizlerApp.User")).uid)
        .once("value")
        .then(function (snapshot) {
          snapshot.forEach((element) => {
            firebase
              .database()
              .ref("Users")
              .child(element.key)
              .update({ Status: 0 });
          });
        });
    }
  } else {
    // Resume playing if audio was "playing on hide"
    if (localStorage.getItem("issizlerApp.User") != null) {
      firebase
        .database()
        .ref("Users")
        .orderByChild("Uid")
        .equalTo(JSON.parse(localStorage.getItem("issizlerApp.User")).uid)
        .once("value")
        .then(function (snapshot) {
          snapshot.forEach((element) => {
            firebase
              .database()
              .ref("Users")
              .child(element.key)
              .update({ Status: 1 });
          });
        });
    }
  }
});
