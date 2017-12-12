var array = [];
var i=1;
var j =1;


$(document).ready(function(){ //to prevent any jQuery code from running before the document is finished loading (is ready).


    $('#Phone').keyup( function () {
        this.value = this.value.replace(/[^0-9\.]/g,'');
    });

    $('input').keyup( function () {
        if(this.value) {
            $(this).removeClass('required');
            $(this).removeClass('tooltip');
        }
    });



    //adding additional orders
    $(".add-row").click(function(){
        var data = {
            OrderNumber: j,
            Name : $("#name").val(),
            Address : $("#Address").val(),
            Phone : $("#Phone").val(),
            FrameType : $("#Frame-Type").val(),
            FrameColour : $("#Frame-Colour").val(),
            KeyboardType : $("#keyboard-type").val(),
            KeyboardColour : $("#Keyboard-Colour").val(),
            ScreenType : $("#Screen-Type").val(),
            ScreenColour : $("#Screen-Colour").val(),
            Quantity : $("#quantity").val(),
        }

        //preview markup table
        var markup = "<tr><td><input type='checkbox' name='record'></td><td>" + data.OrderNumber +
            "</td><td>" + data.Name +
            "</td><td>" + data.FrameType +
            "</td><td>" + data.FrameColour +
            "</td><td>" + data.KeyboardType +
            "</td><td>" + data.KeyboardColour +
            "</td><td>" + data.ScreenType +
            "</td><td>" + data.ScreenColour +
            "</td><td>" + data.Quantity +
            "</td></tr>";


        if(data.Name && data.Address && data.Phone) {
            array.push(data);
        }


        //Form Validation
        if ($("#Name").val()!="" && $("#Address").val()!="" && $("#Phone").val()!="") {
            $("table tbody").append(markup);
            $("#name").val("");
            $("#Address").val("");
            $("#Phone").val("");
            $("#name").attr("placeholder", "Enter your full name");
            $("#Address").attr("placeholder", "your Address Here");
            $("#Phone").attr("placeholder", "Your Phone Number");
            j++;
        }
        else{

            if ($("#Name").val()==="") { $("#Name").addClass('required');
                $("#Name").attr("placeholder", "Required field");
                $("#Name").addClass('tooltip');
            }
            if ($("#Address").val()==="") { $("#Address").addClass('required');
                $("#Address").attr("placeholder", "Required field");
                $("#Address").addClass('tooltip');
            }
            if ($("#Phone").val()==="") { $("#Phone").addClass('required');
                $("#Phone").attr("placeholder", "Required field");
                $("#Phone").addClass('tooltip');
            }
        }



    });

        //sending the order using AJAX
    $(".send-server").click (function(){

        var makeAjaxCall = function (url, success_callback) {
            $.ajax ({
                type: 'POST',
                url: url,
                data: {data : array },
                success: success_callback
            });
        };

        makeAjaxCall(
            'http://127.0.0.1:8000/updateOrder', //SENDS DATA TO THE ORDER CLASS(CREATES ORDER OBJECT AND UPDATES KB)
            makeAjaxCall(
                'http://127.0.0.1:4500', // to the Gateway
                function() {

                }
            )
        );

        array= [];
        console.log(array)


    });

    // Find and remove selected orders
    $(".delete-row").click(function(){
        $("table tbody").find('input[name="record"]').each(function(i){

            if($(this).is(":checked")){
                j--
                $(this).parents("tr").remove();
                array[i].deleted = true;
            }
        });

        array = array.filter( function(data, i){
            return !data.deleted;

        })


    });
});