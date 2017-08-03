//↓~~~~~~~~~RegExp Declaring~~~~~~~~~↓

var regQTY = /^[1-9][0-9]*$/;

//↓~~~~~~~~~Error Code~~~~~~~~~↓

var errorCode = '<div class="item__error"><span class="error__symbol">⚠</span><div class="error__line"></div><p class="error__text"></p></div>';

//↓~~~~~~~~~Data Request and Rendering~~~~~~~~~↓

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
        option = data.searchVehicle.option,
        headerText = year + ' ' + make + ' ' + model + ' ' + name + ' ' + option;

    $('.header__text').text(headerText);
}

function drawItems(data) {
    $.each(data.products, function(key, value) {
        var vv = value.vehicle,
            vehicle = vv.year + ' ' + vv.make + ' ' + vv.model + ' ' + vv.name + ' ' + vv.option,
            sum = value.totalProduct.stock + value.totalProduct.sklad,
            itemCode = '<div class="c-basket__item"><div class="l-err-wrap"></div><img class="item__picture" src="' + value.imgUrl + '"><div class="item__data"><input class="item__close" type="button" value="˟"><h4 class="data__header"><span class="db-header">' + value.pName + '</span></h4><p class="data__id">Product <span class="db-id">' + value.id + '</span></p><p class="data__vehicle"><b>Vehicle:</b><span class="db-vehicle">' + vehicle + '</span></p><p class="data__other"><b>Size/Style:</b><span class="db-style">' + value.sizeStyle + '</span><b class="other__price">$<span class="db-price">' + value.pPrice + '</span></b></p><p class="data__qty"><b>QTY:</b><input class="qty__input" value="1" ><input class="qty__update" type="button" value="Update"><b class="qty__total">TOTAL:$<span class="db-total">' + value.pPrice + '</span></b></p></div>';

        $(itemCode).appendTo('.l-items');

        if (sum === 0) {
            drawOOSError();
        } else {
            $('.data__qty').last().data({'sum': sum, 'storeOnly': value.isInStoreOnly});
        }
    });
}

//↓~~~~~~~~~Events Declaration~~~~~~~~~↓

$('body')
    .on('click', '.item__close', confirmRemove)
    .on('keyup', '.qty__input', calculate)
    .on('click', '.qty__update', calculate)
    .on('click', '.c-basket__button', checkout);

//↓~~~~~~~~~Calculation and Validation~~~~~~~~~↓

function calculate() {
    var price = parseInt($(this).parent().parent().find('.db-price').text()),
        amount = $(this).parent().find('.qty__input').val();

    if ( valid(amount, this) ) {
        $(this).parent().find('.db-total').text(amount * price);
    } else {
        $(this).parent().find('.db-total').text(0);
    }
}

function valid(amount, context) {
    var sum = $(context).parent().data()['sum'],
        validQTY = regQTY.test(amount);

    if (validQTY) {
        if (amount <= sum) {
            removeError(context);

            return true;
        } else {
            drawError('Sorry, the maximum quantity you can order is ' + sum, context);
        }
    } else {
        drawError('Please set proper quantity', context);
    }
}

function checkout() {
    var selectedItems = [];

    $('.db-total').each(function() {
        var storeOnly = $(this).parent().parent().data()['storeOnly'],
            total = $(this).text();

        if (total > 1 && storeOnly === false) {
            selectedItems.push(total);
        }
    });

    if (selectedItems.length > 0) {
        var checkout = 0,
            i;

        for(i = 0; i < selectedItems.length; i++){
            checkout += parseInt(selectedItems[i]);
        }

        alert('Thank you for buying! Checkout sum: ' + checkout + '$');
    } else {
        alert('Your basket is empty now');
    }
}

//↓~~~~~~~~~Errors Handling~~~~~~~~~↓

function errorData() {
    $('.c-basket').html('<p class="unavailable">Services unavailable</p>');
}

function drawError(err, context) {
    $(context).addClass("error")
        .parent().parent().parent()
        .find('.l-err-wrap').html(errorCode)
        .find('.error__text').text(err);
}

function removeError(context) {
    $(context).removeClass("error")
        .parent().parent().parent()
        .find('.l-err-wrap').html('');
}

function drawOOSError() {
    $('.db-total').last().text(0);
    $('.qty__input').last().attr('disabled', 'disabled');
    $('.l-err-wrap').last().html(errorCode);
    $('.error__text').last().text('The product out of stock');
}

//↓~~~~~~~~~Additional Handling~~~~~~~~~↓

function confirmRemove() {
    if (confirm('Are you sure you want to remove this item?')) {
        $(this).parent().parent().remove();
    }
}