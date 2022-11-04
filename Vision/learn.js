var OBSERVATIONS = [];
var OBS_COUNT = 0;

function learn() {
    var name = document.getElementById('objectName').value;
    if (name == "") {
        alert("Enter a name for this object");
        return;
    }

    OBS_COUNT++;
    OBSERVATIONS[OBS_COUNT] = {
        name: name,
        prop: OBJECT_PROP
    }

    document.getElementById('objectName').value = "";
}

function checkKeyPress(event) {
    if (event.key == "Enter") {
        learn();
    }
}