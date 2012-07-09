// -------------------------------------------------------------------------------------------
// The Image preloader
// -------------------------------------------------------------------------------------------


(function($)
{
    $.fn.kriesi_image_preloader = function(variables) 
    {
        var defaults = 
        {
            fadeInSpeed: 600,
            delay:500,
            callback: ''
        };
        
        var options = $.extend(defaults, variables);
        
        return this.each(function()
        {   
            var imageContainer = jQuery(this),
                images = imageContainer.find('img').css({opacity:0, visibility:'hidden',display:'block'}),
                imagesToLoad = images.length;               
                
                
                imageContainer.operations =
                {   
                    preload: function()
                    {   
                        var stopPreloading = true;
                                                
                        images.each(function(i, event)
                        {   
                            var image = $(this);                            
                           // if(event.complete == true || i == 0)
                          //  {   
                                imageContainer.operations.showImage(image);
                            //}
                            //else
                           // {   
							//    setTimeout( function() { image.unbind('error load').bind('error load',{currentImage: image}, function() {imageContainer.operations.showImage}) }, 100);
                          //  }
                            
                        });
                        
                        return this;
                    },
                    
                    showImage: function(image)
                    {   
						
                        imagesToLoad --;
                        if(image.data.currentImage != undefined) { image = image.data.currentImage;}
                                                    
                        if (options.delay <= 0) image.css('visibility','visible').animate({opacity:1}, options.fadeInSpeed);
                                             
                        if(imagesToLoad == 0)
                        {
                            if(options.delay > 0)
                            {
                                images.each(function(i, event)
                                {   
                                    var image = $(this);
                                    setTimeout(function()
                                    {   
                                        image.css('visibility','visible').animate({opacity:1}, options.fadeInSpeed, function()
                                        {
                                            $(this).parent().removeClass('preloading');
                                        });
                                    },
                                    options.delay*(i+1));
                                });
                                
                                if(options.callback != '')
                                {
                                    setTimeout(options.callback, options.delay*images.length);
                                }
                            }
                            else if(options.callback != '')
                            {
                                (options.callback)();
                            }
                            
                        }
                        
                    }

                };
                
                imageContainer.operations.preload();
        });
        
    };
})(jQuery);


//equalHeights by james padolsey
jQuery.fn.equalHeights = function() {
    return this.height(Math.max.apply(null,
        this.map(function() {
           return jQuery(this).height()
        }).get()
    ));
};

// -------------------------------------------------------------------------------------------
// The Main accordion slider - KRICORDION

