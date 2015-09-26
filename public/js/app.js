$(function() {
  FastClick.attach(document.body);
  $(document).pjax('a[data-pjax]', '#data-container');
  $(document).foundation();
  new WOW().init();
})
