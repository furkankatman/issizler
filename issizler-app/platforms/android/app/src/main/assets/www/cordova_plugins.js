cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-fcm.FCMPlugin",
      "file": "plugins/cordova-plugin-fcm/www/FCMPlugin.js",
      "pluginId": "cordova-plugin-fcm",
      "clobbers": [
        "FCMPlugin"
      ]
    },
    {
      "id": "cordova-plugin-hms-push.HmsPush",
      "file": "plugins/cordova-plugin-hms-push/www/HmsPush.js",
      "pluginId": "cordova-plugin-hms-push",
      "clobbers": [
        "HmsPush"
      ]
    },
    {
      "id": "cordova-plugin-hms-push.HmsPushProfile",
      "file": "plugins/cordova-plugin-hms-push/www/HmsPushProfile.js",
      "pluginId": "cordova-plugin-hms-push",
      "clobbers": [
        "HmsPushProfile"
      ]
    },
    {
      "id": "cordova-plugin-hms-push.HmsPushEvent",
      "file": "plugins/cordova-plugin-hms-push/www/HmsPushEvent.js",
      "pluginId": "cordova-plugin-hms-push",
      "clobbers": [
        "HmsPushEvent"
      ]
    },
    {
      "id": "cordova-plugin-hms-push.HmsLocalNotification",
      "file": "plugins/cordova-plugin-hms-push/www/HmsLocalNotification.js",
      "pluginId": "cordova-plugin-hms-push",
      "clobbers": [
        "HmsLocalNotification"
      ]
    },
    {
      "id": "cordova-plugin-hms-push.HmsPushResultCode",
      "file": "plugins/cordova-plugin-hms-push/www/HmsPushResultCode.js",
      "pluginId": "cordova-plugin-hms-push",
      "clobbers": [
        "HmsPushResultCode"
      ]
    },
    {
      "id": "cordova-plugin-hms-push.Interfaces",
      "file": "plugins/cordova-plugin-hms-push/www/Interfaces.js",
      "pluginId": "cordova-plugin-hms-push"
    },
    {
      "id": "cordova-plugin-hms-push.CordovaRemoteMessage",
      "file": "plugins/cordova-plugin-hms-push/www/CordovaRemoteMessage.js",
      "pluginId": "cordova-plugin-hms-push"
    },
    {
      "id": "cordova-plugin-hms-push.utils",
      "file": "plugins/cordova-plugin-hms-push/www/utils.js",
      "pluginId": "cordova-plugin-hms-push"
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-browsersync-gen2": "1.1.7",
    "cordova-plugin-fcm": "2.1.2",
    "cordova-plugin-hms-push": "6.3.0-304"
  };
});