var errorCode = $('.l-errwrap').html();
var regQTY = /^[1-9][0-9]*$/;

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
        var vv = value.vehicle;

        $('.c-basket__item').find('.l-errwrap').html('');
        $('.c-basket__item').first().clone().appendTo('.l-items');
        $('.item__picture').last().attr('src', value.imgUrl);
        $('.db-header').last().text(value.pName);
        $('.db-id').last().text(value.id);
        $('.db-vehicle').last().text(vv.year + ' ' + vv.make + ' ' + vv.model + ' ' + vv.name + ' ' + vv.option);
        $('.db-style').last().text(value.sizeStyle);
        $('.db-price').last().text(value.pPrice);
        $('.db-total').text(0);
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
    console.log('Спасибо за покупку!')
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
    var validQTY = regQTY.test(amount);

    if (validQTY) {
        removeError(t);
        return validQTY;
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