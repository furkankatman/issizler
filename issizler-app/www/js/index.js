/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
angular.module("issizlerApp", [
  "ngMaterial",
  "ngSanitize",
  "ngLocale",
  "LocalStorageModule",
  "ui.router",
  "angular.filter",
]);
var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
    document.addEventListener("pause", this.onDevicePaused.bind(this), false);
    document.addEventListener("resume", this.onDeviceResumed.bind(this), false);
    document.addEventListener(
      "menubutton",
      this.onMenuKeyDown.bind(this),
      false
    );
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    console.log("ready");

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
  },
  onDevicePaused: function () {
    console.log("paused");
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
  },
  onDeviceResumed: function () {
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
  },
  onMenuKeyDown: function () {
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
  },
};

app.initialize();
