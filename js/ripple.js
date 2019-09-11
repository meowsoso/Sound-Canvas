$(document).ready(function() {
  try {
    $("div#lilyPond").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.03,
      interactive: false
    });
  } catch (e) {
    $(".error")
      .show()
      .text(e);
  }

  //   $("body").ripples("drop", 400, 400, 20, 5);
});
