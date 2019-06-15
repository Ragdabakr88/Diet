
$(document).ready(function(){
	"use strict";

  var isGoal = $(".isGoal").text();
  var isExercise = parseInt($('.isExercise').text()); 
  var isGender= $(".isGender").text();
  var height = parseInt($(".height").text());
  var weight = parseInt($(".weight").text());
  var age = parseInt($(".age").text());

// console.log(isExercise);
//  console.log(isGoal);
//   console.log( height , weight  ,age);

 

  if(isGender == 'Male'){
  var BMR = (10*weight)+(6.25*height)-(5*age)+5;
  }else {
  var BMR = (10*weight)+(6.25*height)-(5*age) -161;
   }

//    console.log("bmr"+BMR);

 if(isGoal == 'Maintain weight'){
  var total = BMR+isExercise+300;
  }else if(isGoal == 'Fat loss'){
   var total = (BMR+isExercise+300)-(500);
  }else{
   	var total = (BMR+isExercise+300)+(500);
  }

//   console.log("total" +" "+ total);

if(total <= 1350){
 alert("You must add exercise to your daily routine to see result");
 var total = total+300;
}

if(total <= 1449){
  var mealPlan = "/mealPlans/A.pdf";
}
else if( total >= 1450 && total <= 1549 ){
  var mealPlan = "/mealPlans/B.pdf ";
}
else if(total > 1550 && total <= 1649){
  var mealPlan = "/mealPlans/C.pdf";
}
else if(total > 1650 && total <= 1749){
  var mealPlan = "/mealPlans/D.pdf";
}
else if(total > 1750 && total <= 1849){
  var mealPlan = "/mealPlans/E.pdf";
}
else if(total > 1850 && total <= 1949){
  var mealPlan = "/mealPlans/F.pdf";
}
else if(total > 1950 && total <= 2049){
  var mealPlan = "/mealPlans/G.pdf";
}
else if(total > 2050 && total <= 2149){
  var mealPlan = "/mealPlans/H.pdf";
}
else if(total > 2150 && total <= 2249){
  var mealPlan = "/mealPlans/I.pdf";
}
else if(total > 2250 && total <= 2349){
  var mealPlan = "/mealPlans/J.pdf";
}
else if(total > 2350 && total <= 2449){
  var mealPlan = "/mealPlans/K.pdf";
}
else if(total > 2450 && total <= 2549){
  var mealPlan = "/mealPlans/L.pdf";
}
else if(total > 2550 && total <= 2649){
  var mealPlan = "/mealPlans/M.pdf";
}
else if(total > 2650 && total <= 2749){
  var mealPlan = "/mealPlans/N.pdf";
}
else if(total > 2750 && total <= 2849){
  var mealPlan = "/mealPlans/O.pdf";
}
else if(total > 2850 && total <= 2949){
  var mealPlan = "/mealPlans/P.pdf";
}

else{
  var mealPlan = "/mealPlans/Q.pdf";
}

     $("#w3s").click(function(){
        $(this).attr("href",mealPlan);
    });


//display mealPlan after sharing

$('.trainer-detail .trainer-name .trainer-contact a').on('click',function(req,res){
        $('.trainer-detail .trainer-name .trainer-contact span').css("display","block");
	});


//checkbox-button disabled if not checked terms & conditions

$(document).on('change', '#termscons', function(){
    if($(this).is(':checked')) {
        console.log("on");
        $("#btnSubmit").attr('disabled',false);
      }
    else {
        $("#btnSubmit").attr('disabled',true);	
        console.log('disabled');
      }
 });

    
            $('.owl-carousel').owlCarousel({
    loop:true,
    margin:15,
    nav:true,
    items:5
    // responsive:{
    //     0:{
    //         items:1
    //     },
    //     600:{
    //         items:3
    //     },
    //     1000:{
    //         items:3
    //     }
    // }
});
       
            $('.owl-carousel2').owlCarousel({
    loop:true,
    margin:0,
    nav:true,
    items:5
    // responsive:{
    //     0:{
    //         items:1
    //     },
    //     600:{
    //         items:3
    //     },
    //     1000:{
    //         items:3
    //     }
    // }
});     




});
