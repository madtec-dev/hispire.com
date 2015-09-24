$(function() {
  $(document).pjax('a[data-pjax]', '#data-container');
  $(document).foundation();
  new WOW().init();
})
