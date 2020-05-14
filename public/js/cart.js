
let cart = document.querySelector('.order-nav');
let cartInfo = document.querySelector('#cart-info');

cart.onclick = function () {
    if (cartInfo.style.display != 'initial'){
        cartInfo.style.display = 'initial';
    } else {
        cartInfo.style.display = 'none';
    }
}


let totalCostElement = document.querySelector('.order-nav');
let totalCostInt = parseInt(document.querySelector('.order-nav').innerHTML);
let itemsList = document.querySelectorAll('.cart-product-item');

itemsList.forEach((element) => {

    //Добавить товар
    element.querySelector('.plus-item').onclick = function () {

        let oneItemPrice = parseInt(element.querySelector('.one-item-price').value);
        let itemsQtyElement = element.querySelector('.qty');
        let itemsQty = parseInt(itemsQtyElement.innerHTML);

        itemsQty += 1;
        totalCostInt += oneItemPrice;

        itemsQtyElement.innerHTML = itemsQty + "";
        totalCostElement.innerHTML = totalCostInt + "₽";
    }

    //убрать товар
    element.querySelector('.minus-item').onclick = function () {

        let oneItemPrice = parseInt(element.querySelector('.one-item-price').value);
        let itemsQtyElement = element.querySelector('.qty');
        let itemsQty = parseInt(itemsQtyElement.innerHTML);

        if (itemsQty > 1){
            itemsQty -= 1;
            totalCostInt -= oneItemPrice;

            itemsQtyElement.innerHTML = itemsQty + "";
            totalCostElement.innerHTML = totalCostInt + "₽";
        }
    }

    //Удалить товар
    element.querySelector('.remove-img').onclick = function () {
        let oneItemPrice = parseInt(element.querySelector('.one-item-price').value);
        let itemsQty = parseInt(element.querySelector('.qty').innerHTML);
        let itemsPrice = oneItemPrice * itemsQty;

        totalCostInt -= itemsPrice;
        totalCostElement.innerHTML = totalCostInt + "₽";

        element.innerHTML = "";
    }
})
