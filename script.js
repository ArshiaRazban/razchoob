// ---------------------------
// منوی همبرگری
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const closeMenu = document.querySelector('.close-menu');

    if (hamburger && navMenu && closeMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        closeMenu.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// ---------------------------
// مدیریت سبد خرید با LocalStorage
// ---------------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCounts = document.querySelectorAll('#cart-count');
    cartCounts.forEach(count => count.textContent = cart.length);
}

// افزودن به سبد (صفحه محصولات)
if (document.querySelector('.add-to-cart')) {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const qtyInput = card.querySelector('.product-qty');
            const qty = parseInt(qtyInput.value) || 1;

            for (let i = 0; i < qty; i++) {
                const item = {
                    id: card.dataset.id,
                    name: card.dataset.name,
                    price: parseInt(card.dataset.price)
                };
                cart.push(item);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${qty} عدد از "${card.dataset.name}" به سبد اضافه شد!`);
        });
    });
}


// نمایش سبد خرید (صفحه cart.html)
if (document.getElementById('cart-items')) {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    let total = 0;

    const groupedCart = {};
    cart.forEach(item => {
        if (groupedCart[item.id]) {
            groupedCart[item.id].count++;
        } else {
            groupedCart[item.id] = { ...item, count: 1 };
        }
    });

    Object.values(groupedCart).forEach(it => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <div>
                <strong>${it.name}</strong> (${it.count} عدد)
            </div>
            <div>
                <small>قیمت واحد: ${it.price.toLocaleString()} تومان</small><br>
                <strong>قیمت نهایی: ${(it.price * it.count).toLocaleString()} تومان</strong>
            </div>
        `;
        cartItemsDiv.appendChild(div);
        total += it.price * it.count;
    });

    totalPriceSpan.textContent = total.toLocaleString();

    const checkoutBtn = document.getElementById('checkout');
    const customerFormContainer = document.getElementById('customer-form-container');
    const customerForm = document.getElementById('customer-form');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("سبد خرید خالی است!");
                return;
            }
            customerFormContainer.classList.remove('hidden');
            checkoutBtn.style.display = "none";
        });
    }

    if (customerForm) {
        const nameInput = document.getElementById('customer-name');
        const phoneInput = document.getElementById('customer-phone');
        const errorBox = document.createElement("div");
        errorBox.style.color = "red";
        errorBox.style.fontSize = "0.9rem";
        errorBox.style.marginTop = "0.5rem";
        customerForm.appendChild(errorBox);

        customerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorBox.textContent = "";
            nameInput.style.border = "";
            phoneInput.style.border = "";

            const customerName = nameInput.value.trim();
            const phoneDigits = phoneInput.value.trim().replace(/\D/g, "");

            if (!customerName) {
                errorBox.textContent = "⚠️ لطفاً نام و نام خانوادگی را وارد کنید.";
                nameInput.style.border = "2px solid #dc3545";
                nameInput.focus();
                return;
            }

            if (phoneDigits.length !== 11) {
                errorBox.textContent = "⚠️ شماره تماس باید دقیقاً 11 رقم باشد (مثل 09123456789).";
                phoneInput.style.border = "2px solid #dc3545";
                phoneInput.focus();
                return;
            }

            if (!phoneDigits.startsWith("09")) {
                errorBox.textContent = "⚠️ شماره تماس باید با 09 شروع شود.";
                phoneInput.style.border = "2px solid #dc3545";
                phoneInput.focus();
                return;
            }

            let orders = JSON.parse(localStorage.getItem("orders")) || [];
            orders.push({
                name: customerName,
                phone: phoneDigits,
                items: cart,
                date: new Date().toLocaleString("fa-IR")
            });
            localStorage.setItem("orders", JSON.stringify(orders));

            alert("سفارش شما ثبت شد ✅");
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        });
    }
}

// ---------------------------
// مدیریت فرم تماس
// ---------------------------
let messages = JSON.parse(localStorage.getItem('messages')) || [];

if (document.getElementById('contact-form')) {
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        messages.push({ name, email, message, date: new Date().toLocaleString('fa-IR') });
        localStorage.setItem('messages', JSON.stringify(messages));
        alert('پیام شما ارسال شد ✅');
        e.target.reset();
    });
}

