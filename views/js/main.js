$(document).ready(function() {
  $('.date_expander').click(function(){
    var data_markup = $(this).next('tr').find('.daily_transaction_row');
    data_markup.toggle();
  });
});
