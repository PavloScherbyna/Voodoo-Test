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

            addToCartButton.addEventListener('click', () => {
                const productName = product.title;
                const productPriceText = product.variants[0]?.price || '0.00';
                const productPrice = parseFloat(productPriceText.replace(',', '.'));

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


fetchAndFillProductCards(currentPage);
function formatPrice(price) {
    const formattedPrice = parseFloat(price).toFixed(2);
    return formattedPrice.replace('.', ' ').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

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

function goToPage(pageNumber) {
    currentPage = pageNumber; 
    createPaginationButtons();
    fetchAndFillProductCards(currentPage);
}

createPaginationButtons();
fetchAndFillProductCards(currentPage); 

const pageButtons = document.querySelectorAll('.page_number');

function changeButtonStyle(event) {
    pageButtons.forEach(button => {
        button.classList.remove('active');
        button.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        button.style.color = 'black';
    });

    event.target.classList.add('active');
    event.target.style.backgroundColor = 'black';
    event.target.style.color = 'white';
}

pageButtons.forEach(button => {
    button.addEventListener('click', changeButtonStyle);
});

const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const basket = document.getElementById('basket');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

cartToggle.addEventListener('click', () => {
    basket.style.display = 'block'; 
    main.style.display = 'none';
    footer.style.display = 'none';
});

closeCart.addEventListener('click', () => {
    basket.style.display = 'none';
    main.style.display = 'block';
    footer.style.display = 'block';
});

const cart = {
    items: [],
    total: 0,
};

function updateCartDisplay() {
    const cartContainer = document.querySelector('.basket_content .select_order');
    cartContainer.innerHTML = '';
    cart.items.forEach(item => {
        createProductCard(item, cartContainer);
    });
}

function calculateTotal() {
    cart.total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalElement = document.querySelector('.total_sum p:last-child');
    totalElement.textContent = `${cart.total.toFixed(2)} KR.`;
}

function addToCart(productName, productPrice) {
    const existingProduct = cart.items.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const newProduct = {
            name: productName,
            price: productPrice,
            quantity: 1,
        };
        cart.items.push(newProduct);
    }

    updateCartDisplay();
    calculateTotal();
}

function decreaseQuantity(productName) {
    const existingProduct = cart.items.find(item => item.name === productName);

    if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
    } else if (existingProduct && existingProduct.quantity === 1) {
        const productIndex = cart.items.indexOf(existingProduct);
        if (productIndex !== -1) {
            cart.items.splice(productIndex, 1);
        }
    }
    updateCartDisplay();
    calculateTotal();
}

function createProductCard(product, cartContainer) {
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

    const subtractButton = productInfo.querySelector('.subtract');
    const addButton = productInfo.querySelector('.add');

    subtractButton.addEventListener('click', () => {
        decreaseQuantity(product.name);
    });

    addButton.addEventListener('click', () => {
        addToCart(product.name, product.price);
    });

    const deleteButton = deleteIcon.querySelector('img');
    deleteButton.addEventListener('click', (event) => {
        const productName = event.target.getAttribute('data-product-name');
        removeProduct(productName);
    });

    productCard.appendChild(imageContainer);
    productCard.appendChild(productInfo);
    productCard.appendChild(deleteIcon);
    cartContainer.appendChild(productCard);
}


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

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.basket_content .select_order');
    updateCartDisplay(cartContainer);
});
