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

 // Змінні для відстеження поточної сторінки та загальної кількості товарів
let currentPage = 1;
const itemsPerPage = 12; // Кількість товарів на сторінці
const totalItems = 461; // Загальна кількість товарів

// Функція для отримання списку продуктів з Shopify API та заповнення карточок товарів
async function fetchAndFillProductCards(page) {
    try {
        const response = await fetch(`https://voodoo-sandbox.myshopify.com/products.json?limit=${itemsPerPage}&page=${page}`);
        const data = await response.json();
        const products = data.products;

        const productWrapper = document.querySelector('.product_wrapper');

        // Очищаємо контейнер перед додаванням нових товарів
        productWrapper.innerHTML = '';

        products.forEach(product => {
            // Створення та заповнення карточок товарів, як раніше
            const productCard = document.createElement('div');
            productCard.className = 'product_card';

            const cardImage = document.createElement('div');
            cardImage.className = 'card_image';
            cardImage.innerHTML = '<p>Used</p>';

            const cardInfo = document.createElement('div');
            cardInfo.className = 'card_info';

            const productName = document.createElement('div');
            productName.className = 'product_name';
            productName.innerHTML = `<p>${product.title}</p><p>${product.variants[0].price} ${product.variants[0].price_min_currency}</p>`;

            const condition = document.createElement('div');
            condition.className = 'condition';
            condition.innerHTML = '<p>Slightly used</p>';

            const addToCartButton = document.createElement('button');
            addToCartButton.className = 'card_to_busket';
            addToCartButton.textContent = 'ADD TO CART';

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

// Функція для обробки кліків на кнопки "Наступна сторінка" та "Попередня сторінка"
function handlePaginationButtonClick(action) {
    if (action === 'next' && currentPage < Math.ceil(totalItems / itemsPerPage)) {
        // Перехід на наступну сторінку
        fetchAndFillProductCards(currentPage + 1);
    } else if (action === 'prev' && currentPage > 1) {
        // Перехід на попередню сторінку
        fetchAndFillProductCards(currentPage - 1);
    }
}

// Викликаємо функцію для заповнення карточок товарів на початку
fetchAndFillProductCards(currentPage);



// Функція для створення нумерації сторінок
function createPaginationButtons() {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; // Очищаємо контейнер перед додаванням номерів сторінок

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const visiblePages = 5; // Кількість видимих номерів сторінок

    let startPage = currentPage - Math.floor(visiblePages / 2);
    startPage = Math.max(startPage, 1); // Мінімум 1

    let endPage = startPage + visiblePages - 1;
    endPage = Math.min(endPage, totalPages); // Максимум загальна кількість сторінок

    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';
        firstPageButton.className = 'page_number';

        // Додаємо обробник кліку для номеру сторінки
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

        // Додаємо обробник кліку для номеру сторінки
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

        // Додаємо обробник кліку для номеру сторінки
        lastPageButton.addEventListener('click', () => goToPage(totalPages));

        paginationContainer.appendChild(lastPageButton);
    }

    // Оновлюємо стиль активної кнопки
    updateActivePageStyle();
}

// Функція для оновлення стилю активної кнопки
// Функція для оновлення стилю активної кнопки
function updateActivePageStyle() {
    const pageButtons = document.querySelectorAll('.page_number');

    // Оновлюємо стиль всіх кнопок
    pageButtons.forEach(button => {
        button.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        button.style.color = 'black';
    });

    // Знаходимо активну кнопку і змінюємо її стиль
    const activeButton = document.querySelector(`.page_number[data-page="${currentPage}"]`);
    if (activeButton) {
        activeButton.style.backgroundColor = 'black';
        activeButton.style.color = 'white';
    }
}


// Функція для переходу на вибрану сторінку
function goToPage(pageNumber) {
    currentPage = pageNumber; // Оновлюємо поточну сторінку

    // Оновлюємо відображення кнопок сторінок
    createPaginationButtons();

    // Викликаємо функцію для запиту і відображення даних на вибраній сторінці
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
