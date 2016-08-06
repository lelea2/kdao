document.addEventListener('DOMContentLoaded', function() {

	// ******
	// When a user clicks a key the characters
	// gets entered in the text field
	// Your implementation goes here
	// ******

  var keyInputs = document.getElementsByClassName("key");
  var inputBox = document.getElementsByTagName("input")[0];
  var currText = "";
  for (var i = 0; i < keyInputs.length; i++) {
    keyInputs[i].addEventListener("click", handleKeyPress);
  }

  function handleKeyPress(e) {
    //console.log(e.shiftKey);
    var key = this.getAttribute("data-key");
    if (e.shiftKey === true) {
      currText += key.toUpperCase();
    } else {
      currText +=  key;
    }
    inputBox.value = currText;
  }

}, false);