updateCartCount();

// ---------------------------
// پنل ادمین
// ---------------------------
let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'میز چوبی مدرن', price: 500000, desc: 'ساخته‌شده از چوب بلوط با طراحی مینیمال.', image: 'https://via.placeholder.com/300x200?text=میز+چوبی' },
    { id: 2, name: 'صندلی چوبی', price: 300000, desc: 'ترکیبی از راحتی و زیبایی مدرن.', image: 'https://via.placeholder.com/300x200?text=صندلی+چوبی' },
    { id: 3, name: 'قفسه چوبی', price: 400000, desc: 'ایده‌آل برای دکوراسیون مدرن.', image: 'https://via.placeholder.com/300x200?text=قفسه+چوبی' },
    { id: 4, name: 'لامپ چوبی', price: 200000, desc: 'نورپردازی گرم با طراحی چوبی.', image: 'https://via.placeholder.com/300x200?text=لامپ+چوبی' }
];
localStorage.setItem('products', JSON.stringify(products));

if (document.getElementById('message-list')) {
    const messageList = document.getElementById('message-list');
    if (messages.length === 0) {
        messageList.innerHTML = "<p>هیچ پیامی وجود ندارد.</p>";
    } else {
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.classList.add('message-item');
            div.innerHTML = `
                <p><strong>نام:</strong> ${msg.name}</p>
                <p><strong>ایمیل:</strong> ${msg.email}</p>
                <p><strong>پیام:</strong> ${msg.message}</p>
                <p><small>${msg.date}</small></p>
                <hr>
            `;
            messageList.appendChild(div);
        });
    }
}

if (document.getElementById('add-product-form')) {
    document.getElementById('add-product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = parseInt(document.getElementById('product-price').value);
        const desc = document.getElementById('product-desc').value;
        const image = document.getElementById('product-image').value;
        const id = products.length + 1;
        products.push({ id, name, price, desc, image });
        localStorage.setItem('products', JSON.stringify(products));
        alert('محصول جدید اضافه شد! برای دیدن، صفحه محصولات را رفرش کنید.');
        e.target.reset();
    });
}

if (document.getElementById('order-list')) {
    const orderList = document.getElementById('order-list');
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length === 0) {
        orderList.innerHTML = "<p>هیچ سفارشی وجود ندارد.</p>";
    } else {
        orders.forEach((order, index) => {
            const div = document.createElement("div");
            div.classList.add("order-item");
            div.dataset.index = index;

            const groupedItems = {};
            order.items.forEach(item => {
                if (groupedItems[item.id]) {
                    groupedItems[item.id].count++;
                } else {
                    groupedItems[item.id] = { ...item, count: 1 };
                }
            });

            let totalOrderPrice = 0;
            let itemsHtml = Object.values(groupedItems)
                .map(it => {
                    let subtotal = it.price * it.count;
                    totalOrderPrice += subtotal;
                    return `<li>${it.name} - ${it.count} عدد - ${it.price.toLocaleString()} تومان (هر عدد) → جمع: ${subtotal.toLocaleString()} تومان</li>`;
                })
                .join("");

            div.innerHTML = `
            <div class="order-card">
                    <h3>سفارش ${order.name}</h3>
                    <p><strong> <i class="fa-solid fa-phone"></i> ${order.phone}</strong></p>
                    <ul>${itemsHtml}</ul>
                    <p><strong>جمع کل سفارش: ${totalOrderPrice.toLocaleString()} تومان</strong></p>
                    <p><small>🕒 ${order.date}</small></p>
                    <button class="delete-order">حذف سفارش</button>
                </div>
            `;

            orderList.appendChild(div);
        });

        orderList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-order')) {
                const orderItem = e.target.closest('.order-item');
                const idx = orderItem.dataset.index;

                orders.splice(idx, 1);
                localStorage.setItem("orders", JSON.stringify(orders));

                orderItem.remove();

                if (orders.length === 0) {
                    orderList.innerHTML = "<p>هیچ سفارشی وجود ندارد.</p>";
                }
            }
        });
    }
}
