/* Custom scripts for Thrive Creative Template */
/* Developed by Rype Pixel                     */
/* hello@rypepixel.com                         */
/* Created: 12/14/2013                         */
/* Author: Chris Gipple                        */


//thumbnail hover (full width)
$('.image').mouseover(function()
{
    $(".overlay", this).stop(true, true).fadeIn();
}); 

$('.image').mouseout(function()
{
    $(".overlay", this).stop(true, true).fadeOut();
}); 

//thumbnail hover (column)
$('.portfolioItem').mouseover(function()
{
    $(".overlay", this).stop(true, true).fadeIn();
}); 

$('.portfolioItem').mouseout(function()
{
    $(".overlay", this).stop(true, true).fadeOut();
});

//thumbnail hover shop
$('.shopItem').mouseover(function()
{
    $(".overlay", this).stop(true, true).fadeIn();
}); 

$('.shopItem').mouseout(function()
{
    $(".overlay", this).stop(true, true).fadeOut();
});


//blog creative video post -- hide date on hover
$('.blogPostCreative .blogThumb.hideDate').mouseover(function()
{
    $(".date", this).css('display', 'none');
}); 

$('.blogPostCreative .blogThumb.hideDate').mouseout(function()
{
    $(".date", this).css('display', 'block');
});

//accordian
$('.accordianTab').click(function()
{
	var display = $(this).find('.accordianContent').css('display');

	$(this).find('.accordianContent').slideToggle();

	if ( display == 'none') {
		$(this).find('.accordianLink').css('background-image', 'url(images/minusIcon.png)');
	} 
	else if ( display == 'block') {
		$(this).find('.accordianLink').css('background-image', 'url(images/plusIcon.png)');
	}

});

//checkbox toggle
$('#same-address').click(function () {
    $("#shippingForm").toggle(!this.checked);
});