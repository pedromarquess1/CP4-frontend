let cart = [];

function updatePriceDisplay(value) {
    const priceText = document.getElementById('priceVal');
    if (priceText) {
        priceText.innerText = 'R$ ' + value;
    }
}

function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('.filter-card input[type="checkbox"]:checked'))
        .map(item => item.id);
    const maxPrice = Number(document.getElementById('priceRange')?.value || 300);
    const selectedBrand = document.querySelector('.filter-card select')?.value || 'Todas as Marcas';
    const cards = document.querySelectorAll('[data-product-card]');
    let visibleProducts = 0;

    cards.forEach(card => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(card.dataset.category);
        const priceMatch = Number(card.dataset.price) <= maxPrice;
        const brandMatch = selectedBrand === 'Todas as Marcas' || card.dataset.brand === selectedBrand;
        const isVisible = categoryMatch && priceMatch && brandMatch;

        card.parentElement.style.display = isVisible ? '' : 'none';
        if (isVisible) {
            visibleProducts += 1;
        }
    });

    const countText = document.querySelector('.catalog-count');
    if (countText) {
        countText.textContent = `Exibindo ${visibleProducts} produto${visibleProducts === 1 ? '' : 's'}`;
    }
}

function showPage(pageId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.classList.remove('active'));

    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeNav = document.getElementById('nav-' + pageId);
    if (activeNav) {
        activeNav.classList.add('active');
    }

    window.scrollTo(0, 0);
}

function openCart() {
    const cartElement = document.getElementById('cartOffcanvas');
    const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartElement);
    bsOffcanvas.show();
}

function filterCategory(catId) {
    showPage('categorias');
    const checkboxes = document.querySelectorAll('.filter-card input[type="checkbox"]');
    checkboxes.forEach(chk => chk.checked = false);

    const targetCheckbox = document.getElementById(catId);
    if (targetCheckbox) {
        targetCheckbox.checked = true;
    }

    applyFilters();
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    openCart();
}

function addDetailedToCart(name, price) {
    const qtyInput = document.getElementById('detail-quantity');
    const quantity = parseInt(qtyInput.value) || 1;
    
    for (let i = 0; i < quantity; i++) {
        cart.push({ name, price });
    }
    
    updateCartUI();
    openCart();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    const emptyMsg = document.getElementById('empty-cart-msg');

    cartCount.innerText = cart.length;
    cartList.innerHTML = '';

    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        cartTotal.innerText = 'R$ 0,00';
        return;
    }

    emptyMsg.style.display = 'none';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center px-0';
        li.innerHTML = `
            <div>
                <h6 class="my-0 small fw-bold">${item.name}</h6>
                <small class="text-muted">R$ ${item.price.toFixed(2).replace('.', ',')}</small>
            </div>
            <button class="btn btn-sm btn-outline-danger border-0" onclick="removeFromCart(${index})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        cartList.appendChild(li);
    });

    cartTotal.innerText = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleWishlist(btnElement) {
    const icon = btnElement.querySelector('i');
    if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'text-danger');
    } else {
        icon.classList.remove('fa-solid', 'text-danger');
        icon.classList.add('fa-regular');
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    alert('Obrigado por comprar na EcoTrend! Seu pedido sustentável foi realizado com sucesso.');
    cart = [];
    updateCartUI();

    const cartElement = document.getElementById('cartOffcanvas');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(cartElement);
    if (bsOffcanvas) bsOffcanvas.hide();
}

function submitForm(event) {
    event.preventDefault();
    alert('Mensagem enviada com sucesso! Em breve nossa equipe entrará em contato.');
    document.getElementById('contactForm').reset();
}

function bindFilters() {
    const checkboxes = document.querySelectorAll('.filter-card input[type="checkbox"]');
    checkboxes.forEach(chk => chk.addEventListener('change', applyFilters));

    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function () {
            updatePriceDisplay(this.value);
            applyFilters();
        });
    }

    const brandSelect = document.querySelector('.filter-card select');
    if (brandSelect) {
        brandSelect.addEventListener('change', applyFilters);
    }

    const applyFiltersButton = document.getElementById('apply-filters');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applyFilters);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    bindFilters();
    applyFilters();
});