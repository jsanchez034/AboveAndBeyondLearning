function activateMenu(divid, colarr, currp) 
		{
			
			var path = $(divid + ' > ul > li');
			$(path).find('ul').hide();
			
						path.each(function() {
						
								var ind = $(this).index();
								var col = colarr[ind];
								var isCurr = (ind == currp);
								var esto = $(this);
								
									esto.hover(
										function() {
											//color animation
											if(!isCurr) esto.find('> a').stop().css({'color': col});
											//dropdown animation
											esto.find('ul')
											.stop(true,true)
											.css('left',((esto.position().left) - 100) + (esto.width()/2))
											.fadeIn();
										}
									,
										function() {
											//color animation
											if(!isCurr) esto.find('> a').stop().animate({"color": "black"},1100);
											//dropdown animation
											esto.find('ul')
											.stop(true,true)
											.fadeOut();

											});
								
									if(isCurr) esto.find('> a').css({'color': col});
						
						});
					
					
		
		}