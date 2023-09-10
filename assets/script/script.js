let activePageButton = null;
const customSelect = document.querySelector('.custom_select');
const sircleSelect = document.querySelector('.sircle_select');
const options = document.getElementById('options');

customSelect.addEventListener('click', () => {
    const isOptionsVisible = options.style.display === 'block';

    options.style.display = isOptionsVisible ? 'none' : 'block';
    sircleSelect.style.transform = isOptionsVisible ? 'rotate(0deg)' : 'rotate(180deg)';

    options.style.transition = 'display 0.3s ease-in-out';
    sircleSelect.style.transition = 'transform 0.3s ease-in-out';
});

let currentPage = 1;
const itemsPerPage = 12; 
const totalItems = 461; 


async function fetchAndFillProductCards(page) {
    try {
        const response = await fetch(`https://voodoo-sandbox.myshopify.com/products.json?limit=${itemsPerPage}&page=${page}`);
        const data = await response.json();
        const products = data.products;

        const productWrapper = document.querySelector('.product_wrapper');

        productWrapper.innerHTML = '';

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product_card';

            const cardImage = document.createElement('div');
            cardImage.className = 'card_image';
            cardImage.innerHTML = '<p>Used</p>';

            const cardInfo = document.createElement('div');
            cardInfo.className = 'card_info';

            const productName = document.createElement('div');
            productName.className = 'product_name';

            // Форматуємо ціну
            const productPriceText = product.variants[0]?.price || '0.00';
            const formattedPrice = formatPrice(productPriceText);

            productName.innerHTML = `<p>${product.title}</p><p>${formattedPrice} KR.</p>`;

            const condition = document.createElement('div');
            condition.className = 'condition';
            condition.innerHTML = '<p>Slightly used</p>';

            const addToCartButton = document.createElement('button');
            addToCartButton.className = 'card_to_busket';
            addToCartButton.textContent = 'ADD TO CART';

            // Додамо обробник події для кнопки "ADD TO CART"
            addToCartButton.addEventListener('click', () => {
                // Отримуємо інформацію про продукт, на який натиснули
                const productName = product.title;

                // Отримуємо ціну продукту та перетворюємо її на числовий формат (з заміною коми на крапку)
                const productPriceText = product.variants[0]?.price || '0.00';
                const productPrice = parseFloat(productPriceText.replace(',', '.'));

                // Додавання товару до кошика
                addToCart(productName, productPrice);
            });

            cardInfo.appendChild(productName);
            cardInfo.appendChild(condition);

            productCard.appendChild(cardImage);
            productCard.appendChild(cardInfo);
            productCard.appendChild(addToCartButton);

            productWrapper.appendChild(productCard);
        });
    } catch (error) {
        console.error('Помилка при отриманні даних з API:', error);
    }
}

// Залиште решту коду незмінним

fetchAndFillProductCards(currentPage);

// Функція для форматування ціни
function formatPrice(price) {
    const formattedPrice = parseFloat(price).toFixed(2);
    return formattedPrice.replace('.', ' ').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}





// Функція для створення нумерації сторінок
function createPaginationButtons() {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; 

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const visiblePages = 5; 

    let startPage = currentPage - Math.floor(visiblePages / 2);
    startPage = Math.max(startPage, 1); 

    let endPage = startPage + visiblePages - 1;
    endPage = Math.min(endPage, totalPages); 

    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';
        firstPageButton.className = 'page_number';

        firstPageButton.addEventListener('click', () => goToPage(1));

        paginationContainer.appendChild(firstPageButton);

        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page_number';

        pageButton.addEventListener('click', () => goToPage(i));

        paginationContainer.appendChild(pageButton);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }

        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = totalPages;
        lastPageButton.className = 'page_number';

        lastPageButton.addEventListener('click', () => goToPage(totalPages));

        paginationContainer.appendChild(lastPageButton);
    }

    updateActivePageStyle();
}

function updateActivePageStyle() {
    const pageButtons = document.querySelectorAll('.page_number');

    pageButtons.forEach(button => {
        button.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        button.style.color = 'black';
    });

    const activeButton = document.querySelector(`.page_number[data-page="${currentPage}"]`);
    if (activeButton) {
        activeButton.style.backgroundColor = 'black';
        activeButton.style.color = 'white';
    }
}


// Функція для переходу на вибрану сторінку
function goToPage(pageNumber) {
    currentPage = pageNumber; 
    createPaginationButtons();
    fetchAndFillProductCards(currentPage);
}

// Початкова ініціалізація
createPaginationButtons();
fetchAndFillProductCards(currentPage); // Функція для запиту і відображення даних на початковій сторінці

// Отримуємо всі кнопки сторінок
const pageButtons = document.querySelectorAll('.page_number');

// Функція для зміни стилю при кліку на кнопку
function changeButtonStyle(event) {
    // Змінюємо стиль всіх кнопок на стандартний (неактивний)
    pageButtons.forEach(button => {
        button.classList.remove('active');
        button.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        button.style.color = 'black';
    });

    // Змінюємо стиль клікнутої кнопки (робимо її активною)
    event.target.classList.add('active');
    event.target.style.backgroundColor = 'black';
    event.target.style.color = 'white';
}

