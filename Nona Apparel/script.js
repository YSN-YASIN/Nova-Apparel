// ===============================
// SMOOTH SCROLL
// ===============================

function scrollToSection(id){

  const section = document.getElementById(id);

  if(section){

    section.scrollIntoView({
      behavior: "smooth"
    });

  }

}

// ===============================
// PRODUCTS DATA
// ===============================

const products = {

  1: {
    title: "Oversized Premium T-Shirt",
    oldPrice: "৳1990",
    newPrice: "৳1490",
    discount: "25% OFF",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    description:
      "Premium oversized t-shirt with luxury fabric and modern streetwear aesthetic."
  },

  2: {
    title: "Luxury Black Hoodie",
    oldPrice: "৳2990",
    newPrice: "৳2190",
    discount: "27% OFF",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
    description:
      "Minimal premium hoodie designed for modern fashion lovers."
  },

  3: {
    title: "Modern Women Outfit",
    oldPrice: "৳3490",
    newPrice: "৳2690",
    discount: "22% OFF",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
    description:
      "Elegant women fashion with modern aesthetic and premium quality."
  },

  4: {
    title: "Premium Streetwear Set",
    oldPrice: "৳4290",
    newPrice: "৳3290",
    discount: "24% OFF",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    description:
      "Premium streetwear collection for stylish modern lifestyle."
  },

  5: {
    title: "Nova Signature Jacket",
    oldPrice: "৳4990",
    newPrice: "৳3890",
    discount: "20% OFF",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    description:
      "Luxury fashion jacket with clean modern aesthetic."
  },

  6: {
    title: "Minimal Fashion Collection",
    oldPrice: "৳2490",
    newPrice: "৳1790",
    discount: "28% OFF",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    description:
      "Modern minimal collection with timeless premium style."
  }

};

// ===============================
// PRODUCT PAGE LOGIC
// ===============================

if(window.location.pathname.includes("product.html")){

  // GET PRODUCT ID

  const params = new URLSearchParams(window.location.search);

  const productId = params.get("id");

  // GET PRODUCT DATA

  const product = products[productId];

  // IF PRODUCT EXISTS

  if(product){

    // TITLE

    const productTitle =
      document.getElementById("productTitle");

    if(productTitle){
      productTitle.innerText = product.title;
    }

    // OLD PRICE

    const oldPrice =
      document.getElementById("oldPrice");

    if(oldPrice){
      oldPrice.innerText = product.oldPrice;
    }

    // NEW PRICE

    const newPrice =
      document.getElementById("newPrice");

    if(newPrice){
      newPrice.innerText = product.newPrice;
    }

    // DISCOUNT

    const discount =
      document.getElementById("discount");

    if(discount){
      discount.innerText = product.discount;
    }

    // IMAGE

    const productImage =
      document.getElementById("productImage");

    if(productImage){
      productImage.src = product.image;
    }

    // DESCRIPTION

    const productDescription =
      document.getElementById("productDescription");

    if(productDescription){
      productDescription.innerText =
        product.description;
    }

    // ===============================
    // WHATSAPP BUTTON
    // ===============================

    const buyButton =
      document.getElementById("buyButton");

    if(buyButton){

      buyButton.onclick = function(){

        const phoneNumber = "8801611764091";

        const message =
          `Hello Nova Apparel! I want to order: ${product.title}`;

        const whatsappURL =
          `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");

      };

    }

  }

}

// ===============================
// NAVBAR SHADOW
// ===============================

window.addEventListener("scroll", function(){

  const header = document.querySelector("header");

  if(header){

    if(window.scrollY > 30){

      header.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.06)";

    } else {

      header.style.boxShadow = "none";

    }

  }

});