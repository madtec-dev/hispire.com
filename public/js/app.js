$(function() {
  $(document).pjax('a[data-pjax]', '#data-container');
  $(document).foundation();

  var open = false;
  $('#menu-button, .exit-off-canvas').click(function(event){
    event.preventDefault();
    if(!open){
      $('#menu-button').addClass('close');
      open = true;
    }
    else{
      $('#menu-button').removeClass('close');
      open = false;
    }
  });
})
