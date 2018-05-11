# Assignment 3

Simple Firebase App

## Description

The purpose of this assignment is to get a little bit
familiar with Firebase, we are now ready to use
our async knowledge to handle properly all the
Firebase events

## Set-up

1. Run `bower install `
2. Run `npm install `
3. Run `http-server docs app` to check the API


## Instructions
1. Clone this repository
2. Get your own Firebase account and replace my
   information in `app.js` with yours.
   See [Firebase Setup](https://firebase.google.com/docs/web/setup)
3. Review slides from yesterday
4. Read through this Firebase doc: [Firebase read/write](https://firebase.google.com/docs/database/web/read-and-write)
5. Go through the different TODO items in the ListController

## Details
1. The `initContoller` method will instantiate two
    listeners:
    - The first listener will only happen
    once and will initialize your messages arrays
    to the current messages in the database.
    If there are none, it will prepare the view
    to offer an nice interface
    - The second listener will listen constantly
      to Firebase and update the local array
      as new messages arrive based on a `child_added`
      event.
2. The `pushMessage` method will be in charge of pushing
    a new message to Firebase using `ref.push` Here is the format
    for the new message:
     ```
        var new_message =
            {   content:"..",
                time: firebase.database.ServerValue.TIMESTAMP,
                id:messageCounter
            };
     ```
     We will keep a messageCounter in the controller to maintain ids
     for each message (why do we need this?)
3. The `clearMessage` will clear all the message list
   from firebase using ref.set.

4. The HTML has also a few of TODOs in order to make
    the UI nice. Things like a loading circle,
    "No messages", and some filters. In particular
     we use filters to display dates, or show our
    list of messages. In terms of the message content,
    you will need to implement your own custom filter,
    which will perhaps insert a '\n' after a given number of
    words. The
    behaviour is up to you.

# Notes
- In your firebase callbacks remeber to call `$timeout`
in order to refresh the AngularJS view.
   - Why do we need this? You can try it with/without
      and ask yourself why. I will ask you this later.
```
ref.on("value",function(snap){
    $timeout(function(){
        //logic that changes the scope variables goes in here
    });
});

```

- Remember to always have a success/fail class in the firebase
  calls you make. Depending on that, handle logic
  in case of failure (Show a `ons.notification.alert` for instance)

