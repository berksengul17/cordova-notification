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

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("WINDOW:", window);

  if (typeof device !== "undefined") {
    try {
      // Check if permission is granted if not ask for permission
      // and set up firebase if granted
      // look for alternative solutions
      window.FirebasePlugin.hasPermission((hasPermission) => {
        if (hasPermission) {
          firebaseSetup();
        } else {
          window.FirebasePlugin.grantPermission((hasPermission) => {
            console.log(
              "Permission was " + (hasPermission ? "granted" : "denied")
            );
            if (hasPermission) {
              firebaseSetup();
            }
          });
        }
      });
    } catch (e) {
      console.error("FirebasePlugin grantPermission error", e);
    }
  }
  document.getElementById("deviceready").classList.add("ready");
}

function firebaseSetup() {
  const isOniOS =
    typeof device !== "undefined" &&
    !!device.platform &&
    device.platform.toUpperCase() === "IOS";

  // We use FCM only for Android. For iOS - we use plain APNS
  if (!isOniOS) {
    window.FirebasePlugin.getToken(
      (fcmToken) => {
        console.log("TOKEN:", fcmToken);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // To show a system notification put a
  // notification_foreground key in your data section
  // like {"notification_foreground" : "true"}
  window.FirebasePlugin.onMessageReceived(
    (message) => {
      console.log(message);
    },
    (error) => {
      console.error(error);
    }
  );
}
