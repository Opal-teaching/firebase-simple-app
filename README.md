# *** MOVED TO GITLAB ***

# Simple Firebase App

## Description

The purpose of this assignment is to get you a bit more familiar with Firebase.
You'll have a chance to use your new knowledge of asynchronicity to properly handle 
Firebase events.

## Background

To help you follow this assignment, you should first have received an introduction to Firebase.

## Resources

Please read the resource below before starting.

- [Firebase Read/Write](https://firebase.google.com/docs/database/web/read-and-write).

## Mini Firebase Tutorial

Firebase is described as a no-SQL real-time database. Its structure is based on key/value pairs that ressemble JSON syntax, 
e.g.:
```
{
    "users": {
        "0": {
            "firstname": "David",
            "lastname": "Herrera",
            "conversations": {
                "0": true
            }
        }
    },
    "conversations": {
        "0": {
            "members":{
                ...
            }
        }
    }
}
```

### Firebase References
A Firebase database is always accessed via Firebase references. References are 'pointers' to paths in the Firebase sub-tree.
They are specified relative to the root of the Firebase DB.
A read/write event happens relative to a reference, at the place the reference points to.
For example, consider the following:
```
{
    "subtree0": {
        "subtree1": {
            "userId": "0",
            "firstname": "David",
            "lastname": "Herrera",
            "conversations": {
                "0": true
            }
        }
    }
}
```
Assume this object represents our entire database. In order to reference the root we would call:
```
firebase.database().ref();
```
To reference "subtree0", we would create a references as follows:
```
firebase.database().ref("subtree0");
```
To reference "conversations", we could do:
```
firebase.database().ref("subtree0/subtree1/conversations");
// or
let ref = firebase.database().ref();
ref.child("subtree0/subtree1/conversations");
// or
let ref = firebase.database().ref();
ref.child("subtree0").child("subtree1").child("conversations");
```
Notice that we can also use the `child()` function to reach deeper into our tree.
To add a reference to a new conversation for this user, we could use something like:
```
let ref = firebase.database().ref();
ref.child("subtree0/subtree1/conversations").update({"1": true})
    .then(...)
    .catch(...);
```
Where "1" stands for the new conversation added under that sub-tree.
We'll get more into the details of reading and writing in the next section.

### Database Reading/Writing

#### Writing
To write to the database, we have three main functions we can call on a reference:
`ref.update()`, `ref.set()` and `ref.push()`. Let's first see the difference between `ref.update()` and `ref.set()`.
Consider the following sub-tree:
```
{
    "firstname": "David"
}
```
Let's now write to this reference/sub-tree (assuming that it's the root) using `set` and `update`.
```
 firebase.database().ref().set({"lastname":"Herrera"});
 firebase.database().ref().update({"lastname":"Herrera"});
 
// Result for set
{
    "lastname": "Herrera"
}
// Result for update
{
    "firstname": "David",
    "lastname": "Herrera"
}
```
`ref.set()` overwrites the sub-tree, while `ref.update()` adds a new key/value pair, or modifies the value of an existing key.

To delete from a subtree/reference, do the following:
```
firebase.database().ref().set(null);
```

`ref.push()` can also be used to write to a Firebase database. `push` creates a random key at the given reference, and writes 
the provided parameter as the value under this new key.

For example:
```
// Original
{
    "firstname": "David"
}

let ref = firebase.database().ref();
ref.push({"lastname": "Herrera"})

// Result
{
    "firstname": "David"
    "asdjlkA_+asda=asfasdf^&": {
        "lastname": "Herrera"
    }
}
```
Here, the string `asdjlkA_+asda=asfasdf^&` is a randomly generated key from Firebase. To obtain this key before or after pushing, 
we use:
```
let ref = firebase.database().ref();

// After pushing
let key = ref.push({"lastname": "Herrera"}).key;

// Before pushing
let key = ref.push().key;
let obj = {};
obj[key] = {"lastname":"Herrera"};
ref.update(obj);
```
The use of both is common and depends on the target application.

#### Reading

Reading is where the real-time aspect of the database becomes important.
To read, we use two types of listeners:
- `on`:   Useful when we want to maintain a real-time connection with
          the database and constantly listen for changes--for instance, listening
          to new users coming online, or listening for new incoming messages in a conversation.
- `once`: Useful when we're interested in checking the existence
          of an object at a given path. It can also be used to instantiate
          an application by getting a snapshot of the database contents.
          In the context of Opal, `once` is used to listen for a response to
          a request sent to the back-end. For each sent request, a single response is expected,
          and can be read once.

