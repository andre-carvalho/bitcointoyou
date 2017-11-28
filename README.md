# bitcointoyou
The project goal is provide an android app to follow price of Bitcoin in BitcoinToYou trader.

Because my programming backgroud is to the web, more specifically in JavaScript, i choose the Meteor to provide an environment to develop in JavaScript and compile to Android platform.

## Prepare the environment for develop

Follow the basic instructions to make the base of this project.

Basic steps:
```
 curl https://install.meteor.com/ | sh
 meteor create ~/bitcointoyou
 meteor 
 meteor add http
```
https://www.meteor.com/install

When notification was included, we need to install a cordova plugin and update in all.
```
meteor add cordova:org.apache.cordova.dialogs@0.2.10
meteor update
```

## Build and test in Android device

Is pre required to install Android SDK and related tools

```
meteor add-platform android
meteor run android-device
```

## Debug on PC

Simple run on the command line:
```
meteor
```
