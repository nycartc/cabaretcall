var borough;
var neighborhood = [];
var districts;
var districtMaps = false;
var district = false;
var mapDistrict;
var originalScript = $( "#script-text").html();
var width = $(window).width();
var height = $(window).height();
$( "div#chart" ).css("max-width", width);
var sent = false;

/* Buttons */

var danceCount = 0;
var dancing = false;

function dance(){
  $( "#dance-spinner").show();
  $( "#dancers span" ).css("unicode-bidi", "bidi-override");
  if (danceCount % 2 != 0){
    $( "#dancers span" ).css("direction", "rtl");
  } else {
    $( "#dancers span" ).css("direction", "ltr");
  }
  if (dancing || danceCount < 5){
    if (danceCount < 80) {
      danceCount += 1;
      setTimeout(dance, 250);
    } else {
      dancing = false;
      $( "#dance-spinner").hide();
      danceCount = 0;
    }
  } else {
    $( "#dance-spinner").hide();
    danceCount = 0;
  }
}

$( "button.top-button" ).click(function() {
  $( ".button-container" ).toggle();
});

$( "button#back" ).click(function() {
  clear();
  $( ".section" ).hide();
});

function showDistrictInfo(){
  if (district != false && districtMaps != false){
    $( "#find-councilmember").show();
  } else {
    setTimeout(function() {
      showDistrictInfo();
    }, 2500);
    return;
  }
}

$( "button#find" ).click(function() {
  $( "#find-councilmember").show();
  //showDistrictInfo();
});

$( "button#call" ).click(function() {
  if (!district) {
    $( "#your-district").show();
  }
  $( "div#call-script" ).show();
});

$( "button#see-calls" ).click(function() {
  dancing = true;
  dance();
  $.ajax({
  url: "/calls.json",
  success: function(data) {
    showCalls(data, false);
  }
});
  
  $( "div#calls" ).show();
});

function clear() {
  district = "";
  $( "#calls h2" ).html("");
  $( "#your-district").hide();
  $( "#your-district h3").html("");
  $( "#your-district ul").html("");
  $( "#script-text").html(originalScript);
  $( "#district-select" ).hide();
  $( "#neighborhood" ).val("");
}


/* Find Council Member */

$.ajax({
  url: "/districts.json",
  success: function(data) {
    districts = data;
    checkDistrictData();
  }
});


$.ajax({
  url:"/districtmaps.json",
  success: function(data) {
    districtMaps = data;
  }
})

function checkDistrictData() {
  if (districts && districtMaps) {
    addDistricts()
  } else {
    setTimeout(function() {
      checkDistrictData();
    }, 200)
  }
}


function addDistricts() {
  for (var i in districts) {
    var district = districts[i];
    var classes = "";
    var neighborhoodList = "";
    var neighborhood = district.neighborhoods;
    for (var n in neighborhood) {
      neighborhoodList += neighborhood[n] + ", ";
      var neighborhoodWords = neighborhood[n].split(" ");
      for (var w in neighborhoodWords) {
        classes += neighborhoodWords[w].replace(/\W+/g, "") + " ";
      }
    }
    classes += "district";
    neighborhoodList = neighborhoodList.slice(0, -2);
    $( "#councilmembers" ).append(
      "<li borough='" +
      district.borough.replace(/\s+/g, '-') +
      "' district='" +
      i +
      "' class='" + 
      classes +
      "'>" + 
        "<div class='district-text'><h3 class='district-title'>" +
          i + 
          ": " + 
          district.name +
          "</h3><p class='neighborhoods'>" +
          neighborhoodList +
        "</p><div class='i-live-here-container'><div class='i-live-here'>I live here!</div></div></div><div class='map-link'><img class='map-image' src='" +
        districtMaps[i] +
        "'><h3 class='view-map'>View Map</h3></div></div>" +
      "</li>"
    );
    $( "#maps" ).append(
      "<div id='full-map-container-" +
      i +
      "' class='full-map-container' district='" +
      i +
      "'><div class='close-map'>Close Map</div><div class='full-map-image-container'><img class='full-map' src='" +
      districtMaps[i] +
      "'></div><div class='i-live-here-container full-i-live-here-container'><div class='full-i-live-here'>I live here!</div></div></div>"
    )
  }
}


function hideBorough(element) {
  borough = $($("select#borough option").filter(":selected")).val();
  if (borough){
    if (element.attr("borough").indexOf(borough) < 0 ) {
      element.hide();
    }
  }
}