For these two types of listeners, there are five types of events.
- `value`:         Listens to any change to the reference. When it detects
                   a change, it sends the entire sub-tree under the reference
                   to the callback.
- `child_added`:   Only detects and fires when a child is added
                   under the referenced sub-tree. At the initial call,
                   it returns each child sub-tree one-by-one to the callback.
- `child_changed`: Only detects and fires when a child in the sub-tree is changed
                   (any nested child under the sub-tree). At the initial call,
                   it does nothing. When it detects a change, it only
                   returns the immediate child of the reference whose
                   sub-tree had the change.
- `child_removed`: Only detects and fires when a child in the sub-tree is removed
                   (any nested child under the sub-tree). At the initial call,
                   it does nothing. When it fires, it returns the removed subtree.
- `child_moved`:   Only detects and fires when a child in the sub-tree is changed and
                   at a basic level it only works with lists, (keys are numbers).

You can read more about data retrieval here: [Retrieving Data](https://firebase.google.com/docs/database/admin/retrieve-data).

The general structure for reading is the following:
```
let ref = firebase.database().ref();
ref.<type-of-listener>("<type-of-event>",(snap)=>{
    if(snap.exists())
    {
        console.log(snap.key, snap.val());
    }
});
```
Any time the event triggers, this callback, whose parameters is `snap`,
is called. Here, `snap` stands for a snapshot of the DB.
We use `snap.exists()` to check if there is data under that sub-tree.
Events like `value` will give a `null` snapshot call if the sub-tree is empty.
`snap.key` returns the key of the sub-tree, while `snap.val()` returns the
value.

Here are some examples of events. Consider the following sub-tree:
```
{
   "0": {
       "firstname": "David",
       "conversations": {
           "0":true,
           "1":true
        }
    }
}

// Value
ref.on("value",(snap)=>{
    console.log(snap.key, snap.val());
});

// Prints 0, {
                 "firstname": "David"
                 "conversations": {
                     "0":true,
                     "1":true
                 }
             }
// and the entire sub-tree anytime something is modified.

```

### Database Structuring

The consequences of the JSON-like structure lead to a __non-normalized__ database,
whereby, in order to query efficiently, in terms of both time and space,
it is actually beneficial to have data redundancy (same data, multiple places).
As an example, let's think about a messaging app. An easy structure would
be to have:
```
{
    "users": {
        "0": {
            "userId": "0",
            "firstname": "David",
            "lastname": "Herrera",
            "conversations": {
                "0": {
                    "convId": "0",
                    "lastMessage": {
                        ...
                    },
                    "members": {
                        ...
                    }
                }
            }
        }
    }
}
```
This of course breaks down quickly for two reasons. First, when we create a new conversation, 
we need to create a conversation object for each of the users involved in the conversation. 
This would in turn get overly complex, as perhaps we would like to update fields of the conversation.
This would imply we first need to know where they are, which we normally don't, since Firebase doesn't offer 
sophisticated queries that would allow us to find out, and second, we would need to update several references 
with the same information, once for each user of the conversation.

A second argument against such a structure (if the one above one wasn't enough) is that any time we want to check 
a user's information, we need to download the entire sub-tree, even if we're only interested in the
user's profile and not in all their conversations.

Firebase instead favours a more "flattened" database structure, whereby we keep indices in certain sub-trees 
depending on how we want to navigate through sub-trees in our application. In this case, we have two modules, 
users and conversations. In this two-way relationship, the only source of redundancy in terms of space is the fact that
a conversation keeps a list of its members, and a given member keeps track of their conversations. 
In this case, this redundancy is necessary, as sometimes we need conversations based on a user, and sometimes we need
to know which users take part of a conversation.

Note that this structure, however, also has its downsides.
For instance, coming back to our schema, we have:
```
{
    "users": {
        "0": {
            "firstname": "David",
            "lastname": "Herrera",
            "conversations": {
                "0":true,
                "1":true
            }
        }
    },
    "conversations": {
        "0": {
            ...
        },
        "1": {
            ...
        }
    }
}
```
We have a user whose `conversations` child holds all the keys for the user's conversations.
Given a user, how can we grab all of their actual conversations based on just
the conversation keys? How can we listen to changes in each of those
conversations?

Firebase, unfortunately, does not offer such string querying capabilities. 
Its querying capabilities are specific to a given reference sub-tree. In this case, we run into the problem
of either tracking, extracting, and listening to all the conversations, irrespective of whether they are our user's
conversations, or creating a reference to each correct conversation and instantiating a listener for each. The latter is
preferable over the former, as it scales better. The only worry then becomes clearing all those listeners upon
exit, which is why we have:
```
$scope.$on("$destroy",()=>{
    ref.off()
});
```
If we were to forget this step, we would have a listener leak. This is because event listeners are not destroyed 
unless specifically instructed.

### Empty Values

An interesting (and sometimes annoying) feature of Firebase is that Firebase won't store a key without a concrete value.
In particular, Firebase considers an empty array to be an empty value, and quietly won't store the array or its key, 
which is a common source of errors.

You can read more on this topic here: 
[Arrays in Firebase](https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html).

## Instructions

1. Clone this repository.

2. Run `npm install`.

3. Run `npm run start`.
   <br><br>
   You should get one error in the console: `Can't determine Firebase Database URL.` This is normal.
   
4. Log into the [Firebase console](https://console.firebase.google.com/) using your Google account (you'll need to sign up if 
   you don't have one). Open the following setup guide: [Firebase Setup](https://firebase.google.com/docs/web/setup), and follow 
   steps 1 and 2 (but don't set up Firebase Hosting). Skip the first half of step 3 and go directly to the sub-step 
   `Learn about the Firebase config object`. Find and copy the inner values of your Firebase's firebaseConfig object.

5. Open `src/js/app.js` in your cloned project. Paste the firebaseConfig attributes that you copied into the object of the 
   same name. Save the file to force webpack to reload, then check the console in your browser. 
   You shouldn't see any more errors (only warnings).
   
6. In the Firebase console for your project, click on "Realtime Database" in the left windowpane, and follow the instructions to 
   enable the database. Afterwards, edit the ‘Rules’ tab of the DB to allow unrestricted access, as depicted below 
   (if you prefer to set stricter rules, refer to the Additional Details section below).
   ```
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

7. Review the presentation slides on Firebase, and read the Firebase doc linked in the Resources section above.

8. Follow all the TODOs in `listController.js` and `list.html`.

## Additional Details

1.  The `activate` method will instantiate two listeners:
    - The first listener will only be triggered once and will initialize your messages array
      with the current messages in the database.
    - The second listener will listen constantly to Firebase and update the local array
      as new messages arrive based on a `child_added` event.
    <br><br>
    Pay attention to the behaviour of the second listener. Does it return the initial values 
    (the same way as the first listener)? If yes, remove the redundant listener; if not, keep both.
    
2.  The `pushMessage` method will be in charge of pushing new messages to Firebase using `ref.push` Here is the format
    for a new message:
    ```
    var new_message = {
        content: "...",
        time: firebase.database.ServerValue.TIMESTAMP,
        id: messageCounter
    };
    ```
    We will keep a messageCounter in the controller to maintain IDs for each message.

3.  The `clearMessage` method will clear the entire message list from Firebase using `.set`.

4. The HTML file also has a few of TODOs in order to make the UI nice. There are things like a loading circle,
   a "No messages" label, and some filters. In particular, we use filters to display dates, or to format the
   list of messages. In terms of the message content, you will need to implement a custom filter,
   which could, for example, insert a '\n' after a given number of characters. The behaviour is up to you.
   
5. If you'd like to experiment with setting stricter Firebase rules, you can do so by modifying them in 
   your project's Firebase console. Here are some basic examples to try:
   
   Allow all authenticated access:
   ```
   {
     "rules": {
       ".read": "auth != null",
       ".write": "auth != null"
     }
   }
   ```
   
   Allow unrestricted access from now until Oct 31st, 2020:
   ```
   {
     "rules": {
       ".read": "now < 1604116800000",  // 2020-10-31
       ".write": "now < 1604116800000",  // 2020-10-31
     }
   }
   ```
   
   Instructions on setting more complex rules are available in Firebase's online documentation.
   
   Note that setting your Firebase rules incorrectly will result in access errors when trying to read or write to your 
   database. For example:
   ```
   FIREBASE WARNING: set at /messages/-MI_2QHFwFdfNAeZP1O0 failed: permission_denied
   ```
   
   Try setting too-strict rules to see these errors appear when using your app.

## Notes

  - In your Firebase callbacks, use `$timeout` to refresh the AngularJS view.
    Why is this necessary? Try it yourself with and without `$timeout` and compare the behaviour.
    ```
    ref.on("value", function(snap) {
        $timeout(function() {
            // Logic that changes the scope variable values goes here.
        });
    });
    ```

  - Remember to always add a success/fail (.then/.catch) clause for each Firebase call you make. 
    Always add handling in case of failure (show an `ons.notification.alert`, for instance), and most importantly,
    __test whether your failure clause works__.
