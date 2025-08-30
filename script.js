document.addEventListener('DOMContentLoaded', () => {
    // Função para mostrar abas
    function showTab(tabId) {
        // Remover 'active' de todos os conteúdos e links de navegação
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active-tab');
        });

        // Adicionar 'active' ao conteúdo da aba e ao link de navegação correspondente
        const selectedTabContent = document.getElementById(tabId);
        if (selectedTabContent) {
            selectedTabContent.classList.add('active');
        }

        const selectedNavLink = document.querySelector(`.main-nav a[onclick*="showTab('${tabId}')"]`);
        if (selectedNavLink) {
            selectedNavLink.classList.add('active-tab');
        }

        // Rolar para o topo da seção de menu
        document.querySelector('.menu-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Expor showTab para o escopo global (para ser chamado pelo onclick no HTML)
    window.showTab = showTab;

    // Inicializa a primeira aba como ativa ao carregar a página
    showTab('burgers');

    // --- Lógica do Carrinho de Compras ---
    let cart = [];

    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountSpan = document.getElementById('cart-count');
    const emptyCartMessage = document.querySelector('.empty-cart-message');

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Limpa os itens atuais
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }

        cartTotalSpan.textContent = `R$ ${total.toFixed(2)}`;
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCartDisplay();
        cartSidebar.classList.add('open'); // Abre o carrinho automaticamente
    }

    function updateQuantity(id, change) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Remove se a quantidade for 0 ou menos
            }
        }
        updateCartDisplay();
    }

    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartDisplay();
    }

    // Event Listeners para botões "Adicionar ao Carrinho"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            const image = e.target.closest('.menu-item').querySelector('img').src;

            addToCart({ id, name, price, image });
        });
    });

    // Event Listener para botões de quantidade e remover no carrinho
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('increase')) {
            const id = target.dataset.id;
            updateQuantity(id, 1);
        } else if (target.classList.contains('decrease')) {
            const id = target.dataset.id;
            updateQuantity(id, -1);
        } else if (target.classList.contains('remove-item-btn') || target.closest('.remove-item-btn')) {
            const id = target.dataset.id || target.closest('.remove-item-btn').dataset.id;
            removeItem(id);
        }
    });

    // Toggle do carrinho
    window.toggleCart = function() {
        cartSidebar.classList.toggle('open');
    }

    // Botão de finalizar pedido
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione itens antes de finalizar o pedido!');
            return;
        }
        const confirmation = confirm('Deseja finalizar o pedido?');
        if (confirmation) {
            alert('Pedido finalizado com sucesso! Em breve entraremos em contato.');
            cart = []; // Limpa o carrinho
            updateCartDisplay();
            toggleCart(); // Fecha o carrinho
        }
    });

    // Fecha o carrinho ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (cartSidebar.classList.contains('open') &&
            !cartSidebar.contains(e.target) &&
            !document.querySelector('.cart-icon').contains(e.target) &&
            !e.target.classList.contains('add-to-cart-btn')) {
            toggleCart();
        }
    });
});