// Dependencies: equalheight function, kriesi_image_preoloader. jquery easing
//
// -------------------------------------------------------------------------------------------
(function($)
{
    $.fn.kricordion = function(options) 
    {
        var defaults = 
        {
            slides: '>div',             // wich element inside the container should serve as slide
            animationSpeed: 900,        // animation duration
            autorotation: true,         // autorotation true or false?
            autorotationSpeed:3,        // duration between autorotation switch in Seconds
            easing: 'easeOutQuint',     // animation easing, more options at the bottom of this file
            event: 'mouseover',         // event to focus a slide: mouseover or click
            imageShadow:true,           // should the image get a drop shadow to the left
            imageShadowStrength:0.5,    // how dark should that shadow be, recommended values: between 0.3 and 0.8, allowed between 0 and 1
            fontOpacity: 1,             // opacity for font, if set to 1 it will be stronger but most browsers got a small rendering glitch at 1
            backgroundOpacity:0.8       // opacity for background
            
        };
        
        // merge default values with the values that were passed with the function call
        var options = $.extend(defaults, options);
        
        return this.each(function()
        {   
            // save some jQuery selections into variables, also calculate base values for each slide
            var slideWrapper    = $(this),                              // element that holds the slides
                slides          = slideWrapper.find(options.slides).css('display','block'), // the slides
                slide_count     = slides.length,                        // number of slides
                slide_width     = slideWrapper.width() / slide_count    // width of the slides
                expand_slide    = slides.width(),                       // size of a slide when expanded, defined in css, class ".featured" by default
                minimized_slide = (slideWrapper.width() - expand_slide) / (slide_count - 1), // remaining width is shared among the non-active slides
                overlay_modifier = 200 *(1- options.imageShadowStrength),                   //increases the size of the minimized image div to avoid flickering
                excerptWrapper = slideWrapper.find('.feature_excerpt'),
                interval = '',
                current_slide = 0;
            
                
            //modify excerptWrapper and re-select it, also add positioning span -------------------------
            excerptWrapper.wrap('<span class="feature_excerpt"></span>').removeClass('feature_excerpt').addClass('position_excerpt');
            excerptWrapper = slideWrapper.find('.feature_excerpt').css('opacity',options.backgroundOpacity);
            // -------------------------------------------------------------------------------------------
            
                
            //equal heights for all excerpt containers, then hide basic excerpt content -----------------
            excerptWrapper.equalHeights().find('.position_excerpt').css({display:'block', opacity:0, position:'absolute'});
            var excerptWrapperHeight = excerptWrapper.height();
            // -------------------------------------------------------------------------------------------
            
                        
            
            //iterate each slide and set new base values, also set positions for acitve and inactive states and event handlers
            slides.each(function(i)
            {
                var this_slide = $(this),                                           // current slide element
                    this_slide_a = this_slide.find('a'),                            // a tag inside the element
                    real_excerpt = this_slide.find('.position_excerpt'),            // wrapper to center the excerpt content verticaly
                    real_excerpt_height = real_excerpt.height(),                    // height of the excerpt content
                    slide_heading =this_slide.find('.sliderheading').css({opacity:0}),               // slide heading
                    cloned_heading =   slide_heading.clone().appendTo(this_slide_a) // clone heading for heading only view
                                                    .addClass('heading_clone')
                                                    .css({opacity:options.fontOpacity, width:slide_width-30}),
                    clone_height = cloned_heading.height();                         // height of clone heading, needed to center verticaly as well
                    
                    
                    this_slide.css('backgroundPosition',parseInt(slide_width/2-8) + 'px ' + parseInt((this_slide.height()- excerptWrapperHeight)/2 -8) + 'px');                     
                    
                    cloned_heading.css({bottom: (excerptWrapperHeight-clone_height)/2 +9});         //center clone heading
                    real_excerpt.css({bottom: (excerptWrapperHeight-real_excerpt_height)/2 +9});    //center real excerpt
                                                
                    this_slide.data( //save data of each slide via jquerys data method
                    'data',
                    {
                        this_slides_position: i * slide_width,                          // position if no item is active
                        pos_active_higher: i * minimized_slide,                         // position of the item if a higher item is active
                        pos_active_lower: ((i-1) * minimized_slide) + expand_slide      // position of the item if a lower item is active
                    });
                    
                //set base properties   
                this_slide.css({zIndex:i+1, left: i * slide_width, width:slide_width + overlay_modifier});
                                
                
                //apply the fading div if option is set to do so
                if(options.imageShadow)
                {
                    this_slide.find('>a').prepend('<span class="fadeout ie6fix"></span>');
                }
                                
            });
            
            // calls the preloader, kriesi_image_preloader plugin needed
            jQuery('#featured').kriesi_image_preloader({callback:add_functionality});
            
            function add_functionality()
            {
                
                //set autorotation ---------------------------------------------------------------------------
                
                
                if(options.autorotation)
                {
                    interval = setInterval(function() { autorotation(); }, (parseInt(options.autorotationSpeed) * 1000));
                }
                
                slides.each(function(i)
                {   
                    var this_slide = $(this), 
                        real_excerpt = this_slide.find('.position_excerpt'),
						slide_heading = this_slide.find('.sliderheading'),
                        cloned_heading = this_slide.find('.heading_clone');
                        
                    //set mouseover or click event
                    this_slide.bind(options.event, function(event, continue_autoslide)
                    {   
                        //stop autoslide on userinteraction
                        if(!continue_autoslide)
                        {
                            clearInterval(interval)
                        }
                        
                        var objData = this_slide.data( 'data' );
                        //on mouseover expand current slide to full size and fadeIn real content
                        real_excerpt.stop().animate({opacity:options.fontOpacity},options.animationSpeed, options.easing);
						slide_heading.stop().animate({opacity:options.fontOpacity},options.animationSpeed, options.easing);
                        cloned_heading.stop().animate({opacity:0},options.animationSpeed, options.easing);
                        
                        this_slide.stop().animate({ width: expand_slide + (overlay_modifier * 1.2), 
                                                    left: objData.pos_active_higher},
                                                    options.animationSpeed, options.easing);
                                            
                        //set and all other slides to small size
                        slides.each(function(j){
                        
                            if (i !== j)
                            {   
                                var this_slide = $(this),
                                    real_excerpt = this_slide.find('.position_excerpt'),
									slide_heading = this_slide.find('.sliderheading'),
                                    cloned_heading = this_slide.find('.heading_clone'),
                                    objData = this_slide.data( 'data' ),
                                    new_pos = objData.pos_active_higher;
                                    
                                if(i < j) { new_pos = objData.pos_active_lower; }
                                this_slide.stop().animate({left: new_pos, width:minimized_slide + overlay_modifier},options.animationSpeed, options.easing);
                                real_excerpt.stop().animate({opacity:0},options.animationSpeed, options.easing);
								slide_heading.stop().animate({opacity:0},options.animationSpeed, options.easing);
                                cloned_heading.stop().animate({opacity:options.fontOpacity},options.animationSpeed, options.easing);
                            }
                        
                        });
                        
                    });
                });
                
                
                //set mouseout event: expand all slides to no-slide-active position and width
                slideWrapper.bind('mouseleave', function()
                {
                    slides.each(function(i)
                    {
                        var this_slide = $(this),
                            real_excerpt = this_slide.find('.position_excerpt'),
							slide_heading = this_slide.find('.sliderheading'),
                            cloned_heading = this_slide.find('.heading_clone'),
                            objData = this_slide.data( 'data' ),
                            new_pos = objData.this_slides_position;
                            
                            this_slide.stop().animate({left: new_pos, width:slide_width + overlay_modifier},options.animationSpeed, options.easing);
                            real_excerpt.stop().animate({opacity:0},options.animationSpeed, options.easing);
							slide_heading.stop().animate({opacity:0},options.animationSpeed, options.easing);
                            cloned_heading.stop().animate({opacity:options.fontOpacity},options.animationSpeed, options.easing);
                    });
                    
                });
            }
            
            
            // autorotation function for the image slider
            function autorotation()
            {   
                if(slide_count  == current_slide)
                {
                    slideWrapper.trigger('mouseleave');
                    current_slide = 0;
                }
                else
                {
                    slides.filter(':eq('+current_slide+')').trigger(options.event,[true]);
                    current_slide ++;
                }
            }
        });
    };
})(jQuery);
// -------------------------------------------------------------------------------------------
// END KRICORDION
// -------------------------------------------------------------------------------------------