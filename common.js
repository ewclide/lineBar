document.addEventListener("DOMContentLoaded", function() {

    $('.someclass').linebar({
        min : 0,
        max : 20000,
        from : 3000,
        to : 10000,
        onchange : function(data)
        {
        	console.log(data)
        },
        onclick : function(data)
        {
        	console.log(data)
        }
    });

});