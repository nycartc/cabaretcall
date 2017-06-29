// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of in

$( "button#send" ).click(function() {
  var message = $( "input#district").val();
  $( "#call-form" ).html("<h2>Thank you for calling!</h2>");
  var data = { "message": message };
  $.ajax({
    url: "/call/new",
    data: data,
    success: function(data) { 
    },
    error: function(xhr, status, err) {
      console.log("Error:");
      console.log(err);
    }
  })
});
