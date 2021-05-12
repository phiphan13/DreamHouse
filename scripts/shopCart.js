var removeButtons = document.getElementsByClassName('btn-danger')
for (var i = 0; i < removeButtons.length; i++) 
    {
        var button = removeButtons[i]
        button.addEventListener('click', removeItem)
    }

var quantity = document.getElementsByClassName('cartInput')
for (var i = 0; i < quantity.length; i++) 
    {
        var input = quantity[i]
        input.addEventListener('change', quantityChanged)
    }
document.getElementsByClassName('btnPurchase')[0].addEventListener('click', purchaseButton)


function purchaseButton() 
{
    alert('Thank you for your purchase')
    var cartItems = document.getElementsByClassName('items')[0]
    while (cartItems.hasChildNodes()) 
    {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeItem(event) 
{
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) 
{
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) 
    {
        input.value = 1
    }
    updateCartTotal()
}

function updateCartTotal() 
{
    var cartItemContainer = document.getElementsByClassName('items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cartRow')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('price')[0]
        var quantityElement = cartRow.getElementsByClassName('cartInput')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('totalPrice')[0].innerText = '$' + total
}