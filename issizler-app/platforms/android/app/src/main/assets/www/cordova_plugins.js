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
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-browsersync-gen2": "1.1.7",
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-fcm": "2.1.2",
    "cordova-plugin-vibration": "3.1.1",
    "cordova-plugin-device": "3.0.0"
  };
});