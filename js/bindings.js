$(".rule-dropdown-open").click(function(){
  $(".rule-dropdown").fadeToggle("fast");
  $(this).toggleClass("dropdown-active");
});
$(".config-dropdown-open").click(function(){
  $(".config-dropdown").fadeToggle("fast");
  $(this).toggleClass("dropdown-active");
});


$(window).load(function(){
  if (localStorage.getItem("instructions") != "true"){
    $('#controls').modal('show');
    localStorage.setItem("instructions", true);
  }
});

// $('button.toggle-background').on('click', function () {
//     $(this).toggleClass('light space');
// });