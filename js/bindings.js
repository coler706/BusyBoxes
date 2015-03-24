$(".rule-dropdown-open").click(function(){
  $(".rule-dropdown").fadeToggle("fast");
  $(this).toggleClass("dropdown-active");
});
$(".config-dropdown-open").click(function(){
  $(".config-dropdown").fadeToggle("fast");
  $(this).toggleClass("dropdown-active");
});


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
  }
  return "";
}

$(window).load(function(){

  if (localStorage.getItem("instructions") != "true"){
    $('#controls').modal('show');
    localStorage.setItem("instructions", true)
  }

  // if (getCookie("instructions") != "true"){
  //   $('#controls').modal('show');
  //   setCookie("instructions",true,365);
  // }
});