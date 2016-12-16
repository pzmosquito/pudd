# pudd

pudd is a state management tool for unidirectional data flow for Polymer 1.x. It's inspired by Redux state container.

With pudd, you don't need to worry about complicated data binding, it'll automatically bind properties defined with pudd. pudd uses seamless-immutable js to manage the state.

## Usage
Simply import pudd.html to your root element or index.html.

## Set up and run example
1. run `npm install`
2. run `npm run bower install`
3. run `node server`
4. launch `http://localhost:8080/example`

## Test
run `npm run wct` to run tests

## Example explanation
Let's create a very simple application that contains only 3 elements:
```html
<user-app>
  <user-input></user-input>
  <user-display></user-display>
</user-app>
```

in `<user-input>` element, we have an input box:
```html
<dom-module id="user-input">
  <template>
    <input type="text" on-input="userInput">
  </template>
  <script>
    Polymer({
      is: "user-input",
      userInput: function (e) {
        // Pudd catches STATE-UPDATE event, with 2 keys in the detail: type, data
        // "type" is required and must be unique, it identifies the reducer
        // "data" is optional, it contains the data needed for the reducer
        this.fire("STATE-UPDATE", {
          "type": "input-user",
          "data": { "value": e.currentTarget.value }
        });
      }
    });
  </script>
</dom-module>
```

in `<user-display>` element, we simply display the value:
```html
<dom-module id="user-display">
  <template>
    User is: [[username]]
  </template>
  <script>
    Polymer({
      is: "user-display",
      // Pudd.Observer behavior is for mapping state to properties
      behaviors: [Pudd.Observer],
      properties: {
        username: {
          type: String,
          // "statePath" is the mapping path of the state
          statePath: "user.name",
          // "stateValue" is the default value if the value of the state path is undefined
          stateValue: "none"
        }
      }
    });
  </script>
</dom-module>
```

in `<user-app>` root element, we include the other 2 elements:
```html
<link rel="import" href="pudd.html">
<link rel="import" href="reducer-user.html">
<link rel="import" href="user-input.html">
<link rel="import" href="user-display.html">
<dom-module id="user-app">
  <template>
    <user-input></user-input>
    <!-- need to pass puddState to presentational elements -->
    <user-display pudd-state="[[puddState]]"></user-display>
  </template>
  <script>
    Polymer({
      is: "user-app",
      // Pudd.Root is required for root element to initialize pudd.
      // Pudd.Listener behavior is for listening to STATE-UPDATE event and call reducer.
      
      // it's recommended to user Pudd.Listener only in root element.
      // if Pudd.Listener is used in sub elements, make sure to pass the puddState with 2-way binding

      behaviors: [Pudd.Root, Pudd.Listener],
      // "reducers" is required for Pudd.Listener behavior.
      // You can include multiple reducers for better file/structure management.
      reducers: [PuddReducer.User],
      ready: function () {
        // initialize pudd state.
        this.puddInit();
      }
    });
  </script>
</dom-module>
```

Now let's create the reducer file `reducer-user.html`
```javascript
  <script>
    var PuddReducer = PuddReducer || {};
    PuddReducer.User = {
      // "input-user" key matches the "type" of the STATE-UPDATE event detail
      // "state" argument is the immutable state
      // "data" argument matches the "data" of the STATE-UPDATE event detail
      // "e" argument is the STATE-UPDATE event
      "input-user": function (state, data, e) {
        // use seamless-immutable js to set the value to state path (as an array)
        return state.setIn(["user", "name"], data.value);
      }
    };
  </script>
```

In this example, when user type text in the input box, the value will show up in the display without using any 2-way binding. In fact, you should always use 1-way binding in Pudd. Pudd will take care of the data binding for you, so you will never have to trace down where the binding issue is.
