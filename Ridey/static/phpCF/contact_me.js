$(function() {

    $("#nameCF,#emailCF,#messageCF").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("#nameCF").val();
            var email = $("#emailCF").val();
            //var about = $("input#phone").val();
            var message = $("#messageCF").val();

            if (message.trim()=="" || message.trim()=="Your message") {
                alert("Моля, въведете съобщение.");
                return;
            }

            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: "/static/phpCF/contact_me.php",
                type: "POST",
                data: {
                    name: name,
                    //about: about,
                    email: email,
                    message: message
                },
                cache: false,
                success: function() {
                    // Success message
                    alert("Съобщението беше изпратено успешно. Благодарим Ви.");
                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
                error: function() {
                    // Fail message
                    alert("Възникна грешка. Моля, уведомете екип поддръжка на support@ridey.bg");
                    $('#contactForm').trigger("reset");
                },
            })
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
