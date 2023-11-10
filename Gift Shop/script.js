document.addEventListener("DOMContentLoaded", function () {
    let cartIcon = document.querySelector("#cart-icon");
    let cart = document.querySelector(".cart");
    let closeCart = document.querySelector("#close-cart");

    cartIcon.onclick = () => {
        cart.classList.add("active");
    };

    closeCart.onclick = () => {
        cart.classList.remove("active");
    };

    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        ready();
    }

    function ready() {
        var removeCartButtons = document.getElementsByClassName('cart-remove');
        for (var i = 0; i < removeCartButtons.length; i++) {
            var button = removeCartButtons[i];
            button.addEventListener("click", removeCartItem);
        }
        var quantityInputs = document.getElementsByClassName('cart-quantity');
        for (var i = 0; i < quantityInputs.length; i++) {
            var input = quantityInputs[i];
            input.addEventListener("change", quantityChanged);
        }
        var addCart = document.getElementsByClassName('add-to-cart-button');
        for (var i = 0; i < addCart.length; i++) {
            var button = addCart[i];
            button.addEventListener('click', addCartClicked);
        }
        document
            .getElementsByClassName('btn-buy')[0]
            .addEventListener('click', buyButtonClicked);
    }

    function buyButtonClicked() {
        alert("Your Order is Placed");
        var cartContent = document.getElementsByClassName('cart-content')[0];
        while (cartContent.hasChildNodes()) {
            cartContent.removeChild(cartContent.firstChild);
        }
        updatetotal();
    }

    function removeCartItem(event) {
        var buttonClicked = event.target;
        buttonClicked.parentElement.remove();
        updatetotal();
    }

    function quantityChanged(event) {
        var input = event.target;
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1;
        }
        updatetotal();
    }

    function addCartClicked(event) {
        var button = event.target;
        var shopProducts = button.parentElement;
        var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
        var price = shopProducts.getElementsByClassName("price")[0].innerText;
        var productImg = shopProducts.getElementsByClassName("product-img")[0].src;

        addProductToCart(title, price, productImg);
    }

    function addProductToCart(title, price, productImg) {
        var cartContent = document.getElementsByClassName('cart-content')[0];
        var cartItems = cartContent.getElementsByClassName('cart-box');

        for (var i = 0; i < cartItems.length; i++) {
            var cartItem = cartItems[i];
            var cartItemTitle = cartItem.querySelector('.cart-product-title');

            if (cartItemTitle && cartItemTitle.innerText === title) {
                var quantityInput = cartItem.querySelector('.cart-quantity');
                var currentQuantity = parseInt(quantityInput.value);
                quantityInput.value = currentQuantity + 1;
                updatetotal();
                cart.classList.add("active"); // Display the cart
                return;
            }
        }

        var cartShopBox = document.createElement("div");
        cartShopBox.classList.add("cart-box");

        var cartBoxContent = `
            <img src="${productImg}" alt="" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${title}</div>
                <div class="cart-price">${price}</div>
                <input type="number" value="1" class="cart-quantity">
            </div>
            <i class='bx bxs-trash-alt cart-remove'></i>`;

        cartShopBox.innerHTML = cartBoxContent;
        cartContent.append(cartShopBox);

        cartShopBox
            .getElementsByClassName("cart-remove")[0]
            .addEventListener('click', removeCartItem);
        cartShopBox
            .getElementsByClassName("cart-quantity")[0]
            .addEventListener('change', quantityChanged);

        updatetotal();

        cart.classList.add("active"); // Display the cart
    }

    function updatetotal() {
        var cartContent = document.getElementsByClassName('cart-content')[0];
        var cartBoxes = cartContent.getElementsByClassName('cart-box');
        var total = 0;
        for (var i = 0; i < cartBoxes.length; i++) {
            var cartBox = cartBoxes[i];
            var priceElement = cartBox.getElementsByClassName('cart-price')[0];
            var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
            var price = parseFloat(priceElement.innerText.replace("$", ""));
            var quantity = quantityElement.value;
            total = total + (price * quantity);

            total = Math.round(total * 100) / 100;
        }

        document.getElementsByClassName('total-price')[0].innerText = "$" + total;
    }
});