document.addEventListener('DOMContentLoaded', function() {

	// Get references to our DOM
	var addBoxButton = document.querySelector(".addBox");
	var removeBoxButton = document.querySelector(".removeBox");
	var addNBoxesButton = document.querySelector(".addNBoxes");
	var numberOfBoxes = document.querySelector(".numberOfBoxes");
	var boxContainer = document.getElementsByClassName("boxes")[0];

	// Add event listeners
	addBoxButton.addEventListener("click", addBox);
	removeBoxButton.addEventListener("click", removeBox);
	addNBoxesButton.addEventListener("click", function (e) {
		addBoxes(e, parseInt(numberOfBoxes.value, 10));
	});

	// Add a box to the list of boxes
	function addBox(e) {
		var node = document.createElement("li");
		node.className = "box";
		boxContainer.appendChild(node);
	}

	// Remove a box from the end of the list
	function removeBox(e) {
		var listNodes = document.getElementsByClassName("box");
		if (listNodes.length === 0) {
			return;
		}
		var myNodeToRemove = listNodes[listNodes.length - 1];
		boxContainer.removeChild(myNodeToRemove);
	}

	// Add N boxes to the end of the list
	function addBoxes(e, numberOfBoxesToAdd) {
		for (var i = 0; i < numberOfBoxesToAdd; i++) {
			addBox();
		}
	}

}, false);
