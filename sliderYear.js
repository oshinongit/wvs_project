var slider = document.getElementById("yearSlider");
var output = document.getElementById("sliderValue");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}