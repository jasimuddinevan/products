document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');

            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            // Update Icon
            if (icon) {
                if (isDark) {
                    icon.classList.replace('fa-moon', 'fa-sun');
                } else {
                    icon.classList.replace('fa-sun', 'fa-moon');
                }
            }
        });
    }

    // --- Product Logic ---
    const productGrid = document.getElementById('product-grid');


    // Fetch Products
    if (productGrid) {
        fetch('data/products.json')
            .then(response => response.json())
            .then(products => {
                renderProducts(products);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                productGrid.innerHTML = '<p class="error-msg">Failed to load products. Please try again later.</p>';
            });
    }

    // Product Details Logic
    const productDetailsContainer = document.getElementById('product-details-container');
    if (productDetailsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            fetch('data/products.json')
                .then(response => response.json())
                .then(products => {
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        renderProductDetails(product);
                    } else {
                        productDetailsContainer.innerHTML = '<p class="error-msg">Product not found.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                    productDetailsContainer.innerHTML = '<p class="error-msg">Failed to load product details.</p>';
                });
        } else {
            productDetailsContainer.innerHTML = '<p class="error-msg">No product specified.</p>';
        }
    }
});

function renderProducts(products) {

    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; // Clear loading state

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price}</p>
                <a href="product.html?id=${product.id}" class="btn btn-outline">View Details</a>
            </div>
        `;

        productGrid.appendChild(productCard);
    });

    // Trigger scroll animations for new elements
    observeElements();
}

function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => observer.observe(card));
}


function renderProductDetails(product) {
    const container = document.getElementById('product-details-container');

    container.innerHTML = `
        <div class="details-grid">
            <div class="details-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="details-content">
                <h1 class="details-title">${product.title}</h1>
                <p class="details-price">$${product.price}</p>
                <div class="details-description">
                    <p>${product.description}</p>
                </div>
                <div class="details-actions">
                    <a href="${product.link}" class="btn btn-primary buy-btn" target="_blank">
                        Get Access
                    </a>
                </div>
            </div>
        </div>
    `;

    // Animate details page elements slightly
    const elements = container.querySelectorAll('.details-image, .details-content');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out ' + (index * 0.2) + 's';

        // Trigger reflow
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
}


// Admin Form Logic
const productForm = document.getElementById('product-form');
if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('p-title').value;
        const price = document.getElementById('p-price').value;
        const image = document.getElementById('p-image').value;
        const link = document.getElementById('p-link').value;
        const description = document.getElementById('p-desc').value;

        // Generate a random-ish ID (enough for small shop)
        const id = Date.now().toString();

        const newProduct = {
            id,
            title,
            description,
            price,
            image,
            link
        };

        const jsonString = JSON.stringify(newProduct, null, 2);

        const outputContainer = document.getElementById('output-container');
        const jsonOutput = document.getElementById('json-output');

        outputContainer.style.display = 'block';
        jsonOutput.value = jsonString + ','; // Add comma for easy array pasting

        // Scroll to output
        outputContainer.scrollIntoView({ behavior: 'smooth' });
    });

    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const jsonOutput = document.getElementById('json-output');
            jsonOutput.select();
            document.execCommand('copy'); // Fallback or use Clipboard API

            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    }
}


