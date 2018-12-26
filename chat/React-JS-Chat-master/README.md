# React-JS-Chat
React JS Chat Compoment

### Usage

Clone this github repo go to React-JS-Chat folder run npm install and npm start command.

### Overview         

Open source Chat and Messaging SDK that lets you add real time chat and messaging in your mobile (android, iOS) applications and website.

Signup at [https://www.applozic.com/signup.html](https://www.applozic.com/signup.html?utm_source=github&utm_medium=readme&utm_campaign=web) to get the application key.

Documentation: [Applozic Web (Javascript) Chat & Messaging Plugin Documentation](https://docs.applozic.com/docs/web-javascript-chat-plugin)

You can modify css and js files based on your design, files are present under /React-JS-Chat/public/applozic/css/app/fullview  and /React-JS-Chat/public/applozic/js/app/fullview folder .
<img align="middle" src="https://raw.githubusercontent.com/AppLozic/React-JS-Chat/master/public/applozic/images/react-chat.png" />

#### Applozic One to One and Group Chat SDK

##### Features:

 One to one and Group Chat
 
 Image capture
 
 Photo sharing
 
 File attachment
 
 Location sharing
 
 Push notifications
 
 In-App notifications
 
 Online presence
 
 Last seen at 
 
 Unread message count
 
 Typing indicator
 
 Message sent, delivery report
 
 Offline messaging
 
 Multi Device sync
 
 Application to user messaging
 
 Customized chat bubble
 
 UI Customization Toolkit
 
 Cross Platform Support (iOS, Android & Web)


 

 ### To Integrate Applozic Chat in Your Project

 1. Add applozic folder(/React-JS-Chat/public/applozic)in public folder of your project.
 2. Copy applozic.html (/React-JS-Chat/public/applozic) code and add it to your header or footer(Which is common to all your code).
 3. Call Following script in your login success
 ```
  <script type="text/javascript">
  window.applozic.init({
    appId: applozicApplicationKey,      //Get your application key from https://www.applozic.com
    userId: userId,                     //Logged in user's id, a unique identifier for user
    userName: username,                 //User's display name
    imageLink : '',                     //User's profile picture url
    email : '',                         //optional
    contactNumber: '',                  //optional, pass with internationl code eg: +13109097458
    desktopNotification: true,
    source: '1',                          // optional, WEB(1),DESKTOP_BROWSER(5), MOBILE_BROWSER(6)
    notificationIconLink: 'https://www.applozic.com/favicon.ico',    //Icon to show in desktop notification, replace with your icon
    authenticationTypeId: 1,          //1 for password verification from Applozic server and 0 for access Token verification from your server
    accessToken: '',                    //optional, leave it blank for testing purpose, read this if you want to add additional security by verifying password from your server https://www.applozic.com/docs/configuration.html#access-token-url
    locShare: true,
    googleApiKey: "AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4",   // your project google api key 
    googleMapScriptLoaded : false,   // true if your app already loaded google maps script
    mapStaticAPIkey: "AIzaSyCWRScTDtbt8tlXDr6hiceCsU83aS2UuZw",
    autoTypeSearchEnabled : true,     // set to false if you don't want to allow sending message to user who is not in the contact list
    loadOwnContacts : false, //set to true if you want to populate your own contact list (see Step 4 for reference)
    olStatus: false,         //set to true for displaying a green dot in chat screen for users who are online
    onInit : function(response) {
       if (response === "success") {
          // login successful, perform your actions if any, for example: load contacts, getting unread message count, etc
       } else {
          // error in user login/register (you can hide chat button or refresh page)
       }
   },
   contactDisplayName: function(otherUserId) {
         //return the display name of the user from your application code based on userId.
         return "";
   },
   contactDisplayImage: function(otherUserId) {
         //return the display image url of the user from your application code based on userId.
         return "";
   },
   onTabClicked: function(response) {
         // write your logic to execute task on tab load
         //   object response =  {
         //    tabId : userId or groupId,
         //    isGroup : 'tab is group or not'
         //  }
   }
  });
</script>

```

 


