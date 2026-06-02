  // Product Data
        const products = [
            {
                id: 1,
                title: "Pakistani Kof Hata Premium Quality Panjabi",
                originalPrice: 2090,
                discountedPrice: 1690,
                discountPercent: 24,
                category: "Panjabi",
                image:"./pakistani-kof-hata.png",
                iconColor: "text-blue-600"
            },
            {
                id: 2,
                title: "Premium Pakistani Stiz Fabric Kof Hata Panjabi",
                originalPrice: 2000,
                discountedPrice: 1590,
                discountPercent: 26,
                category: "panjabi",
                image:"./stiz-kof-hata.png",
                color: "bg-indigo-100",
                iconColor: "text-indigo-600"
            },
            {
                id: 3,
                title: "Premium Quality Fabric Right Shoulder Design Panjabi",
                originalPrice: 2100,
                discountedPrice: 1750,
                discountPercent: 20,
                category: "panjabi",
                image:"./buke-design-panjabi.png",
                color: "bg-stone-100",
                iconColor: "text-stone-600"
            },
            {
                id: 4,
                title: "Premium Stiz Fabric Panjabi",
                originalPrice: 1788,
                discountedPrice: 1490,
                discountPercent: 20,
                category: "panjabi",
                image:"./stiz-panjabi.png",
                color: "bg-rose-100",
                iconColor: "text-rose-500"
            },
            {
                id: 5,
                title: "Premium Quality Fabric Pure Black Panjabi",
                originalPrice: 2100,
                discountedPrice: 1750,
                discountPercent: 20,
                category: "panjabi",
                image:"./black-panjabi.png",
                color: "bg-amber-100",
                iconColor: "text-amber-600"
            },
            {
                id: 6,
                title: "Premium Quality Fabric White Panjabi",
                originalPrice: 1390,
                discountedPrice: 1190,
                discountPercent: 17,
                category: "panjabi",
                image:"./white-panjabi.jpeg",
                color: "bg-emerald-100",
                iconColor: "text-emerald-600"
            }
        ];



        // Function to render products
        function renderProducts() {
            const container = document.getElementById('product-container');
            
            products.forEach(product => {
                const productHTML = `
                    <div class="product-card group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                        
                        <!-- Discount Badge -->
                        <div class="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px- py-1 rounded-full shadow-sm">
                            -${product.discountPercent}% OFF
                        </div>

                       <!-- Image Placeholder (using real product images) -->
                    <div class="w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden sm:aspect-w-2 sm:aspect-h-3 h-80 relative flex items-center justify-center group-hover:opacity-90 transition-opacity">
                    <img src="${product.image}" alt="${product.title}" class=" h-full object-cover group-hover:scale-110 transition-transform duration-300">
          
                      <!-- Quick view overlay (hidden on mobile, visible on hover on desktop) -->
                      <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       
                          </div>
                          </div>

                        <!-- Product Details -->
                        <div class="p-6 flex flex-col flex-grow">
                            <p class="text-sm text-gray-500 mb-1">${product.category}</p>
                            <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                <a href="#">
                                    <span aria-hidden="true" class="absolute inset-0 z-0"></span>
                                    ${product.title}
                                </a>
                            </h3>
                            
                            <!-- Spacer to push pricing and button to bottom -->
                            
                            <div class="flex-grow"></div>
                            
                            <!-- Pricing -->
                            <div class="mt-4 flex items-end justify-between z-10 relative">
                                <div>
                                    <p class="text-sm text-gray-500 line-through mb-1">৳${product.originalPrice.toFixed(2)}</p>
                                    <p class="text-xl font-extrabold text-indigo-600">৳${product.discountedPrice.toFixed(2)}</p>
                                </div>
                            </div>
                            
                            <!-- Order Button -->
                            <button onclick="handleOrder('${product.title}', ${product.discountedPrice})" class="btn-order mt-5 w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 z-10 relative shadow-md">
                                 Order Now
                            </button>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', productHTML);
            });
        }

        // Modal Logic
        const modal = document.getElementById('orderModal');
        const closeModalBtn = document.getElementById('closeModal');
        const continueShoppingBtn = document.getElementById('continueShoppingBtn');
        
        function handleOrder(productName, price) {
            // Update modal content
            document.getElementById('modalProductName').textContent = productName;
            document.getElementById('modalProductPrice').textContent = `৳${price.toFixed(2)}`;
            
            // Show modal
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling in background
        }

        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Event Listeners for Modal
        closeModalBtn.addEventListener('click', closeModal);
        continueShoppingBtn.addEventListener('click', closeModal);
        
        // Close modal if clicking outside content
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', renderProducts);