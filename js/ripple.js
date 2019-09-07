$(document).ready(function() {
  console.log("run");
  try {
    $("body").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.02
    });
    // $("main").ripples({
    //   resolution: 128,
    //   dropRadius: 10,
    //   perturbance: 0.04,
    //   interactive: false
    // });
  } catch (e) {
    $(".error")
      .show()
      .text(e);
  }

  //   $(".js-ripples-disable").on("click", function() {
  //     $("body, main").ripples("destroy");
  //     $(this).hide();
  //   });

  //   $(".js-ripples-play").on("click", function() {
  //     $("body, main").ripples("play");
  //   });

  //   $(".js-ripples-pause").on("click", function() {
  //     $("body, main").ripples("pause");
  //   });

  //   $("body").ripples("drop", 400, 400, 20, 5);
});
