// Находим элементы на странице
const form = document.querySelector('#form');
const itemsList = document.querySelector('#itemsList');

const itemId = document.querySelector('#itemId');
const itemPrice = document.querySelector('#itemPrice');
const deliveryAmount = document.querySelector('#deliveryAmount');
const hasVatt = document.querySelector('#hasVatt');
const courierPrice = document.querySelector('#courierPrice');
const overprice = document.querySelector('#overprice');
const prepayment = document.querySelector('#prepayment');
const quantity = document.querySelector('#itemCount');

tg_bot_token = "5845617734:AAEbswdoRIrTog8qL-q4U37vmWUl9ob-V0M";
chat_id = "-701417081";

class Item {
    constructor(id, price, quantity, delivery, vatt, courier, overpice, prepayment) {
      this.id = id;
      this.price = price;
      this.quantity = quantity;
      this.delivery = delivery;
      this.vatt = vatt;
      this.courier = courier;
      this.overpice = overpice;
      this.prepayment = prepayment;
    }
}

// Удалить задачу
itemsList.addEventListener('click', deleteItem)

function addItem() {
    event.preventDefault();
    location.href = "newItem.html";
}

function goBackToIndex() {
    event.preventDefault();
    location.href = "index.html";
}

function onLoadIndexPage()
{
    let items = JSON.parse(sessionStorage.getItem("items"));
    console.log(items);

    items.forEach(function(item, i, arr) {
        let itemText = item.quantity + " шт. по " + item.price + " zł шип: " + item.delivery + " zł ваты: " + item.vatt + " перевоз: " 
            + item.courier + "$ наценка: " + item.overpice + "$";

        const taskHTML = `		
        <li class="list-group-item d-flex justify-content-between task-item">
            <span class="task-title" align-left>${'#' + item.id}</span>
            <span class="task-description">${itemText}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`;

        // add item to page
        itemsList.insertAdjacentHTML('beforeend', taskHTML);
    });
}

function addToOrder() {
    event.preventDefault();

    if (itemId.value == 0) {
        alert('Задайте номер заказа');
        return;
    }

    if (itemPrice.value == 0) {
        alert('Задайте цену товара');
        return;
    }

    if (courierPrice.value == 0) {
        alert('Задайте цену перевозщика');
        return;
    }

    if (quantity.value > 50 || quantity.value < 1) {
        alert('Количество не может быть меньше 1 или больше 50');
        return;
    }

    let item = new Item(itemId.value
        , itemPrice.value
        , quantity.value
        , deliveryAmount.value
        , hasVatt.checked
        , courierPrice.value
        , overprice.value
        , prepayment.value);

    var items = [];
    items = JSON.parse(sessionStorage.getItem('items')) || [];
    items.push(item);
    sessionStorage.setItem('items', JSON.stringify(items));
    location.href = "index.html";
}

function sendOrder() {
    event.preventDefault();
    let items = JSON.parse(sessionStorage.getItem("items"));
    const zlToUsd = 0.2247;
    let pricesText = "";
    let kateText = "";

    items.forEach(function(item, i, arr) {
        let currentPrice = zlToUsd * (Number(item.price) * Number(item.quantity) + Number(item.delivery));
        
        if (item.vatt)
            currentPrice = Number(currentPrice) * 0.87;
        else
            currentPrice = Number(currentPrice) * 1.07;

        let inBelarus = currentPrice + Number(item.courier);
        let overprice = inBelarus + Number(item.overpice);
        let withDiscount = inBelarus + Number(item.overpice * 0.9);
        let prepaymentAmount = Number(item.prepayment) / 100 * Number(withDiscount);

        let currentItem = "1. #" + item.id + "\n" +
                          "2. Беларусь: " + parseFloat(inBelarus).toFixed(1) + " USD\n" + 
                          "3. Наценка: " + parseFloat(overprice).toFixed(1) + " USD\n" +
                          "4. Скидка: " + parseFloat(withDiscount).toFixed(1) + " USD\n" +
                          "5. Предоплата: " + parseFloat(prepaymentAmount).toFixed(1) + " USD " + "(" + item.prepayment + " %)\n\n";

        let currentItemKate = "Стоимость с учетом доставки составляет " + parseFloat(overprice).toFixed(1) + "$" + " + ваша скидка за подписку 10% на наши услуги ДОСТАВКИ🚚\n\nИТОГО: " +
            parseFloat(withDiscount).toFixed(1) + "$\n\n";
        
        pricesText += currentItem;
        kateText += currentItemKate;
    });

    sendMessageToBot(pricesText);
    sendMessageToBot(kateText);

    alert('Заказ отправлен');
}

function sendMessageToBot(text){
        var z=$.ajax({  
        type: "POST",  
        url: "https://api.telegram.org/bot"+ tg_bot_token + "/sendMessage?chat_id=" + chat_id,
        data: "parse_mode=HTML&text=" + encodeURIComponent(text), 
    }); 
};

function deleteItem(event) {
    if (event.target.dataset.action === 'delete') {
        const parentNode = event.target.closest('.list-group-item');

        let itemId = parentNode.firstElementChild.innerText.substring(1);
       
        // delete form sessionStorage

        // 1. get array from sesstion storage
        var items = [];
        items = JSON.parse(sessionStorage.getItem('items')) || [];

        // 2. delete element by itemId
        items = items.filter(item => item.id !== itemId);

        // 3. push array back
        sessionStorage.setItem('items', JSON.stringify(items));

        // delete html tag
        parentNode.remove();
    }
}