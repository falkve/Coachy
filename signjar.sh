#!/usr/bin/env bash
rm -rf /data/WS_FSI/Coachy/platforms/android/build/outputs/apk/*.*
rm coachy.apk
#ionic run android --prod
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore coachykey.keystore /data/WS_FSI/Coachy/platforms/android/build/outputs/apk/android-release-unsigned.apk coachy
~/Android/Sdk/build-tools/25.0.2/zipalign -v 4 /data/WS_FSI/Coachy/platforms/android/build/outputs/apk/android-release-unsigned.apk coachy.apk
