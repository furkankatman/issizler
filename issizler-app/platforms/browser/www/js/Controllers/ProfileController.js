angular
  .module("issizlerApp")
  .controller("ProfileController", function ($scope, $mdDialog) {
    const profileRef = $scope.fib.db.ref("Users");
    const wordPoolRef = $scope.fib.db.ref("WordPool");
    $scope.isEdit = false;
    $scope.User = {};
    if (window.device && window.device.platform != "browser")
      $scope.getToken_x($scope.los.get("User").uid);
    profileRef
      .orderByChild("Uid")
      .equalTo($scope.los.get("User").uid)
      .on("value", function (snapshot) {
        snapshot.forEach((val) => {
          $scope.User = val.val();
        });
        setTimeout(() => {
          $scope.$apply();
        }, 100);
      });
    if (!window.device) {
      $scope.copyToClipboard = async function (x) {
        await navigator.clipboard.writeText(x);
      };
    } else {
      $scope.copyToClipboard = function (x) {
        cordova.plugins.clipboard.copy(x);
      };
    }

    $scope.UpdateProfile = function () {
      if ($scope.ProfileImageBlob != null) {
        $scope.isUploading = true;
        var fileName =
          $scope.User.Name +
          $scope.User.Surname +
          "_" +
          moment().valueOf() +
          "." +
          $scope.ProfileImageBlob.type.substr(
            $scope.ProfileImageBlob.type.indexOf("/") + 1
          );
        const imageRef = firebase
          .storage()
          .ref()
          .child("ProfileImages")
          .child($scope.los.get("User").uid);
        imageRef
          .child(fileName)
          .put($scope.ProfileImageBlob)
          .then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(function (downloadURLF) {
              $scope.User.ProfileImage = downloadURLF;
              firebase
                .auth()
                .currentUser.updateProfile({ photoURL: downloadURLF })
                .then(() => {
                  $scope.los.set("User", firebase.auth().currentUser);
                  wordPoolRef
                    .orderByChild("CreatedByEmail")
                    .equalTo($scope.los.get("User").email)
                    .once("value", function (snapshot) {
                      snapshot.forEach((val) => {
                        console.log(val.val());
                        const u = val.val();
                        u.CreatedByUsername = $scope.User.Username;
                        u.CreatedByPhoto = downloadURLF;
                        wordPoolRef.child(val.key).set(u);
                      });
                    });
                });
              profileRef
                .orderByChild("Uid")
                .equalTo($scope.los.get("User").uid)
                .once("value")
                .then(function (snapshot) {
                  console.log(snapshot.val());
                  profileRef
                    .child(Object.keys(snapshot.val())[0])
                    .update(angular.copy($scope.User))
                    .then(function () {
                      setTimeout(() => {
                        $scope.isEdit = false;
                        $scope.$apply();
                      }, 100);
                    });
                });
            });
          });
      } else {
        profileRef
          .orderByChild("Uid")
          .equalTo($scope.los.get("User").uid)
          .once("value")
          .then(function (snapshot) {
            console.log(snapshot.val());
            profileRef
              .child(Object.keys(snapshot.val())[0])
              .update(angular.copy($scope.User))
              .then(function () {
                setTimeout(() => {
                  $scope.isEdit = false;
                  wordPoolRef
                    .orderByChild("CreatedByEmail")
                    .equalTo($scope.los.get("User").email)
                    .once("value", function (snapshot) {
                      snapshot.forEach((val) => {
                        console.log(val.val());
                        const u = val.val();
                        u.CreatedByUsername = $scope.User.Username;
                        wordPoolRef.child(val.key).set(u);
                      });
                    });

                  $scope.$apply();
                }, 100);
              });
          });
      }
      firebase
        .auth()
        .currentUser.updateProfile({ displayName: $scope.User.Username })
        .then(() => {
          $scope.los.set("User", firebase.auth().currentUser);
        });
    };
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
          correctOrientation: true, //Corrects Android orientation quirks
        };
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
      function cameraError(message) {}
      function response(e) {
        var urlCreator = window.URL || window.webkitURL;
        $scope.ProfileImagePreview = urlCreator.createObjectURL(this.response);
        $scope.ProfileImageBlob = this.response;

        setTimeout(() => {
          $scope.$apply();
        }, 100);
      }

      var confirm = $mdDialog
        .confirm()
        .title("Fotoraf Seç")
        .textContent("")
        .ariaLabel("Lucky day")
        .targetEvent(null)
        .ok("Kamera")
        .cancel("Galeri");
      $mdDialog.show(confirm).then(
        function () {
          options = setOptions(navigator.camera.PictureSourceType.CAMERA);
          navigator.camera.getPicture(cameraSuccess, cameraError, options);
          console.log("removed", op);
        },
        function () {
          options = setOptions(navigator.camera.PictureSourceType.PHOTOLIBRARY);
          navigator.camera.getPicture(cameraSuccess, cameraError, options);
        }
      );
    };
  });
