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

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('pause', this.onDevicePaused.bind(this), false);
        document.addEventListener('resume', this.onDeviceResumed.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        console.log("ready");
        var app = angular.module("issizlerApp", ['ngMaterial', 'ngSanitize', 'ngLocale', 'LocalStorageModule', 'ui.router', 'angular.filter']);
        app.controller("MainController", function ($scope, $mdSidenav, $mdDialog, $state, localStorageService, $log) {
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
            $scope.hobbyToEnter = { Name: "", StarCount: 1, Created: 0 };
            $scope.TodaysMessage = { Message: "", Created: 0 }
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
            $scope.IamJobless = function () {
                if ($scope.los.get("User") == null) {
                    $state.go("Register");
                }
            }
            $scope.LookingForJob = function () {
                if ($scope.los.get("User") == null) {
                    $state.go("Register");
                }
            }
            $scope.AddHobby = function () {
                if ($scope.hobbyToEnter.Name == null || $scope.hobbyToEnter.Name == "") {
                    return
                }
                var hobbiesRef = $scope.fib.db.ref("Hobbies");
                hobbiesRef.orderByChild("Name").equalTo($scope.hobbyToEnter.Name).once("value").then(function (snapshot) {
                    if (snapshot.hasChildren()) {
                        console.log("Bu hobby mevcut!!!")
                        return;
                    } else {
                        var key = $scope.fib.db.ref("Hobbies").push().key;
                        $scope.hobbyToEnter.Created = moment().valueOf()
                        var myhobby = angular.copy($scope.hobbyToEnter);
                        $scope.fib.db.ref("Hobbies").child(key).set(angular.copy($scope.hobbyToEnter)).then(function () {
                            $scope.hobbyToEnter = { Name: "", StarCount: 1 }
                            setTimeout(() => {
                                $scope.$apply()
                            }, 100);
                        });
                        var key = $scope.fib.db.ref("MyHobbies").child($scope.los.get("User").uid).push().key;
                        $scope.fib.db.ref("MyHobbies").child($scope.los.get("User").uid).child(key).set(myhobby);
                    }
                })
            }
            $scope.MeTo = function (hobby) {
                var hobbiesRef = $scope.fib.db.ref("Hobbies");
                hobbiesRef.orderByChild("Name").equalTo(hobby.Name).once("value").then(function (snapshot) {
                    snapshot.forEach(function (val) {
                        $scope.fib.db.ref('Hobbies').child(val.key).child('StarCount')
                            .set(firebase.database.ServerValue.increment(1))
                    })
                })
                var key = $scope.fib.db.ref("MyHobbies").child($scope.los.get("User").uid).push().key;
                $scope.fib.db.ref("MyHobbies").child($scope.los.get("User").uid).child(key).set(angular.copy(hobby));
            }
            $scope.AddTodaysMessage = function (msg) {
                var todaysMessageRef = $scope.fib.db.ref("TodaysMessage");
                var key = todaysMessageRef.push().key;
                $scope.TodaysMessage.Created = moment().valueOf();
                todaysMessageRef.child(key).set(angular.copy(msg)).then(function () {
                    $scope.TodaysMessage = { Message: "", Created: 0 }
                    setTimeout(() => {
                        $scope.$apply()
                    }, 100);
                })
            }
            $scope.fib.db.ref("Hobbies").on("value", function (snapshot) {
                $scope.Hobbies = [];
                snapshot.forEach(function (val) {
                    $scope.Hobbies.push(val.val())
                })
                setTimeout(() => {
                    $scope.$apply()
                }, 100);
            })
            $scope.fib.db.ref("Users").on("value", function (snapshot) {
                $scope.AppUsers = [];
                snapshot.forEach(function (val) {
                    $scope.AppUsers.push(val.val())
                })
                setTimeout(() => {
                    $scope.$apply()
                }, 100);
            })




        })
        app.controller("ProfileController", function ($scope, $mdDialog) {
            const profileRef = $scope.fib.db.ref("Users");
            $scope.isEdit = false;
            $scope.User = {};
            profileRef.orderByChild("Uid").equalTo($scope.los.get("User").uid).on("value", function (snapshot) {
                snapshot.forEach((val) => {
                    $scope.User = val.val()
                })
                setTimeout(() => {
                    $scope.$apply()
                }, 100);
            })

            $scope.UpdateProfile = function () {
                if ($scope.ProfileImageBlob != null) {
                    $scope.isUploading = true;
                    var fileName = $scope.User.Name + $scope.User.Surname
                        + "_" + moment().valueOf() + "." + $scope.ProfileImageBlob.type.substr($scope.ProfileImageBlob.type.indexOf("/") + 1)
                    const imageRef = firebase.storage().ref().child("ProfileImages").child($scope.los.get("User").uid);
                    imageRef.child(fileName).put($scope.ProfileImageBlob).then(function (snapshot) {
                        snapshot.ref.getDownloadURL().then(function (downloadURLF) {
                            $scope.User.ProfileImage = downloadURLF;
                            profileRef.orderByChild("Uid").equalTo($scope.los.get("User").uid).once("value").then(function (snapshot) {
                                console.log(snapshot.val())
                                profileRef.child(Object.keys(snapshot.val())[0]).update(angular.copy($scope.User)).then(function () {
                                    setTimeout(() => {
                                        $scope.isEdit = false;
                                        $scope.$apply();
                                    }, 100);
                                })
                            })
                        })

                    });
                }
                else {
                    profileRef.orderByChild("Uid").equalTo($scope.los.get("User").uid).once("value").then(function (snapshot) {
                        console.log(snapshot.val())
                        profileRef.child(Object.keys(snapshot.val())[0]).update(angular.copy($scope.User)).then(function () {
                            setTimeout(() => {
                                $scope.isEdit = false;
                                $scope.$apply();
                            }, 100);
                        })
                    })
                }

            }
            $scope.PickProfilePhoto = function () {

                function setOptions(srcType) {
                    var options = {
                        // Some common settings are 20, 50, and 100
                        quality: 50,
                        destinationType: Camera.DestinationType.FILE_URI,
                        // In this app, dynamically set the picture source, Camera or photo gallery
                        sourceType: srcType,
                        encodingType: Camera.EncodingType.JPEG,
                        mediaType: Camera.MediaType.PICTURE,
                        allowEdit: true,
                        correctOrientation: true  //Corrects Android orientation quirks
                    }
                    return options;
                }
                var srcType = Camera.PictureSourceType.CAMERA;
                var options = setOptions(srcType);
                function cameraSuccess(imageURI) {
                    $scope.Uploading = true;
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", imageURI);
                    xhr.responseType = "blob";
                    xhr.onload = response;
                    xhr.send();
                    $scope.$apply();
                }
                function cameraError(message) {

                }
                function response(e) {
                    var urlCreator = window.URL || window.webkitURL;
                    $scope.ProfileImagePreview = urlCreator.createObjectURL(this.response);
                    $scope.ProfileImageBlob = this.response;

                    setTimeout(() => {
                        $scope.$apply()
                    }, 100);
                }

                var confirm = $mdDialog.confirm()
                    .title('Fotoraf Seç')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .targetEvent(null)
                    .ok('Kamera')
                    .cancel('Galeri');
                $mdDialog.show(confirm).then(function () {
                    options = setOptions(navigator.camera.PictureSourceType.CAMERA)
                    navigator.camera.getPicture(cameraSuccess, cameraError, options);
                    console.log("removed", op);
                }, function () {
                    options = setOptions(navigator.camera.PictureSourceType.PHOTOLIBRARY)
                    navigator.camera.getPicture(cameraSuccess, cameraError, options);
                });

            }


        })



        app.controller("RegisterController", function ($scope, $state, $filter, $rootScope, $mdDialog) {
            $scope.User = { Register: { Enabled: false } };

            $scope.Register = function () {
                var email = $scope.User.Register.Email;
                var password = $scope.User.Register.Password;
                if (password != $scope.User.Register.PasswordRepeat) {
                    $scope.showAlert(null, "Parolalar eşleşmiyor !");
                    return
                }
                $scope.fib.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                });
            };
            $scope.Login = function () {
                var email = $scope.User.Email;
                var password = $scope.User.Password;
                $scope.fib.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                    var alert = {};
                    if (errorCode == "auth/wrong-password") {
                        alert = $mdDialog.alert({
                            title: 'Uyarı',
                            textContent: 'Email ve Şifre Eşleşmedi.',
                            ok: 'Tamam'
                        });
                    }
                    else if (errorCode == "auth/user-not-found") {
                        alert = $mdDialog.alert({
                            title: 'Uyarı',
                            textContent: 'Bu email ile kullanıcı bulunamadı.',
                            ok: 'Tamam'
                        });
                    }



                    $mdDialog
                        .show(alert)
                        .finally(function () {
                            alert = undefined;
                        });

                });
            }
            $scope.Register.ForgotPassword = false;
            $scope.ForgotPassword = function () {
                $scope.fib.auth().sendPasswordResetEmail($scope.User.Register.Email).then(function () {
                    // Email sent.
                    $scope.showAlert(null, "Parola sıfırlama emailini gönderdik.")
                    $scope.User.Register.Email = "";
                    $scope.$apply();
                }).catch(function (error) {
                    // An error happened.
                    $scope.showAlert(null, "Parola sıfırlama emailini gönderirken bir hata ile karşılaşıldı." + error)
                    $scope.User.Register.Email = "";
                    $scope.$apply();

                });
            }
            $scope.fib.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    var displayName = user.displayName;
                    var email = user.email;
                    var emailVerified = user.emailVerified;
                    var photoURL = user.photoURL;
                    var isAnonymous = user.isAnonymous;
                    var uid = user.uid;
                    var providerData = user.providerData;
                    console.log("innn", user);
                    $scope.los.set("User", user);
                    const ProfileRef = $scope.fib.db.ref("Users");

                    ProfileRef.orderByChild("Uid").equalTo(uid).once("value").then(function (snapshot) {
                        if (snapshot.hasChildren() == false) {
                            var key = ProfileRef.push().key;
                            ProfileRef.child(key).set({ Email: user.email, Uid: uid, Created: moment().valueOf() });
                        }
                    })
                    if ($scope.fib.auth().currentUser.emailVerified == false) {
                        $scope.fib.auth().currentUser.sendEmailVerification()
                            .then(function () {
                                // Verification email sent.
                                var alert = $mdDialog.alert({
                                    title: 'Uyarı',
                                    textContent: 'Email\'inize hesabınızı aktifleştireceğiniz bir email gönderdik.Linke tıklayarak hesabınızı aktifleştirebilirsiniz.',
                                    ok: 'Tamam'
                                });

                                $mdDialog
                                    .show(alert)
                                    .finally(function () {
                                        alert = undefined;
                                    });

                            })
                            .catch(function (error) {
                                // Error occurred. Inspect error.code.
                                var alert = {}
                                if (error.errorCode == "auth/too-many-requests") {
                                    alert = $mdDialog.alert({
                                        title: 'Uyarı',
                                        textContent: "Çok fazla yanlış deneme yaptınız. Bir süre sonra tekrar deneyiniz.",
                                        ok: 'Tamam'
                                    });
                                }
                                else {
                                    return
                                }
                                $mdDialog
                                    .show(alert)
                                    .finally(function () {
                                        alert = undefined;
                                    });
                                console.log(error);
                            });
                    }

                    $scope.$apply();
                    $state.go("Home");
                    // ...
                } else {
                    // User is signed out.
                    // ...
                    console.log("signedOut");
                    $scope.los.set("User", null);
                    $scope.$apply();
                    $state.go("Register");
                }
                //$scope.$apply();
                //if ($scope.fib.auth().currentUser) {
                //    $scope.state.go("Home");
                //}
            });
            $scope.showAlert = function (ev, message) {
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application
                // to prevent interaction outside of dialog
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document))
                        .clickOutsideToClose(true)
                        .title("Uyarı.")
                        .textContent(message)
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Tamam!')
                        .targetEvent(ev)
                );
            };
        })

        app.config(function (localStorageServiceProvider, $stateProvider, $urlRouterProvider,
            $mdDateLocaleProvider, $mdThemingProvider) {
            localStorageServiceProvider
                .setPrefix('issizler')
                .setNotify(true, true);

            $mdThemingProvider.theme('altTheme')
                .primaryPalette('pink')
            $mdThemingProvider.setDefaultTheme('altTheme');
            // $mdDateLocaleProvider.formatDate = function(date) {
            //     return moment(date).format('DD-MM-YYYY');
            //  };
            // Example uses moment.js to parse and format dates.
            $mdDateLocaleProvider.parseDate = function (dateString) {
                var m = moment(dateString, 'L', true);
                return m.isValid() ? m.toDate() : new Date(NaN);
            };

            $mdDateLocaleProvider.formatDate = function (date) {
                if (date == null)
                    return "";
                var m = moment(date);
                return m.isValid() ? m.format('L') : '';
            };


            $urlRouterProvider.otherwise("/Home");
            // Now set up the states

            $stateProvider.state("Home", {
                url: "/Home",
                templateUrl: "Templates/Home.html"
            })
                .state("Profile", {
                    url: "/Profile",
                    templateUrl: "Templates/Profile.html",
                    controller: "ProfileController"
                })
                .state("Register", {
                    url: "/Register",
                    templateUrl: "Templates/Register.html",
                    controller: "RegisterController"
                });
        })




        angular.bootstrap(document.body, ["issizlerApp"]);
    },
    onDevicePaused: function () {
        console.log("paused")
    }
    ,
    onDeviceResumed: function () {
        console.log("resumed")
    }


};

app.initialize();