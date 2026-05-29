export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- UTILITY AUTH CHECKER ---
    const isAdminAuthenticated = (req) => {
      const authHeader = req.headers.get("Authorization");
      return authHeader === btoa("novaapparel76@gmail.com:nov@6699");
    };

    // ==========================================
    // 1. API BACKEND ENDPOINTS
    // ==========================================

    // PUBLIC: Get catalog items
    if (request.method === "GET" && url.pathname === "/api/products") {
      const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY id DESC").all();
      return Response.json(results);
    }

    // PUBLIC: Submit New Local On-Site Order
    if (request.method === "POST" && url.pathname === "/api/orders/place") {
      try {
        const body = await request.json();
        const { name, address, phone, zone, deliveryFee, total, items } = body;

        await env.DB.prepare(
          `INSERT INTO orders (customer_name, shipping_address, phone_number, zone, delivery_fee, total_amount, items_json, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`
        )
        .bind(name, address, phone, zone, deliveryFee, total, JSON.stringify(items))
        .run();

        return Response.json({ success: true });
      } catch (err) {
        return Response.json({ success: false, error: err.message }, { status: 500 });
      }
    }

    // ADMIN AUTHENTICATION GATE
    if (request.method === "POST" && url.pathname === "/api/admin/login") {
      const { email, password } = await request.json();
      if (email === "novaapparel76@gmail.com" && password === "nov@6699") {
        const token = btoa(`${email}:${password}`);
        return Response.json({ success: true, token });
      }
      return Response.json({ success: false, message: "Invalid Credentials" }, { status: 401 });
    }

    // ADMIN: Fetch All Active Orders
    if (request.method === "GET" && url.pathname === "/api/admin/orders") {
      if (!isAdminAuthenticated(request)) return new Response("Unauthorized", { status: 401 });
      const { results } = await env.DB.prepare("SELECT * FROM orders ORDER BY id DESC").all();
      return Response.json(results);
    }

    // ADMIN: Update Order State Pipeline
    if (request.method === "PATCH" && url.pathname === "/api/admin/orders/status") {
      if (!isAdminAuthenticated(request)) return new Response("Unauthorized", { status: 401 });
      const { orderId, status } = await request.json();
      await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(status, orderId).run();
      return Response.json({ success: true });
    }

    // ADMIN: Write New Product Entry
    if (request.method === "POST" && url.pathname === "/api/admin/products/create") {
      if (!isAdminAuthenticated(request)) return new Response("Unauthorized", { status: 401 });
      const { category, title, description, price, discount_price, image_urls, sizes, colors, in_stock } = await request.json();
      await env.DB.prepare(
        `INSERT INTO products (category, title, description, price, discount_price, image_urls, sizes, colors, in_stock) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(category, title, description, price, discount_price, image_urls, sizes, colors, in_stock)
      .run();
      return Response.json({ success: true });
    }

    // ADMIN: Modify Existing Product Entry live
    if (request.method === "PUT" && url.pathname === "/api/admin/products/update") {
      if (!isAdminAuthenticated(request)) return new Response("Unauthorized", { status: 401 });
      const { id, category, title, description, price, discount_price, image_urls, sizes, colors, in_stock } = await request.json();
      await env.DB.prepare(
        `UPDATE products SET category = ?, title = ?, description = ?, price = ?, discount_price = ?, image_urls = ?, sizes = ?, colors = ?, in_stock = ? WHERE id = ?`
      )
      .bind(category, title, description, price, discount_price, image_urls, sizes, colors, in_stock, id)
      .run();
      return Response.json({ success: true });
    }

    // ==========================================
    // 2. FRONTEND ROUTING LAYER
    // ==========================================
    if (url.pathname === "/admin") {
      return new Response(getAdminViewHTML(), { headers: { "Content-Type": "text/html" } });
    }
    if (url.pathname === "/about") {
      return new Response(getAboutViewHTML(), { headers: { "Content-Type": "text/html" } });
    }

    return new Response(getPublicViewHTML(), { headers: { "Content-Type": "text/html" } });
  }
};

// ==========================================
// 3. MINIMAL PREMIUM UI TEMPLATES (HTML/CSS)
// ==========================================
function getPublicViewHTML() {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Apparel | Premium Minimalist Craftsmanship</title>
    <style>
      :root { --bg: #ffffff; --accent: #111111; --muted: #767676; --light-gray: #f5f5f7; --discount: #d9383a; }
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      body { background: var(--bg); color: var(--accent); overflow-x: hidden; }
      nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 4%; border-bottom: 1px solid #eee; position: sticky; top:0; background:rgba(255,255,255,0.95); backdrop-filter:blur(8px); z-index:100; }
      .logo { font-size: 1.4rem; font-weight: 700; letter-spacing: 4px; text-decoration: none; color: var(--accent); }
      .nav-links a { text-decoration: none; color: var(--accent); margin-left: 25px; font-size: 0.9rem; font-weight: 500; letter-spacing: 1px; transition: 0.2s; }
      .nav-links a:hover { color: var(--muted); }
      header { height: 45vh; background: #000; display: flex; align-items: center; justify-content: center; text-align: center; color: white; padding: 0 20px; }
      header h1 { font-size: 3rem; font-weight: 300; letter-spacing: 8px; margin-bottom: 10px; }
      header p { font-size: 1rem; font-weight: 300; letter-spacing: 3px; color: #ccc; }
      .section-container { max-width: 1300px; margin: 60px auto; padding: 0 4%; }
      .section-title { font-size: 1.5rem; font-weight: 400; letter-spacing: 4px; margin-bottom: 40px; text-transform: uppercase; border-left: 3px solid var(--accent); padding-left: 15px; }
      .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 40px; margin-bottom: 40px; }
      .product-card { background: #fff; text-decoration: none; color: inherit; cursor: pointer; display: flex; flex-direction: column; }
      .img-wrapper { width: 100%; height: 380px; overflow: hidden; background: var(--light-gray); position: relative; }
      .product-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
      .product-card:hover img { transform: scale(1.02); }
      .badge-out { position: absolute; top: 15px; left: 15px; background: #000; color: #fff; font-size: 0.75rem; padding: 5px 10px; letter-spacing: 1px; }
      .product-info { padding: 20px 0 10px 0; }
      .product-name { font-size: 1rem; font-weight: 500; margin-bottom: 6px; }
      .price-line { display: flex; gap: 10px; align-items: center; font-size: 0.95rem; }
      .original-price { text-decoration: line-through; color: var(--muted); font-size: 0.85rem; }
      .current-price { font-weight: 600; }
      .discount-label { color: var(--discount); font-size: 0.8rem; font-weight: 600; }
      .see-more-btn { display: inline-block; background: transparent; color: var(--accent); border: 1px solid var(--accent); padding: 12px 35px; font-size: 0.85rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: 0.3s; }
      .see-more-btn:hover { background: var(--accent); color: white; }
      .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: none; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(4px); }
      .modal-content { background: white; width: 90%; max-width: 900px; max-height: 90vh; overflow-y: auto; display: grid; grid-template-columns: 1fr 1fr; padding: 40px; gap: 40px; position: relative; }
      @media(max-width: 768px) { .modal-content { grid-template-columns: 1fr; padding: 20px; } }
      .close-modal { position: absolute; top: 20px; right: 20px; font-size: 1.5rem; cursor: pointer; background: none; border: none; }
      .slider-box { position: relative; width: 100%; overflow: hidden; background: var(--light-gray); height: 450px; }
      .slider-track { display: flex; transition: transform 0.4s ease; height: 100%; }
      .slider-track img { width: 100%; height: 100%; object-fit: cover; flex-shrink: 0; }
      .slider-nav { position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
      .slider-dot { width: 8px; height: 8px; background: rgba(0,0,0,0.3); border-radius: 50%; cursor: pointer; }
      .slider-dot.active { background: var(--accent); }
      .details-title { font-size: 1.6rem; font-weight: 500; margin-bottom: 10px; }
      .details-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.6; margin: 20px 0; }
      .selector-title { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; display: block; }
      .selector-group { display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap; }
      .selector-item { border: 1px solid #ccc; padding: 8px 16px; font-size: 0.85rem; cursor: pointer; min-width: 50px; text-align: center; }
      .selector-item.selected { border-color: var(--accent); background: var(--accent); color: white; }
      .action-btn { background: var(--accent); color: white; width: 100%; padding: 15px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; font-weight: 600; border: none; cursor: pointer; margin-top: 15px; }
      .action-btn:disabled { background: #ccc; cursor: not-allowed; }
      .checkout-step { display: none; }
      .checkout-step.active { display: block; }
      .option-card { border: 1px solid #ddd; padding: 20px; margin: 15px 0; cursor: pointer; display: flex; align-items: center; gap: 15px; }
      .option-card.selected { border-color: #000; background: var(--light-gray); }
      .input-field { width: 100%; padding: 12px; margin: 12px 0; border: 1px solid #ddd; font-size: 0.9rem; }
      .order-summary-row { display: flex; justify-content: space-between; margin: 15px 0; font-size: 1rem; border-top: 1px solid #eee; padding-top: 10px; }
      .popup-notification { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #000; color: #fff; padding: 20px 40px; letter-spacing: 2px; display: none; z-index: 5000; box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center; }
      footer { background: var(--light-gray); padding: 60px 4% 30px 4%; border-top: 1px solid #eee; font-size: 0.9rem; margin-top: 120px; }
      .footer-grid { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; margin-bottom: 40px; }
      .footer-col h4 { font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; color: var(--accent); }
      .footer-col p, .footer-col a { color: var(--muted); text-decoration: none; line-height: 1.8; display: block; margin-bottom: 8px; }
      .footer-bottom { text-align: center; border-top: 1px solid #ddd; padding-top: 20px; font-size: 0.8rem; color: var(--muted); }
    </style>
  </head>
  <body>

    <div id="popupAlert" class="popup-notification">Thank you for choosing us</div>

    <nav>
      <a href="/" class="logo">NOVA APPAREL</a>
      <div class="nav-links">
        <a href="#panjabi">PANJABI</a>
        <a href="#t-shirts">T-SHIRTS</a>
        <a href="/about">ABOUT US</a>
        <a href="/admin">DASHBOARD</a>
      </div>
    </nav>

    <header>
      <div>
        <h1>NOVA APPAREL</h1>
        <p>ESSENTIAL MINIMALISM // PREMIUM TEXTILES</p>
      </div>
    </header>

    <div class="section-container" id="panjabi">
      <h2 class="section-title">PANJABI</h2>
      <div class="product-grid" id="grid-panjabi"></div>
      <center><button class="see-more-btn" onclick="filterCategory('PANJABI')">See More</button></center>
    </div>

    <div class="section-container" id="t-shirts">
      <h2 class="section-title">T-Shirts</h2>
      <div class="product-grid" id="grid-tshirts"></div>
      <center><button class="see-more-btn" onclick="filterCategory('T-SHIRT')">See More</button></center>
    </div>

    <div class="modal-overlay" id="productModal">
      <div class="modal-content">
        <button class="close-modal" onclick="closeModal()">×</button>
        
        <div class="slider-box">
          <div class="slider-track" id="modalSliderTrack"></div>
          <div class="slider-nav" id="modalSliderNav"></div>
        </div>

        <div id="modalDataCol">
          <div id="step-product-view" class="checkout-step active">
            <h2 class="details-title" id="m-title">Product Loading</h2>
            <div class="price-line" style="margin-bottom: 15px;">
              <span class="current-price" id="m-price">0 Tk</span>
              <span class="original-price" id="m-oldprice">0 Tk</span>
              <span class="discount-label" id="m-discount">0% OFF</span>
            </div>
            <p class="details-desc" id="m-desc"></p>
            
            <span class="selector-title">Select Size</span>
            <div class="selector-group" id="m-sizes"></div>

            <span class="selector-title">Select Color</span>
            <div class="selector-group" id="m-colors"></div>

            <button id="m-action-btn" class="action-btn" onclick="goToStep('step-channel-selection')">Order Now</button>
          </div>

          <div id="step-channel-selection" class="checkout-step">
            <h3 style="margin-bottom:20px;">CHOOSE ORDER METHOD</h3>
            <div class="option-card selected" id="opt-site" onclick="selectChannel('site')">
              <input type="radio" name="orderChan" id="chanSite" checked>
              <div>
                <strong>Order directly on this site</strong>
                <p style="font-size:0.8rem; color:var(--muted)">Secure dynamic fast check-out processing</p>
              </div>
            </div>
            <div class="option-card" id="opt-wa" onclick="selectChannel('wa')">
              <input type="radio" name="orderChan" id="chanWa">
              <div>
                <strong>Order on WhatsApp</strong>
                <p style="font-size:0.8rem; color:var(--muted)">Instant chat helper (+8801611764091)</p>
              </div>
            </div>
            <button class="action-btn" onclick="processChannelSelection()">Continue</button>
            <button class="see-more-btn" style="width:100%; border:none; margin-top:10px;" onclick="goToStep('step-product-view')">Back</button>
          </div>

          <div id="step-order-form" class="checkout-step">
            <h3 style="margin-bottom:15px;">SHIPPING DETAILS</h3>
            <input type="text" id="f-name" class="input-field" placeholder="Full Name" required>
            <input type="text" id="f-phone" class="input-field" placeholder="Phone Number" required>
            <textarea id="f-address" class="input-field" placeholder="Full Delivery Address" rows="2" required></textarea>
            
            <span class="selector-title">Courier Service Area</span>
            <select id="f-zone" class="input-field" onchange="calculateDelivery()" style="background:white;">
              <option value="inside">Inside Dhaka (60 Tk)</option>
              <option value="outside">Outside Dhaka (120 Tk)</option>
            </select>

            <div style="background:var(--light-gray); padding:15px; margin-top:10px;">
              <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:5px;">
                <span>Product subtotal:</span> <span id="summary-subtotal">0 Tk</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:5px;">
                <span>Delivery charge:</span> <span id="summary-delivery">60 Tk</span>
              </div>
              <div class="order-summary-row">
                <strong>Total Amount:</strong> <strong id="summary-total">0 Tk</strong>
              </div>
            </div>

            <button class="action-btn" onclick="submitFinalOrder()">Confirm Order</button>
            <button class="see-more-btn" style="width:100%; border:none; margin-top:10px;" onclick="goToStep('step-channel-selection')">Back</button>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <div class="footer-grid">
        <div class="footer-col">
          <h4>NOVA APPAREL</h4>
          <p>Premium minimal garments balancing industrial styling details with clean luxury heritage essentials.</p>
        </div>
        <div class="footer-col">
          <h4>CUSTOMER SERVICE</h4>
          <a href="/about">About Us Brand Vision</a>
          <p>WhatsApp: +8801611764091</p>
          <p>Email: novaapparel76@gmail.com</p>
        </div>
        <div class="footer-col">
          <h4>OFFICE DETAILS</h4>
          <p>Sat - Thu: 10:00 AM - 8:00 PM</p>
          <p>Delivery Coverage: Nationwide Bangladesh</p>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 NOVA APPAREL. ALL RIGHTS RESERVED.
      </div>
    </footer>

    <script>
      let globalProducts = [];
      let currentActiveProduct = null;
      let selectedSize = '';
      let selectedColor = '';
      let selectedChannelMethod = 'site';

      async function bootstrapStore() {
        try {
          const res = await fetch('/api/products');
          globalProducts = await res.json();
          renderShelf('PANJABI', 'grid-panjabi', 6);
          renderShelf('T-SHIRT', 'grid-tshirts', 6);
        } catch (e) { console.error(e); }
      }

      function renderShelf(cat, targetId, cap) {
        const filtered = globalProducts.filter(p => p.category.toUpperCase() === cat.toUpperCase());
        const target = document.getElementById(targetId);
        let batch = filtered.slice(0, cap);
        
        if(batch.length === 0){
          target.innerHTML = '<p style="color:var(--muted)">No collection products listed.</p>';
          return;
        }

        target.innerHTML = batch.map(p => {
          const imgList = p.image_urls ? p.image_urls.split(',') : [''];
          const discountPct = p.discount_price ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;
          return \`
            <div class="product-card" onclick="openProductViewer(\${p.id})">
              <div class="img-wrapper">
                \${p.in_stock ? '' : '<span class="badge-out">OUT OF STOCK</span>'}
                <img src="\${imgList[0].trim() || 'https://via.placeholder.com/400x500'}" alt="\${p.title}">
              </div>
              <div class="product-info">
                <h3 class="product-name">\${p.title}</h3>
                <div class="price-line">
                  \${p.discount_price ? \`
                    <span class="current-price">\${p.discount_price} Tk</span>
                    <span class="original-price">\${p.price} Tk</span>
                    <span class="discount-label">\${discountPct}% OFF</span>
                  \` : \`<span class="current-price">\${p.price} Tk</span>\`}
                </div>
              </div>
            </div>
          \`;
        }).join('');
      }

      function filterCategory(cat) {
        if(cat === 'PANJABI') renderShelf('PANJABI', 'grid-panjabi', 100);
        if(cat === 'T-SHIRT') renderShelf('T-SHIRT', 'grid-tshirts', 100);
      }

      function openProductViewer(id) {
        const product = globalProducts.find(p => p.id === id);
        if(!product) return;
        currentActiveProduct = product;
        selectedSize = '';
        selectedColor = '';

        document.getElementById('m-title').innerText = product.title;
        document.getElementById('m-desc').innerText = product.description || '';
        
        const priceLine = document.getElementById('m-price');
        const oldPriceLine = document.getElementById('m-oldprice');
        const discLabel = document.getElementById('m-discount');

        if(product.discount_price) {
          priceLine.innerText = product.discount_price + " Tk";
          oldPriceLine.innerText = product.price + " Tk";
          oldPriceLine.style.display = 'inline';
          discLabel.innerText = Math.round(((product.price - product.discount_price)/product.price)*100) + "% OFF";
          discLabel.style.display = 'inline';
        } else {
          priceLine.innerText = product.price + " Tk";
          oldPriceLine.style.display = 'none';
          discLabel.style.display = 'none';
        }

        const track = document.getElementById('modalSliderTrack');
        const nav = document.getElementById('modalSliderNav');
        const images = product.image_urls ? product.image_urls.split(',') : ['https://via.placeholder.com/400x500'];
        
        track.innerHTML = images.map(url => \`<img src="\${url.trim()}" />\`).join('');
        track.style.transform = "translateX(0px)";
        nav.innerHTML = images.map((_, idx) => \`<span class="slider-dot \${idx===0?'active':''}" onclick="slideTrack(\${idx})"></span>\`).join('');

        setupSelector('m-sizes', product.sizes, 'selectedSize');
        setupSelector('m-colors', product.colors, 'selectedColor');

        const actBtn = document.getElementById('m-action-btn');
        if(!product.in_stock) {
          actBtn.innerText = "OUT OF STOCK";
          actBtn.disabled = true;
        } else {
          actBtn.innerText = "Order Now";
          actBtn.disabled = false;
        }

        goToStep('step-product-view');
        document.getElementById('productModal').style.display = 'flex';
      }

      function slideTrack(index) {
        const track = document.getElementById('modalSliderTrack');
        track.style.transform = "translateX(-" + (index * 100) + "%)";
        const dots = document.querySelectorAll('#modalSliderNav .slider-dot');
        dots.forEach((d, i) => i === index ? d.classList.add('active') : d.classList.remove('active'));
      }

      function setupSelector(elementId, itemsCsv, variableName) {
        const box = document.getElementById(elementId);
        const arr = itemsCsv ? itemsCsv.split(',') : [];
        box.innerHTML = arr.map(i => \`<div class="selector-item" onclick="selectVariant(this,'\${elementId}','\${i.trim()}','\${variableName}')">\${i.trim()}</div>\`).join('');
      }

      function selectVariant(element, parentId, val, variableName) {
        document.querySelectorAll("#" + parentId + " .selector-item").forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        if(variableName === 'selectedSize') selectedSize = val;
        if(variableName === 'selectedColor') selectedColor = val;
      }

      function goToStep(stepId) {
        document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
        document.getElementById(stepId).classList.add('active');
        if(stepId === 'step-order-form') calculateDelivery();
      }

      function selectChannel(chan) {
        selectedChannelMethod = chan;
        document.getElementById('chanSite').checked = (chan === 'site');
        document.getElementById('chanWa').checked = (chan === 'wa');
        document.getElementById('opt-site').classList.toggle('selected', chan === 'site');
        document.getElementById('opt-wa').classList.toggle('selected', chan === 'wa');
      }

      function processChannelSelection() {
        if(!selectedSize || !selectedColor) {
          alert("Please select required Size and Color first.");
          return;
        }
        if(selectedChannelMethod === 'wa') {
          const basePrice = currentActiveProduct.discount_price || currentActiveProduct.price;
          const text = encodeURIComponent("Hello Nova Apparel, I want to order:\\nProduct: " + currentActiveProduct.title + "\\nSize: " + selectedSize + "\\nColor: " + selectedColor + "\\nPrice: " + basePrice + " Tk");
          window.open("https://wa.me/8801611764091?text=" + text, '_blank');
          closeModal();
        } else {
          goToStep('step-order-form');
        }
      }

      function calculateDelivery() {
        const zone = document.getElementById('f-zone').value;
        const subtotal = currentActiveProduct.discount_price || currentActiveProduct.price;
        const fee = (zone === 'inside') ? 60 : 120;
        
        document.getElementById('summary-subtotal').innerText = subtotal + " Tk";
        document.getElementById('summary-delivery').innerText = fee + " Tk";
        document.getElementById('summary-total').innerText = (subtotal + fee) + " Tk";
      }

      async function submitFinalOrder() {
        const name = document.getElementById('f-name').value.trim();
        const phone = document.getElementById('f-phone').value.trim();
        const address = document.getElementById('f-address').value.trim();
        const zone = document.getElementById('f-zone').value === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka';
        
        if(!name || !phone || !address) {
          alert("Complete all shipping form fields first.");
          return;
        }

        const subtotal = currentActiveProduct.discount_price || currentActiveProduct.price;
        const deliveryFee = (document.getElementById('f-zone').value === 'inside') ? 60 : 120;

        const payload = {
          name, address, phone, zone, deliveryFee,
          total: subtotal + deliveryFee,
          items: {
            product_id: currentActiveProduct.id,
            title: currentActiveProduct.title,
            size: selectedSize,
            color: selectedColor,
            unit_price: subtotal
          }
        };

        const response = await fetch('/api/orders/place', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if(data.success) {
          closeModal();
          triggerAestheticPopup();
        } else {
          alert("Order Error: " + data.error);
        }
      }

      function triggerAestheticPopup() {
        const pop = document.getElementById('popupAlert');
        pop.style.display = 'block';
        setTimeout(() => { pop.style.display = 'none'; }, 2500);
      }

      function closeModal() {
        document.getElementById('productModal').style.display = 'none';
      }

      window.onload = bootstrapStore;
    </script>
  </body>
  </html>`;
}

function getAboutViewHTML() {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Nova Apparel | Brand Architecture</title>
    <style>
      body { font-family: -apple-system, sans-serif; padding: 80px 10%; background:#fff; color:#111; line-height:1.8; }
      h1 { font-weight: 300; letter-spacing: 6px; margin-bottom: 40px; }
      p { color: #555; max-width: 700px; margin-bottom: 20px; }
      a { color: #000; text-decoration: none; font-weight:600; border-bottom: 1px solid #000;}
    </style>
  </head>
  <body>
    <h1>OUR BRAND VISION</h1>
    <p>Nova Apparel stems from an intersection of high-tier structural textiles and absolute minimalism.</p>
    <p>Every Panjabi release represents refined design structures intended for comfortable, everyday wear. Our modern casual t-shirts provide structural weights that maintain clean profiles across active seasonal transitions.</p>
    <a href="/">Return to Collection Catalog</a>
  </body>
  </html>`;
}

function getAdminViewHTML() {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Nova Apparel Dashboard</title>
    <style>
      body { font-family: system-ui, sans-serif; background: #fafafa; color: #111; margin: 0; display: flex; }
      #loginGate { position: fixed; top:0; left:0; width:100%; height:100%; background:white; z-index:10000; display:flex; justify-content:center; align-items:center; flex-direction:column; }
      .login-box { max-width: 400px; width:90%; padding: 40px; border: 1px solid #eee; background:#fff; }
      #sidebar { width: 260px; background: #111; color: white; min-height: 100vh; padding: 30px 20px; box-sizing: border-box; }
      #sidebar h2 { font-size: 1.1rem; letter-spacing: 3px; margin-bottom: 40px; text-align: center; }
      .nav-tab { padding: 12px 15px; cursor: pointer; color: #ccc; margin-bottom: 5px; display:block; text-decoration:none;}
      .nav-tab:hover, .nav-tab.active { background: #222; color: #fff; font-weight:bold; }
      main { flex-grow: 1; padding: 40px; box-sizing: border-box; background: #fafafa; height: 100vh; overflow-y: auto; }
      .view-panel { display: none; }
      .view-panel.active { display: block; }
      .input-ctrl { width:100%; padding:10px; margin: 8px 0; border: 1px solid #ddd; border-radius:4px; box-sizing: border-box; }
      .btn-run { background:#111; color:white; border:none; padding:12px 24px; font-weight:600; cursor:pointer; margin-right:5px;}
      .card-item { background: white; border: 1px solid #eee; padding: 20px; margin-bottom: 15px; border-radius:4px; display: flex; justify-content: space-between; align-items: center; }
      .badge-status { padding: 4px 10px; font-size: 0.8rem; font-weight:bold; text-transform:uppercase; border-radius: 3px; }
      .status-pending { background:#f39c12; color:white; }
      .status-confirmed { background:#2ecc71; color:white; }
      .status-cancelled { background:#e74c3c; color:white; }
    </style>
  </head>
  <body>

    <div id="loginGate">
      <div class="login-box">
        <h3 style="letter-spacing:2px; text-align:center; margin-bottom:20px;">NOVA CORE ACCESS</h3>
        <input type="email" id="admEmail" class="input-ctrl" placeholder="Gmail Address" value="novaapparel76@gmail.com">
        <input type="password" id="admPass" class="input-ctrl" placeholder="Secret Password">
        <button class="btn-run" style="width:100%; margin-top:15px;" onclick="attemptAdminLogin()">Authenticate System</button>
      </div>
    </div>

    <div id="sidebar">
      <h2>NOVA ADMIN</h2>
      <div class="nav-tab active" id="tab-orders" onclick="switchView('panel-orders', 'tab-orders')">Manage Live Orders</div>
      <div class="nav-tab" id="tab-products" onclick="switchView('panel-products', 'tab-products')">Manage Store Inventory</div>
    </div>

    <main>
      <div id="panel-orders" class="view-panel active">
        <h2>Live Purchase Pipelines</h2>
        <div style="margin:20px 0; display:flex; gap:10px;">
          <button class="btn-run" onclick="renderOrdersFilter('all')">All Orders</button>
          <button class="btn-run" style="background:#f39c12" onclick="renderOrdersFilter('Pending')">Pending Only</button>
          <button class="btn-run" style="background:#2ecc71" onclick="renderOrdersFilter('Confirmed')">Confirmed Only</button>
          <button class="btn-run" style="background:#e74c3c" onclick="renderOrdersFilter('Cancelled')">Cancelled Only</button>
        </div>
        <div id="ordersContainer">Loading pipeline records...</div>
      </div>

      <div id="panel-products" class="view-panel">
        <h2>Inventory mutation Control</h2>
        <div class="card-item" style="display:block; max-width:600px;">
          <h3 id="form-action-title">Add New Product Entry</h3>
          <input type="hidden" id="p-id">
          <select id="p-cat" class="input-ctrl">
            <option value="PANJABI">PANJABI Collection</option>
            <option value="T-SHIRT">T-SHIRT Line</option>
          </select>
          <input type="text" id="p-title" class="input-ctrl" placeholder="Product Title Name">
          <textarea id="p-desc" class="input-ctrl" placeholder="Description content specifications" rows="2"></textarea>
          <input type="number" id="p-price" class="input-ctrl" placeholder="Original Base Price (Tk)">
          <input type="number" id="p-discount" class="input-ctrl" placeholder="Discount Active Price (Tk)">
          <input type="text" id="p-imgs" class="input-ctrl" placeholder="Image URLs (Comma separated list)">
          <input type="text" id="p-sizes" class="input-ctrl" value="S,M,L,XL" placeholder="Sizes (Comma separated)">
          <input type="text" id="p-colors" class="input-ctrl" value="Black,White,Navy" placeholder="Colors (Comma separated)">
          <select id="p-stock" class="input-ctrl">
            <option value="1">In Stock</option>
            <option value="0">Out of Stock</option>
          </select>
          <button class="btn-run" style="margin-top:10px;" onclick="saveProductMutation()">Commit Product State</button>
          <button class="btn-run" style="margin-top:10px; background:#aaa;" onclick="resetProductForm()">Clear</button>
        </div>

        <h3>Current Inventory Listings</h3>
        <div id="adminProductsContainer">Loading available stock lines...</div>
      </div>
    </main>

    <script>
      let activeToken = '';
      let ordersCache = [];
      let productsCache = [];

      async function attemptAdminLogin() {
        const email = document.getElementById('admEmail').value;
        const password = document.getElementById('admPass').value;

        try {
          const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          const data = await res.json();
          if(data.success) {
            activeToken = data.token;
            document.getElementById('loginGate').style.display = 'none';
            bootstrapDashboardData();
          } else {
            alert("Credentials Rejected.");
          }
        } catch(e) { alert("Login connection error."); }
      }

      function switchView(panelId, tabId) {
        document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.getElementById(panelId).classList.add('active');
        document.getElementById(tabId).classList.add('active');
      }

      async function bootstrapDashboardData() {
        let res = await fetch('/api/admin/orders', { headers: { 'Authorization': activeToken } });
        ordersCache = await res.json();
        renderOrdersFilter('all');

        let pRes = await fetch('/api/products');
        productsCache = await pRes.json();
        renderAdminProducts();
      }

      function renderOrdersFilter(statusType) {
        const container = document.getElementById('ordersContainer');
        const filtered = statusType === 'all' ? ordersCache : ordersCache.filter(o => o.status === statusType);
        
        if(filtered.length === 0) {
          container.innerHTML = '<p>No records found.</p>';
          return;
        }

        container.innerHTML = filtered.map(o => {
          const item = JSON.parse(o.items_json);
          return \`
            <div class="card-item">
              <div>
                <strong>Order ID: #\${o.id} - \${o.customer_name}</strong> (\${o.phone_number})<br/>
                <span style="font-size:0.85rem; color:#555;">Address: \${o.shipping_address} (\${o.zone})</span><br/>
                <span style="font-size:0.85rem; font-weight:bold;">Item: \${item.title} [Size: \${item.size}, Color: \${item.color}]</span>
              </div>
              <div style="text-align:right;">
                <span class="badge-status status-\${o.status.toLowerCase()}">\${o.status}</span><br/>
                <strong style="display:block; margin:5px 0;">Total: \${o.total_amount} Tk</strong>
                <select onchange="updateOrderStatus(\${o.id}, this.value)" style="padding:5px;">
                  <option value="">Update Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirm">Confirm</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </div>
            </div>
          \`;
        }).join('');
      }

      async function updateOrderStatus(orderId, nextStatus) {
        if(!nextStatus) return;
        const mappedStatus = nextStatus === 'Cancel' ? 'Cancelled' : (nextStatus === 'Confirm' ? 'Confirmed' : 'Pending');
        
        await fetch('/api/admin/orders/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': activeToken },
          body: JSON.stringify({ orderId, status: mappedStatus })
        });
        bootstrapDashboardData();
      }

      function renderAdminProducts() {
        const container = document.getElementById('adminProductsContainer');
        container.innerHTML = productsCache.map(p => \`
          <div class="card-item">
            <div>
              <strong>\${p.title} (\${p.category})</strong> - Base: \${p.price} Tk | Active: \${p.discount_price || p.price} Tk<br/>
              <span style="font-size:0.85rem; color:#666;">Status: \${p.in_stock ? 'IN STOCK':'OUT OF STOCK'} | Sizes: \${p.sizes}</span>
            </div>
            <button class="btn-run" onclick="loadProductToForm(\${p.id})">Edit Item</button>
          </div>
        \`).join('');
      }

      function loadProductToForm(id) {
        const p = productsCache.find(item => item.id === id);
        if(!p) return;
        
        document.getElementById('p-id').value = p.id;
        document.getElementById('p-cat').value = p.category;
        document.getElementById('p-title').value = p.title;
        document.getElementById('p-desc').value = p.description || '';
        document.getElementById('p-price').value = p.price;
        document.getElementById('p-discount').value = p.discount_price || '';
        document.getElementById('p-imgs').value = p.image_urls || '';
        document.getElementById('p-sizes').value = p.sizes || 'S,M,L,XL';
        document.getElementById('p-colors').value = p.colors || 'Black,White,Navy';
        document.getElementById('p-stock').value = p.in_stock;

        document.getElementById('form-action-title').innerText = "Modify Product Entry ID: #" + p.id;
      }

      function resetProductForm() {
        document.getElementById('p-id').value = '';
        document.getElementById('p-title').value = '';
        document.getElementById('p-desc').value = '';
        document.getElementById('p-price').value = '';
        document.getElementById('p-discount').value = '';
        document.getElementById('p-imgs').value = '';
        document.getElementById('form-action-title').innerText = "Add New Product Entry";
      }

      async function saveProductMutation() {
        const id = document.getElementById('p-id').value;
        const payload = {
          category: document.getElementById('p-cat').value,
          title: document.getElementById('p-title').value,
          description: document.getElementById('p-desc').value,
          price: parseFloat(document.getElementById('p-price').value),
          discount_price: parseFloat(document.getElementById('p-discount').value) || null,
          image_urls: document.getElementById('p-imgs').value,
          sizes: document.getElementById('p-sizes').value,
          colors: document.getElementById('p-colors').value,
          in_stock: parseInt(document.getElementById('p-stock').value)
        };

        let endpoint = '/api/admin/products/create';
        let httpMethod = 'POST';

        if(id) {
          payload.id = parseInt(id);
          endpoint = '/api/admin/products/update';
          httpMethod = 'PUT';
        }

        const res = await fetch(endpoint, {
          method: httpMethod,
          headers: { 'Content-Type': 'application/json', 'Authorization': activeToken },
          body: JSON.stringify(payload)
        });

        if(res.ok) {
          alert("Product synchronized successfully.");
          resetProductForm();
          bootstrapDashboardData();
        } else {
          alert("Error saving mutation entry.");
        }
      }
    </script>
  </body>
  </html>`;
}