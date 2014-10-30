var utils  = require('../helpers/utils');
var furnitureRef = new Firebase(utils.urls.furniture);

/*
* FURNITURE MODULES
*
* This is a furniture class and must be instaniated like
* a normal class with the "new" keyword.
*/

var Furniture = function(snapshot, options) {
  options = options || {};
  var self = this;
  var data = snapshot.val();

  /*
  * Register Furniture Values
  *
  */

  this.officeSpace = $('#office-space');
  this.element = $("<div class='furniture'></div>");
  this.id = snapshot.name();
  this.ref = snapshot.ref();
  this.type = data.type;
  this.locked = data.locked;
  this.rotation = data.rotation;
  this.top = data.top;
  this.left = data.left;
  this.name = data.name;


  /*
  * Create Firebase Reference
  *
  */

  this.ref  = new Firebase(utils.urls.furniture + this.id);

  this.ref.on("value", function(snap){

    // UPDATE Furniture INSTANCE WITH MOST RECENT DATA
    var state = snap.val();
    _.extend(self, state);

    // RENDER
    self.render();
  });

  this.render = function(){

    // REMOVE ELEMENT FROM DOM
    this.element.detach();

    // SET CURRENT LOCATION
    this.element.css({
      "top": parseInt(this.top, 10),
      "left": parseInt(this.left, 10)
    });

    if (this.locked){
      this.element.addClass("is-active");
    }
    else {
      this.element.removeClass("is-active");
    }

    // ADD TO DOM
    this.officeSpace.append(this.element);
  };

  /*
  * Create Furniture Method
  *
  */

  this.initElement = function() {

    //SET DRAG OPTIONS
    this.element.draggable({
      containment: self.officeSpace,
      start: function(event, ui){
        self.element.addClass("is-active");
        self.ref.child("locked").set(true);
      },

      drag: function(event, ui){
        self.ref.child("left").set(ui.position.left);
        self.ref.child("top").set(ui.position.top);
      },

      stop: function(event, ui){
        self.element.removeClass("is-active");
        self.ref.child("locked").set(false);
      }
    });

    this.element.addClass(this.type);

    // RENDER 
    this.render();
  };


  /*
  * Create Furniture Element
  *
  */

  this.initElement();
};

module.exports = Furniture;