var slotMachine = new SlotMachine()
var user = new User()
var SanSlots = new Vue({
  el: '#sanslots',
  data: {
    slots: [
      [{ "cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)' }, { "cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)' }, { "cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)' }],
      [{ "cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)' }, { "cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)' }, { "cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)' }],
      [{ "cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)' }, { "cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)' }, { "cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)' }]
    ],
    slotImages: [
      new Image(),
      new Image(),
      new Image(),
      new Image()
    ],
    slotAnimation: null,
    alert: {
      variant: null,
      message: null
    },
    user: user,
    username: null,
    userID: null,
    leaderboard: null,
    database: null,
    score: 0,
    snapshot: null
  },
  created() {
    //preload images
    // Set the image sources and make sure to label them in numeric order
    for (var i = 0; i < this.slotImages.length; i++) {
      this.slotImages[i].src = `img/slots/${i + 1}.jpg`
    }
    //preload slot animation
    this.slotAnimation = new Image().src = 'img/loading.3.gif'

    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyA5JIbP0QuQb0q-QMXdRPy5HvegfVdAv0I",
      authDomain: "sanslots-c99b4.firebaseapp.com",
      databaseURL: "https://sanslots-c99b4.firebaseio.com",
      projectId: "sanslots-c99b4",
      storageBucket: "sanslots-c99b4.appspot.com",
      messagingSenderId: "930737392621",
      appId: "1:930737392621:web:981561164cb6cbde6cb5e4",
      measurementId: "G-7YQVWSLZ0F"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    // Get a reference to the database service
    this.database = firebase.database()
    this.database.ref('leaderboard').on("value", (snapshot) => {
      // order the leaderboard by highscore
      this.leaderboard = _.orderBy(snapshot.val(), 'highscore', 'desc')
      // save original order to maintain user ids
      this.snapshot = snapshot.val()
      console.log(snapshot.val())
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
    // Check if player username was saved
    if (localStorage.getItem('username')) this.username = localStorage.getItem('username')
  },
  methods: {
    play() {
      // Calculate new slot values
      slotMachine.play()
      // Reset slots to loading
      for (let x = 0; x < slotMachine.slots.length; x++) {
        for (let y = 0; y < slotMachine.slots[x].length; y++) {
          this.slots[x][y].img = `url(img/loading.3.gif)`
          this.slots[x][y].type = this.slots[x][y].money = this.slots[x][y].cardClass = ''
        }
      }
      // Reset alert box to null
      this.alert.variant = null
      this.alert.message = null
      // Wait a couple seconds to show slots
      window.setTimeout(() => {
        for (let x = 0; x < slotMachine.slots.length; x++) {
          for (let y = 0; y < slotMachine.slots[x].length; y++) {
            let slotVal = slotMachine.slots[x][y]
            this.slots[x][y].img = `url(${this.slotImages[slotVal - 1].src})`
            this.slots[x][y].type = slotVal
            this.slots[x][y].money = `$${slotVal}0`
            this.slots[x][y].cardClass = slotMachine.winnerSlots[x][y] ? 'win-gradient' : ''
          }
        }
        // Check If won
        if (slotMachine.winnings) {
          // Update alert message
          this.alert.message = `You win $${slotMachine.winnings}!`
          this.alert.variant = 'alert-success'
          //Add to score
          this.score += slotMachine.winnings
          // send new score to database
          this.database.ref('leaderboard/' + this.userID).set({
            name: this.username,
            highscore: this.score
          })
        }
      }, 2000)
    },
    login() {
      // reset score so if they switch usernames it doesn't just add the too together
      this.score = 0
      this.userID = null
      //Check if user exists in leaderboard
      if (_.find(this.leaderboard, { name: this.username })) {
        this.user = _.find(this.leaderboard, { name: this.username })
        // add highscore to score
        this.score += this.user.highscore
        // get user id
        this.userID = _.findKey(this.snapshot, { 'name': this.username });
        console.log(this.user, this.userID)
      } else {
        // create a new user
        let newuser = this.database.ref('leaderboard').push({
          name: this.username,
          highscore: this.score
        }).then((snap) => {
          this.userID = snap.key
        })
        console.log("No user found. Created new user.", this.user, this.username, this.userID)
      }
      // remember the player username so when they come back to the site they don't have to enter it again
      localStorage.setItem('username', this.username)
    }
  }
})

// Debug

