var errorCode = $('.l-errwrap').html(),
    regQTY = /^[1-9][0-9]*$/;

$.getJSON("http://localhost:8080/data/data.json", loadData).fail(errorData);

function loadData(data) {
    drawHeader(data);
    drawItems(data);
}

function drawHeader(data) {
    var year = data.searchVehicle.year,
        make = data.searchVehicle.make,
        model = data.searchVehicle.model,
        name = data.searchVehicle.name,
        option = data.searchVehicle.option;

    $('.header__text').text(year + ' ' + make + ' ' + model + ' ' + name + ' ' + option);
}

function drawItems(data) {
    $.each(data.products, function(key, value) {
        var vv = value.vehicle,
            sum = value.totalProduct.stock + value.totalProduct.sklad;

        $('.c-basket__item').first().clone().appendTo('.l-items');
        $('.l-errwrap').last().html('');
        $('.item__picture').last().attr('src', value.imgUrl);
        $('.db-header').last().text(value.pName);
        $('.db-id').last().text(value.id);
        $('.db-vehicle').last().text(vv.year + ' ' + vv.make + ' ' + vv.model + ' ' + vv.name + ' ' + vv.option);
        $('.db-style').last().text(value.sizeStyle);
        $('.db-price').last().text(value.pPrice);
        $('.db-total').last().text(value.pPrice);

        if (sum === 0) {
            $('.db-total').last().text(0);
            $('.qty__input').last().attr('disabled', 'disabled');
            $('.l-errwrap').last().html(errorCode);
            $('.error__text').last().text('The product out of stock');
        } else {
            $('.data__qty').last().data({'sum': sum, 'storeOnly': value.isInStoreOnly});
        }
    });

    $('.c-basket__item').first().remove();
}

function errorData() {
    $('.c-basket').html('<p class="unavailable">Services unavailable</p>');
}

$('body')
    .on('click', '.item__close', confirmRemove)
    .on('keyup', '.qty__input', calculate)
    .on('click', '.qty__update', calculate);

$('.c-basket__button').on('click', function() {
    var arr = [];

    $('.db-total').each(function() {
        var storeOnly = $(this).parent().parent().data()['storeOnly'];
        var total = $(this).text();

        if (total > 1 && storeOnly === false) {
            arr.push(total);
        }
    });

    if (arr.length > 0) {
        var checkout = 0;

        for(var i = 0; i < arr.length; i++){
            checkout += +arr[i];
        }

        console.log('Thank you for buying! Checkout sum: ' + checkout + '$');
    } else {
        console.log('Your basket is empty now');
    }

});

function confirmRemove() {
    if (confirm('Are you sure you want to remove this item?')) {
        $(this).parent().parent().remove();
    }
}

function calculate() {
    var price = $(this).parent().parent().find('.db-price').text(),
        amount = $(this).parent().find('.qty__input').val();

    if ( validate(amount, this) ) {
        $(this).parent().find('.db-total').text(+amount * +price);
    } else {
        $(this).parent().find('.db-total').text(0);
    }
}

function validate(amount, t) {
    var sum = $(t).parent().data()['sum'];
    var validQTY = regQTY.test(amount);

    if (validQTY) {
        if (amount <= sum) {
            removeError(t);
            return true;
        } else {
            drawError('Sorry, the maximum quantity you can order is ' + sum, t);
        }
    } else {
        drawError('Please set proper quantity', t);
    }
}

function drawError(err, t) {
    $(t).addClass("error").parent().parent().parent().find('.l-errwrap').html(errorCode);
    $(t).parent().parent().parent().find('.error__text').text(err);
}

function removeError(t) {
    $(t).removeClass("error").parent().parent().parent().find('.l-errwrap').html('');
}