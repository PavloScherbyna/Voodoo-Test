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

// Функція для додавання продукту до кошика
function addToCart(productName, productPrice) {
    // Перевірте, чи такий продукт вже є у кошику
    const existingProduct = cart.items.find(item => item.name === productName);

    if (existingProduct) {
        // Якщо продукт вже є у кошику, збільште його кількість
        existingProduct.quantity += 1;
    } else {
        // Якщо продукта немає у кошику, додайте його
        cart.items.push({
            name: productName,
            price: productPrice,
            quantity: 1,
        });
    }

    // Оновіть відображення кошика і обчисліть загальну суму
    updateCartDisplay();
    calculateTotal();
}

// Функція для оновлення відображення кошика
function updateCartDisplay() {
    const cartContainer = document.querySelector('.basket_content .product');

    // Очистіть контейнер кошика
    cartContainer.innerHTML = '';

    // Додайте продукти з кошика до відображення
    cart.items.forEach(item => {
        const productElement = document.createElement('div');
        productElement.className = 'product_information';
        productElement.innerHTML = `
            <p>${item.name}</p>
            <p>${item.quantity} x ${item.price} KR.</p>
        `;

        cartContainer.appendChild(productElement);
    });
}

// Функція для обчислення загальної суми
function calculateTotal() {
    cart.total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Оновіть відображення загальної суми
    const totalElement = document.querySelector('.total_sum p:last-child');
    totalElement.textContent = `${cart.total} KR.`;
}

// Додаємо обробник подій для кнопки "ADD TO CART" для кожного продукту
const addToCartButtons = document.querySelectorAll('.card_to_busket');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Отримайте інформацію про продукт, на який натиснули
        const productCard = button.closest('.product_card');
        const productName = productCard.querySelector('.product_name p').textContent;

        // Отримайте ціну продукту та перетворіть її на числовий формат
        const productPriceText = productCard.querySelector('.condition p').textContent;
        const productPrice = parseFloat(productPriceText);

        // Додайте продукт до кошика
        addToCart(productName, productPrice);
    });
});
