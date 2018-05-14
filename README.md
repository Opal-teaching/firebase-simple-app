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

## Mini-tutorial on Firebase.
### Firebase Contents
Firebase is described no-sql real-time database. Its structure is based
on key/value pairs that ressemble JSON objects. e.g.
```
{
    "users":
        {"0":
            {
                "firstname": David,
                "lastname": Herrera,
                "conversations:{
                    "0":"true"
            }
        }
    },
    "conversations":{
        "0":{
            "members":{

             }
        },

    }
}
```
Table of Contents:
- Firebase references.
- Event listeners.
- Ways to write to Firebase.
- Database Structuring
- Database querying
#### Firebase references
The Firebase database is always accessed via Firebase references.
References are "pointer" to paths of the Firebase subtree.
They are specified relative to the root of your Firebase DB.
A read/write event happens relative to a reference, at the place the
reference points to.
For example, consider the following:
```
{
    "subtree0":
        {"subtree1":
            {
                "userId":"0"
                "firstname": "David",
                "lastname": "Herrera",
                "conversations:{
                    "0":true
            }
        }
    }
}
```
Assume this object displays our entire database.
In order to reference the root we would call
```
    firebase.database().ref();
```
To reference "subtree0", we would create a references as,
```
    firebase.database().ref("subtree0");
```
To reference "conversations", we would do:
```
    firebase.database().ref("subtree0/subtree1/conversations");
    // or
    let ref = firebase.database().ref();
    ref.child("subtree0/subtree1/conversations");
```
Notice that we can also use the `child()` function to reach deeper into
our tree.
To add a reference of a new conversation to this user, we would use something like,
```
    firebase.database().ref("subtree0/subtree1/conversations");
    // or
    let ref = firebase.database().ref();
    ref.child("subtree0/subtree1/conversations").update({"1":true})
        .then(()=>{}).catch(()=>{});
```
Where "1" stands for the new conversation added under that subtree.
We will get more into the details of reading and writing in the next
section.
#### Database Reading/Writing
##### Writing
To write to the database, we have two main functions called on a reference
`ref.update()`,  `ref.set()` and `ref.push()`. Let's first see the between `ref.update()`
and `ref.set()`,
 consider the following subtree.
```
{
    "firstname":"David"
}
```
Let's now write to this reference/subtree (assume is the root) using
`set` and `update`.
```
 firebase.database().ref().set({"lastname":"Herrera"});
 firebase.database().ref().update({"lastname":"Herrera"});
 // Results set
{
    "lastname":"Herrera"
}
// Results update
{
    "firstname":"David",
    "lastname":"Herrera"
}
```
`ref.set()` overwrites the sub-tree while `ref.update()`, simply  adds a new key/value,
or modifies the value of a given key.

To delete from a subtree/reference:
```
firebase.database().ref().set(null);
```

`ref.push()` also serves to write to a Firebase database. `push` however
creates a random key as the key of the new subtree at that reference
 and writes the parameter provided at that subtree.

 Example:
 ```
 // Original
 {
     "firstname":"David"
 }

 let ref = firebase.database().ref();
 ref.push({"lastname":"Herrera"})
// result
 {
     "firstname":"David"
     "asdjlkA_+asda=asfasdf^&": {
        "lastname":"Herrera"
     }
 }
 ```
 Here the string `"asdjlkA_+asda=asfasdf^&"`was a randomly generated key
 from Firebase. To obtain this key before/after pushing, we use:
```
 let ref = firebase.database().ref();

 // After pushing
 let key = ref.push({"lastname":"Herrera"}).key;
  // Use key
  // Before pushing
  let key = ref.push().key;
  let obj = {};
  obk[key] = {"lastname":"Herrera"};
  ref.set(obj);
```
The use of both is common and it depends on the target application.

#### Reading

This is where the real-time aspect of the database becomes important.
To read we use two types of listeners:
- `on`: Useful for when we want to maintain a real-time connection with
       the database and constantly listen to changes, for instance, listening
       to new users coming online, or listening new incoming messages in a conversation.
- `once`: Useful for when we are interested in checking on the existance
         of an object at a Firebase path, it is also use to simply instantiate
         our application, or in the case of Opal, to listen to the response to
         a request coming from the backend. Since its request is unique, each
         response is unique as well and is expected once.

For these two types of listeners, we have five types of events.
- `value`, Listens to any change to the reference, when it detects
            a change, it sends to the callback the entire subtree
            under the reference
- `child_added`, Only detects and fires when a child is added,
                under the reference subtree. At the initial call
                it returns each child subtree one-by-one to the callback.
- `child_changed`, Only detects and fires when a child in the subtree is changed,
                    (any nested child under the subtree). At the initial call
                   it does nothing. When it detects a change, it only
                   returns the immediate child of the reference whose
                   subtree had the change.
- `child_removed`, Only detects and fires when a child in the subtree is removed,
                 (any nested child under the subtree). At the initial call
                it does nothing. When it fires it returns removed subtree.
- `child_moved`, Only detects and fires when a child in the subtree is changed and
                at a basic level it only works with lists, (keys are numbers).
The general structure of this reads is the following.

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
is called. Here `snap` stands for snapshot of the DB.
We use `snap.exists()` to check if there is data under that subtree.
Events like `value` will give a `null` snapshot call, if the subtree is empty.
`snap.key` returns the key of the subtree, while `snap.val()` returns the
value.

Some examples of events. Consider the following subtree:
```
{
   "0":{
        "firstname":"David"
        "conversations:{
            "0":true,
            "1":true,
        }
    }
}
// Value
ref.on("value",(snap)=>{
    console.log(snap.key, snap.val());
});
// Prints 0, {
                     "firstname":"David"
                     "conversations:{
                         "0":true,
                         "1":true,
                     }
                 }
// and the entire subtree anytime something is modified.

```




#### Database Structuring


The consequences of the JSON-like structure lead to a __non-normalized__ database,
whereby, in order to query efficiently, in terms of both time and space,
it is actually beneficial to have data redundancy (Same data, multiple places).
As an example, let's think about a messaging app. An easy structure would
be to have,
```
{
    "users":
        {"0":
            {
                "userId":"0"
                "firstname": "David",
                "lastname": "Herrera",
                "conversations:{
                    "0":{
                        "convId":"0"
                        "lastMessage":{}
                        "members":{

                                 }
                    }
            }
        }
    }
}
```
This of course breaks down quickly for two reasons. First, when we create
a new conversation, we need to create a conversation object,
for each of the users involved in the conversation. This would in turn
get overly complex, as perhaps we would like to update fields on the conversation.
This would imply we first need to know where they are, which we normally don't
know, since
Firebase does not offer sophisticated queries that would allow us to do that,
 and secondly, we need
to update however many references with the same information, one for each
user of the conversation.
A second argument against such a structuring (as if the above one wasn't enough)
is that any time we want to check a user's information, we are downloading
the entire subtree, even if we are not interested in knowing the
conversations for the user.

Firebase, instead, favors a more "flatten" database structure, whereby, we keep
indices around in certain sub-trees depending on how we navigate
through subtrees in our application. In this
case, we have two modules, users and conversations. In this two-way relationship
the only source of redundancy in terms of space is the fact that
a conversation keeps a list of its members, and a given member keeps track
of conversations. In this case, this redundancy is necessary,
 as sometimes we need conversations based on a user, and sometimes we need
 to know which users take part of a conversation.


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

