angular
  .module("issizlerApp")
  .controller(
    "RegisterController",
    function ($scope, $state, $filter, $rootScope, $mdDialog) {
      $scope.User = { Register: { Enabled: false } };

      $scope.Register = function () {
        var email = $scope.User.Register.Email;
        var password = $scope.User.Register.Password;
        if (password != $scope.User.Register.PasswordRepeat) {
          $scope.showAlert(null, "Parolalar eşleşmiyor !");
          return;
        }
        $scope.fib
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
      };
      $scope.Login = function () {
        var email = $scope.User.Email;
        var password = $scope.User.Password;
        $scope.fib
          .auth()
          .signInWithEmailAndPassword(email, password)
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            var alert = {};
            if (errorCode == "auth/wrong-password") {
              alert = $mdDialog.alert({
                title: "Uyarı",
                textContent: "Email ve Şifre Eşleşmedi.",
                ok: "Tamam",
              });
            } else if (errorCode == "auth/user-not-found") {
              alert = $mdDialog.alert({
                title: "Uyarı",
                textContent: "Bu email ile kullanıcı bulunamadı.",
                ok: "Tamam",
              });
            }

            $mdDialog.show(alert).finally(function () {
              alert = undefined;
            });
          });
      };
      $scope.Register.ForgotPassword = false;
      $scope.ForgotPassword = function () {
        $scope.fib
          .auth()
          .sendPasswordResetEmail($scope.User.Register.Email)
          .then(function () {
            // Email sent.
            $scope.showAlert(null, "Parola sıfırlama emailini gönderdik.");
            $scope.User.Register.Email = "";
            $scope.$apply();
          })
          .catch(function (error) {
            // An error happened.
            $scope.showAlert(
              null,
              "Parola sıfırlama emailini gönderirken bir hata ile karşılaşıldı." +
                error
            );
            $scope.User.Register.Email = "";
            $scope.$apply();
          });
      };
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

          ProfileRef.orderByChild("Uid")
            .equalTo(uid)
            .once("value")
            .then(function (snapshot) {
              if (snapshot.hasChildren() == false) {
                var key = ProfileRef.push().key;
                ProfileRef.child(key).set({
                  Email: user.email,
                  Uid: uid,
                  Created: moment().valueOf(),
                });
              }
            });
          if ($scope.fib.auth().currentUser.emailVerified == false) {
            $scope.fib
              .auth()
              .currentUser.sendEmailVerification()
              .then(function () {
                // Verification email sent.
                var alert = $mdDialog.alert({
                  title: "Uyarı",
                  textContent:
                    "Email'inize hesabınızı aktifleştireceğiniz bir email gönderdik.Linke tıklayarak hesabınızı aktifleştirebilirsiniz.",
                  ok: "Tamam",
                });

                $mdDialog.show(alert).finally(function () {
                  alert = undefined;
                });
              })
              .catch(function (error) {
                // Error occurred. Inspect error.code.
                var alert = {};
                if (error.errorCode == "auth/too-many-requests") {
                  alert = $mdDialog.alert({
                    title: "Uyarı",
                    textContent:
                      "Çok fazla yanlış deneme yaptınız. Bir süre sonra tekrar deneyiniz.",
                    ok: "Tamam",
                  });
                } else {
                  return;
                }
                $mdDialog.show(alert).finally(function () {
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
          localStorage.clear();
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
          $mdDialog
            .alert()
            .parent(angular.element(document))
            .clickOutsideToClose(true)
            .title("Uyarı.")
            .textContent(message)
            .ariaLabel("Alert Dialog Demo")
            .ok("Tamam!")
            .targetEvent(ev)
        );
      };
    }
  );
