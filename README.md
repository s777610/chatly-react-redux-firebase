## Chatly - React, Redux, Firebase

## Installation

1. Clone
```
git clone https://github.com/s777610/chatly-react-redux-firebase.git
```

2. Install
```
npm install
```

3. Create firebase.js
- You must create firebase.js under the src folder.
The firebase.js should contains
```
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database"; 
import "firebase/storage"; 

var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

firebase.initializeApp(config);

export default firebase;
```
