$(document).ready(function() {
  console.log("run");
  try {
    $("body").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.02
    });
  } catch (e) {
    $(".error")
      .show()
      .text(e);
  }

  //   $("body").ripples("drop", 400, 400, 20, 5);
});
