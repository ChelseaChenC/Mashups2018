

var app = {
	NasaURL: "https://epic.gsfc.nasa.gov/api/enhanced/date/",
	initialize: function() {
		var datelist = [];
		$("#datepicker").change(function() {
			app.searchNasa(this.value);
		});

		$("#left").click(function(){
			app.imageIndex = (app.imageIndex - 1 + app.imageList.length) % app.imageList.length;
			app.makeImage(app.dateV2, app.imageIndex);
		});

		$("#right").click(function(){
			app.imageIndex = (app.imageIndex + 1) % app.imageList.length;
			app.makeImage(app.dateV2, app.imageIndex);
		});


		$.ajax({
			url: "https://epic.gsfc.nasa.gov/api/natural/available",
			type: "GET",
			dataType: "json",

			error: function(date){
				console.log("Can't get date");
			},
			success: function(data){
				console.log("got date!");
			    datelist = data;
				// console.log(datelist);
			}	
		});


		// var datelist = "28-02-2018,29-02-2012,01-03-2012,02-03-2012,03-03-2012,04-03-2012,05-03-2012,06-03-2012,07-03-2012,08-03-2012,09-03-2012,28-02-2012,29-02-2012,01-03-2012,02-03-2012,03-03-2012,04-03-2012,05-03-2012,06-03-2012,07-03-2012,08-03-2012,09-03-2012".split(",");
			$(document).ready(function() {
 			  $("#datepicker").datepicker({
 			  	  dateFormat: 'yy-mm-dd',
 			      beforeShowDay: function(d) {
 			          // normalize the date for searching in array
 			          var dmy = "";
 			          dmy += d.getFullYear()+ "-";
 			          dmy += ("00" + (d.getMonth() + 1)).slice(-2) + "-";
 			          dmy += ("00" + d.getDate()).slice(-2);
 			          
 			          
 			          if ($.inArray(dmy, datelist) >= 0) {
 			              return [true, ""];
 			          }
 			          else {
 			              return [false, ""];
 			          }
 			      }
 			  });
		});
	},


	gallery: null,
    imageList: [],
    imageIndex: null,
	image: null,
	dateV2: null,
	searchNasa: function(searchDate) {
		
		app.imageList = [];
		$.ajax({

			url: this.NasaURL + searchDate,
			type: 'GET',
			dataType: 'json',
			error: function(date){
				console.log("We got problems");
				//console.log(data.status);
			},
			success: function(data){
				console.log("WooHoo!");
				//Check the browser console to see the returned data
				console.log(data);
				var today = new Date(searchDate);
				var dd = today.getUTCDate();
                var mm = today.getUTCMonth()+1; //January is 0!
                var yyyy = today.getUTCFullYear();
                if(dd<10){
                    dd='0'+dd;
                } 
                  if(mm<10){
                    mm='0'+mm;
                } 
                app.dateV2 = yyyy+'/'+mm+'/'+dd;
				console.log(app.dateV2);
				for (var i = 0; i < data.length; i++) {
					app.imageList.push(data[i].image);
				}
				
				
                app.imageIndex = 0;
				app.makeImage(app.dateV2, app.imageIndex);		
			}
		});
	},

	makeImage: function(dateV2, i){
		var api_key = ;

		var theImage = "https://api.nasa.gov/EPIC/archive/enhanced/" + dateV2 + "/jpg/" + app.imageList[i] + ".jpg?api_key=" + api_key;
		 console.log("Here is the theImageURL: ");
		 console.log(theImage);

		 anime.timeline({})
  
 			 .add({
 			   targets: '.earth_photo',
 			   backgroundPosition: ['50% 0%', '0% 0%'],
 			   opacity: {
 			     value: [1,0]
 			   },
 			   duration: 700,
 			   easing: 'easeOutQuad',
 			   complete: function(anim){
 			     $(".earth_photo").css("background-image", "url(" + theImage +")"); 
 			   }
 			 })
 			 .add({
 			   targets: '.earth_photo',
 			   backgroundPosition: ['0% 0%', '50% 0%'],
 			   opacity: [0.2,1],
 			   duration: 500,
 			   easing: 'easeOutQuad'
 			 });

	},


  
	
}