function chooseDistrict(){
  $( "#district-select1").hide();
  //$( "#district-select2").hide();
  var text = $( "#script-text").html();
  var sLength = "Council District ______".length;
  var tLength = text.length;
  var index = text.indexOf("Council District ______");
  text = text.substring(0, index) + "Council District " + district + text.substring(index + sLength, tLength);
  $( "#script-text").html(text);
  
  var yourDistrict = districts[district];
  $( "#your-district h3").html("District " + district + ": " + yourDistrict.name);
  //<a href="tel:+15555551212">555-555-1212</a>
  $( "#your-district ul").append(
    "<li>📞 <a href='tel:+1" +
    yourDistrict.phone.legislative +
    "'>" +
    yourDistrict.phone.legislative +
    "</a></li>"
  );
  if (yourDistrict.email) {
    $( "#your-district ul").append(
      "<li>📠 <a href='mailto:" +
      yourDistrict.email +
      "?Subject=Let%20NYC%20Dance%3A%20Repeal%20the%20Cabaret%20Law'>" +
      yourDistrict.email +
      "</a></li>"
    );
  }
  $( "#your-district").show();
}


$( "select#borough" ).change(function() {
  $( "input#neighborhood" ).val("");
  $( ".district" ).each(function() {
    $( this ).show();
    hideBorough($( this ));
  });
});

$( "input#neighborhood" ).keyup(function() {
  var input = $( this ).val();
  $( ".district" ).each(function(index, value){
    $( value ).show();
    var c = $( value ).attr("class");
    if (c.toLowerCase().indexOf(input.toLowerCase()) < 0){
      $( value ).hide();
    }
    hideBorough( $(value) );
  });
});

$( "body" ).on("click", "div.i-live-here-container", function() {
  district = $( this ).parent().parent().attr("district");
  if (!district) {
    district = mapDistrict;
  }
  $( ".full-map-container" ).hide();
  $( "#main" ).show();
  $( "#find-councilmember").hide();
  chooseDistrict();
  $( "#call-script").show();
  window.scrollTo(0, 0);
});

$( "#maps" ).on("click", ".close-map", function() {
  $( ".full-map-container" ).hide();
  $( "#main").show();
});

$( "#councilmembers" ).on("click", "div.map-link", function() {
  mapDistrict = $( this ).closest( "li" ).attr("district");
  var map = "#full-map-container-" + mapDistrict;
  $( "#main" ).hide();
  if (width > height) {
    $( map ).children( ".full-map-image-container" ).children( "img.full-map").css("height", height*0.6 + "px");
    $( map ).children( ".full-map-image-container" ).children( "img.full-map").css("width", "auto");
  } else {
    $( map ).children( ".full-map-image-container" ).children( "img.full-map").css("height", height*0.6 + "px");
    $( map ).children( ".full-map-image-container" ).children( "img.full-map").css("width", "auto");
  }
  
  $( map ).css("display", "block");
});



/* Call */

$( "select#district-choice1" ).change(function() {
  district = $("select#district-choice1 option").filter(":selected").val();
  chooseDistrict();
});

$( "select#district-choice2" ).change(function() {
  district = $("select#district-choice2 option").filter(":selected").val();
  chooseDistrict();
});


function showCalls(data, name) {
  var totalCalls = 0;
  var maxCalls = 0;
  for (var i in data) {
    totalCalls += data[i].length;
    if (data[i].length > maxCalls) {
      maxCalls = data[i].length;
    }
  }
  for (var i in data) {
    var percent = data[i].length / maxCalls * 100;
    var color;
    if (i % 2 != 0){
      color = "FE3D89";
    } else {
      color = "FFF234";
    }
    $( "ul#district-chart").append(
      "<li>" + 
        "<h4>" +
          i +
          ": " +
          districts[i.toString()].name +
        "</h4><br>" +
        "<div class='bar bar-" +
        color + 
        "' style='width:" +
        percent +
        "%; margin-right:" +
        (100 - percent) +
        "%'></div>"
    )
  }

  $( "#call-script").hide();
  if (name){
    $( "#calls h2#thank-you" ).html("Thank you for calling your Council Member " + name + "!");
  }
  $( "#calls h3#total-calls" ).html("We have made " + totalCalls +  " calls to NYC Council Members!");
  
  $("#calls").show();
  window.scrollTo(0, 0);
  dancing = false;
}


function sendCall(){
  if (!district){
    $( "#district-select2" ).show();
  } else {
    sent = true;
    dancing = true;
    dance();
    $.ajax({
      url: "/call/new",
      data: {"district": district },
      success: function(data) {
        sent = false;
        var name = districts[district].name;
        clear();
        showCalls(data, name);
      },
      error: function(xhr, status, err) {
        console.log("Error:");
        console.log(err);
      }
    });
  }
}

$( "button#send" ).click(function() {
 sendCall(); 
});

$( "#send-container").click(function() {
  if (!sent){
    sendCall();
  }
})
