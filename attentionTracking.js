targets = [ 
	{ selector : ".target1", vwo1 : function() {
		alert("Condition 1");
	},  vwo2 : function() {
		alert("Condition 2");		
	} }, 
	{ selector : ".target2",  vwo1 : function() {
		alert("Condition 1");	
	}, vwo2 : function() {
		alert("Condition 2");			
	} }	
];


// Everything below can remain unchanged

var windowHeight,
	scrollY,
	y,
	documentHeight,
	scrollSensitivity = 200,
	triggeredCount = 0; // Check scroll position every 200 ms
	
//$(window).load(function () {

	windowHeight = $(window).height();
	documentHeight = $(document).height(); // Get height of entire page
	
	// Initialize all the targets
	for(i=0; i<targets.length; i++) {
		var target = $(targets[i].selector);
		if(target.length > 0) {
			targets[i].targetTop = Math.ceil(target.offset().top); 
			targets[i].targetHeight = Math.ceil(target.height());
			targets[i].targetBottom =  targets[i].targetTop + targets[i].targetHeight;
			targets[i].triggered = 0;		  
		} else {
			targets[i].triggered = 1; // If target doesn't exist, mark it as triggered in order to skip it
			triggeredCount++;
		}
	}
	
	var updateView = setInterval(function() {
	
  		scrollY = $(document).scrollTop(); // refresh scroll position		
		y = scrollY + windowHeight;
	
		for(targetNumber = 0; targetNumber < targets.length; targetNumber++) {
			
			(function(a,b) {

				/****************************************************************/			
				/************** Repeat block for each target ********************/
				/****************************************************************/
					
					// Check if user is viewing target
					if(
						!targets[a].triggered // Skip ones that have been triggered
						&&
						(
							(   
								(b > targets[a].targetTop + windowHeight*0.3)  // Top of target scrolls 40% into view from bottom of window
								||     
								(targets[a].targetTop + windowHeight*0.3 > documentHeight && b > targets[a].targetTop + targets[a].targetHeight*0.5) // If top of target is too close to bottom to scroll into view, ensure it scrolls at least half its height into view
							)   
							&&   
							(   
								targets[a].targetBottom > b - windowHeight*0.8 // Bottom of target is within top 20% of window
								||
								(targets[a].targetBottom - windowHeight*0.2 < 0 && b-windowHeight < targets[a].targetHeight*0.3)// Target is above fold and too high to scroll down, ensure at least 30% of it is showing
							)
						)
					) {
					
						$(targets[a].selector).addClass("js-inview");

						// Start viewing timer
						if(!targets[a].inview) {
						
							// Initialize conditions and counts
							var condition1 = false;
							var condition2 = false;	
							if(!targets[a].viewTime) targets[a].viewTime = 0;
							if(!targets[a].viewTimeTotal) targets[a].viewTimeTotal = 0;							
						
							targets[a].viewingTimer = setInterval(function() {
									
								// Condition 1
								if(targets[a].viewTime == 5) {
									condition1 = true;
									targets[a].vwo1();
								}
								
								// Condition 2
								if(targets[a].viewTimeTotal == 20) {
									condition2 = true;
									targets[a].vwo2();
								}				
								
								if(condition1 && condition2) {
									targets[a].triggered = true;
									triggeredCount++;
									$(targets[a].selector).addClass("js-triggered");
									clearInterval(targets[a].viewingTimer);
								}
								
								targets[a].viewTime++;
								targets[a].viewTimeTotal++;
								
							}, 1000);
							
							targets[a].inview = 1;
						}        
					} else if(!targets[a].triggered) {
						targets[a].inview = 0;						
						targets[a].viewTime = 0;
						clearInterval(targets[a].viewingTimer);
						$(targets[a].selector).removeClass("js-inview");
					}

				/****************************************************************/					
				/************************** End block ***************************/	
				/****************************************************************/				
				
			})(targetNumber, y);
		
		}

		// stop listening once all goals reached		
		if( triggeredCount == targets.length) {
			clearInterval(updateView);
			$("body").addClass("js-allviewed");
		}
	}, scrollSensitivity);  	

//});

$(window).resize(function() { windowHeight = $(window).height() } ); // refresh window height