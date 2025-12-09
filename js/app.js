document.addEventListener('DOMContentLoaded', () => {
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
                        Buy Now
                    </a>
                </div>
            </div>
        </div>
    `;
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


