cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-fcm.FCMPlugin",
      "file": "plugins/cordova-plugin-fcm/www/FCMPlugin.js",
      "pluginId": "cordova-plugin-fcm",
      "clobbers": [
        "FCMPlugin"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-browsersync-gen2": "1.1.7",
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-fcm": "2.1.2"
  };
});