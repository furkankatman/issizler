cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-fcm/www/FCMPlugin.js",
        "id": "cordova-plugin-fcm.FCMPlugin",
        "pluginId": "cordova-plugin-fcm",
        "clobbers": [
            "FCMPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-hms-push/www/HmsPush.js",
        "id": "cordova-plugin-hms-push.HmsPush",
        "pluginId": "cordova-plugin-hms-push",
        "clobbers": [
            "HmsPush"
        ]
    },
    {
        "file": "plugins/cordova-plugin-hms-push/www/HmsPushProfile.js",
        "id": "cordova-plugin-hms-push.HmsPushProfile",
        "pluginId": "cordova-plugin-hms-push",
        "clobbers": [
            "HmsPushProfile"
        ]
    },
    {
        "file": "plugins/cordova-plugin-hms-push/www/HmsPushEvent.js",
        "id": "cordova-plugin-hms-push.HmsPushEvent",
        "pluginId": "cordova-plugin-hms-push",
        "clobbers": [
            "HmsPushEvent"
        ]
    },
    {
        "file": "plugins/cordova-plugin-hms-push/www/HmsLocalNotification.js",
        "id": "cordova-plugin-hms-push.HmsLocalNotification",
        "pluginId": "cordova-plugin-hms-push",
        "clobbers": [
            "HmsLocalNotification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-hms-push/www/HmsPushResultCode.js",
        "id": "cordova-plugin-hms-push.HmsPushResultCode",
        "pluginId": "cordova-plugin-hms-push",
        "clobbers": [
            "HmsPushResultCode"
        ]
    },
    {
        "file": "plugins/cordova-plugin-hms-push/www/Interfaces.js",
        "id": "cordova-plugin-hms-push.Interfaces",
        "pluginId": "cordova-plugin-hms-push"
    },
    {
        "file": "plugins/cordova-plugin-hms-push/www/CordovaRemoteMessage.js",
        "id": "cordova-plugin-hms-push.CordovaRemoteMessage",
        "pluginId": "cordova-plugin-hms-push"
    },
    {
        "file": "plugins/cordova-plugin-hms-push/www/utils.js",
        "id": "cordova-plugin-hms-push.utils",
        "pluginId": "cordova-plugin-hms-push"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-browsersync-gen2": "1.1.7",
    "cordova-plugin-fcm": "2.1.2",
    "cordova-plugin-hms-push": "6.3.0-304"
}
// BOTTOM OF METADATA
});