// Додаємо обробник кліку до кожної кнопки
pageButtons.forEach(button => {
    button.addEventListener('click', changeButtonStyle);
});





// Отримуємо посилання на елементи
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const basket = document.getElementById('basket');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

// Додаємо обробник подій для відкриття кошика
cartToggle.addEventListener('click', () => {
    basket.style.display = 'block'; // Показуємо кошик при кліку на корзину
    main.style.display = 'none'; // Приховуємо <main>
    footer.style.display = 'none'; // Приховуємо <footer>
});

// Додаємо обробник подій для закриття кошика
closeCart.addEventListener('click', () => {
    basket.style.display = 'none'; // Приховуємо кошик при кліку на закриття
    main.style.display = 'block'; // Відображаємо <main>
    footer.style.display = 'block'; // Відображаємо <footer>
});

const cart = {
    items: [], // Масив продуктів у кошику
    total: 0, // Загальна сума замовлення
};

function updateCartDisplay() {
    const cartContainer = document.querySelector('.basket_content .select_order');

    // Очистіть контейнер кошика
    cartContainer.innerHTML = '';

    // Додайте продукти з кошика до відображення
    cart.items.forEach(item => {
        createProductCard(item, cartContainer);
    });
}

function calculateTotal() {
    cart.total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Оновіть відображення загальної суми з округленням до двох знаків після коми
    const totalElement = document.querySelector('.total_sum p:last-child');
    totalElement.textContent = `${cart.total.toFixed(2)} KR.`;
}

// Функція для додавання продукту до кошика
function addToCart(productName, productPrice) {
    // Перевірте, чи такий продукт вже є у кошику
    const existingProduct = cart.items.find(item => item.name === productName);

    if (existingProduct) {
        // Якщо продукт вже є у кошику, збільште його кількість
        existingProduct.quantity += 1;
    } else {
        // Якщо продукта немає у кошику, додайте його
        const newProduct = {
            name: productName,
            price: productPrice,
            quantity: 1,
        };
        cart.items.push(newProduct);
    }

    // Оновіть відображення кошика і обчисліть загальну суму
    updateCartDisplay();
    calculateTotal();
}

// Функція для зменшення кількості продукту в кошику
function decreaseQuantity(productName) {
    const existingProduct = cart.items.find(item => item.name === productName);

    if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
    } else if (existingProduct && existingProduct.quantity === 1) {
        // Якщо кількість дорівнює 1, видаліть продукт з кошика
        const productIndex = cart.items.indexOf(existingProduct);
        if (productIndex !== -1) {
            cart.items.splice(productIndex, 1);
        }
    }

    // Оновіть відображення кошика і обчисліть загальну суму
    updateCartDisplay();
    calculateTotal();
}

// Функція для створення карточки товару
function createProductCard(product, cartContainer) {
    // Створюємо елементи для карточки товару
    const productCard = document.createElement('div');
    productCard.className = 'product';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image_contant';

    const productInfo = document.createElement('div');
    productInfo.className = 'product_information';
    productInfo.innerHTML = `
        <p>${product.name}</p>
        <p>${product.quantity} x ${product.price.toFixed(2)} KR.</p>
        <div class="correct_numerosity">
            <span class="subtract">-</span>${product.quantity}<span class="add">+</span>
        </div>
    `;

    const deleteIcon = document.createElement('div');
    deleteIcon.className = 'delete';
    deleteIcon.innerHTML = `<img src="assets/image/delete-bin-6-line.svg" alt="delete object" data-product-name="${product.name}">`;

    // Додаємо обробник подій для кнопок "+" та "-"
    const subtractButton = productInfo.querySelector('.subtract');
    const addButton = productInfo.querySelector('.add');

    subtractButton.addEventListener('click', () => {
        decreaseQuantity(product.name);
    });

    addButton.addEventListener('click', () => {
        addToCart(product.name, product.price);
    });

    // Додаємо обробник події для видалення продукту
    const deleteButton = deleteIcon.querySelector('img');
    deleteButton.addEventListener('click', (event) => {
        const productName = event.target.getAttribute('data-product-name');
        removeProduct(productName);
    });

    // Додаємо елементи до карточки товару
    productCard.appendChild(imageContainer);
    productCard.appendChild(productInfo);
    productCard.appendChild(deleteIcon);

    // Додаємо карточку товару до відображення кошика
    cartContainer.appendChild(productCard);
}

// Функція для видалення продукту з кошика
function removeProduct(productName) {
    const existingProduct = cart.items.find(item => item.name === productName);

    if (existingProduct) {
        const productIndex = cart.items.indexOf(existingProduct);
        if (productIndex !== -1) {
            cart.items.splice(productIndex, 1);
            updateCartDisplay();
            calculateTotal();
        }
    }
}

// Викликаємо функцію updateCartDisplay при завантаженні сторінки для відображення початкового вмісту кошика
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.basket_content .select_order');
    updateCartDisplay(cartContainer);
});
