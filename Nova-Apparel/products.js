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


        function openOrderModal(productId) {
  // 1. Find the exact product data that matches the clicked card
  const product = products.find(p => p.id === productId);
  
  if (!product) return; // Guard clause in case product isn't found
  
  // 2. Select the empty modal containers we just made
  const sizeContainer = document.getElementById('modal-sizes');
  const colorContainer = document.getElementById('modal-colors');
  
  // 3. Wipe out anything left over inside them from a previous click
  sizeContainer.innerHTML = "M, L, XL"; // You can replace this with dynamic sizes if available in your product data
  colorContainer.innerHTML = "";
  
  // 4. Inject Dynamic Sizes
  product.sizes.forEach(size => {
    sizeContainer.innerHTML += `
      <button class="bg-blue-100 text-gray-800 hover:bg-indigo-600 hover:text-white py-2 px-4 rounded-md text-sm font-medium transition-colors border border-gray-200">
        ${size}
      </button>
    `;
  });
  
  // 5. Inject Dynamic Colors
  product.colors.forEach(color => {
    colorContainer.innerHTML += `
      <button class="bg-gray-100 text-gray-800 hover:bg-indigo-600 hover:text-white py-2 px-4 rounded-md text-sm font-medium transition-colors border border-gray-200">
        ${color}
      </button>
    `;
  });
  
  // 6. POP OPEN THE MODAL (Show it on screen)
  const modal = document.getElementById('orderModal');
  modal.style.display = 'flex'; // or use modal.classList.remove('hidden') depending on your CSS setup
}
