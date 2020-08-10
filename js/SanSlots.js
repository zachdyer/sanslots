var slotMachine = new SlotMachine()
var user = new User()
var vm = new Vue({
  el: '#sanslots',
  data: {
    slots: [
      [{"cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)'},{"cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)'},{"cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)'}],
      [{"cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)'},{"cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)'},{"cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)'}],
      [{"cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)'},{"cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)'},{"cardClass": null, type: '', money: null, img: 'url(img/slots/1.jpg)'}]
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
    user: user
  },
  created(){
    //preload images
    // Set the image sources and make sure to label them in numeric order
    for(var i = 0; i < this.slotImages.length; i++) {
      this.slotImages[i].src = `img/slots/${i+1}.jpg`
    }
    //preload slot animation
    this.slotAnimation = new Image().src = 'img/loading.3.gif'
    console.log(this.slots)
  },
  methods: {
    play(){
      // Calculate new slot values
      slotMachine.play()
      // Reset slots to loading
      for(let x = 0; x < slotMachine.slots.length; x++){
       for(let y = 0; y < slotMachine.slots[x].length; y++){
        this.slots[x][y].img = `url(img/loading.3.gif)`
        this.slots[x][y].type = this.slots[x][y].money = this.slots[x][y].cardClass = ''
       }
      }
      console.log(this.slots)
      // Reset alert box to null
      this.alert.variant = null
      this.alert.message = null
      // Wait a couple seconds to show slots
      window.setTimeout(()=>{
        for(let x = 0; x < slotMachine.slots.length; x++){
         for(let y = 0; y < slotMachine.slots[x].length; y++){
           let slotVal = slotMachine.slots[x][y]
           this.slots[x][y].img = `url(${this.slotImages[slotVal - 1].src})`
           this.slots[x][y].type = slotVal
           this.slots[x][y].money = `$${slotVal}0`
           this.slots[x][y].cardClass =  slotMachine.winnerSlots[x][y] ?  'win-gradient' : ''
           // If won then update the alert box
           if(slotMachine.winnings) {
            this.alert.message = `You win $${slotMachine.winnings}!`
            this.alert.variant = 'alert-success'
           }
         } 
        }
      }, 2000)
    },
    login(){
      
    }
  }
})

// Debug

