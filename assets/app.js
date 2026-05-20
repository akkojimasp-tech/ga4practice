const eventLog = document.getElementById('event-log');
const cartStatus = document.getElementById('cart-status');
const purchaseButton = document.getElementById('purchase-button');
const downloadMaterialButton = document.getElementById('download-material');
const demoForm = document.getElementById('demo-form');
const pageName = document.body.dataset.pageName || 'unknown';

let cartItem = loadCartItem();

function loadCartItem() {
  try {
    const stored = window.sessionStorage.getItem('ga4-demo-cart');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveCartItem(item) {
  try {
    if (item) {
      window.sessionStorage.setItem('ga4-demo-cart', JSON.stringify(item));
      return;
    }

    window.sessionStorage.removeItem('ga4-demo-cart');
  } catch {
    // Ignore storage failures in GitHub Pages demo mode.
  }
}

function logEvent(name, params) {
  if (!eventLog) {
    return;
  }

  eventLog.textContent = JSON.stringify({
    event: name,
    params,
    sentAt: new Date().toLocaleString('ja-JP')
  }, null, 2);
}

function sendEvent(name, params) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }

  logEvent(name, params);
}

function getProductData(card) {
  return {
    item_id: card.dataset.productId,
    item_name: card.dataset.productName,
    price: Number(card.dataset.productPrice),
    currency: 'JPY'
  };
}

document.querySelectorAll('[data-track-click]').forEach((button) => {
  button.addEventListener('click', () => {
    sendEvent(button.dataset.trackClick, {
      source: 'button',
      label: button.dataset.trackLabel,
      page_name: pageName
    });
  });
});

if (downloadMaterialButton) {
  downloadMaterialButton.addEventListener('click', () => {
    sendEvent('file_download', {
      file_name: 'ga4-study-material.pdf',
      link_text: '資料ダウンロード',
      page_name: pageName
    });
  });
}

document.querySelectorAll('.product-card').forEach((card) => {
  const item = getProductData(card);

  card.querySelector('[data-action="select-item"]').addEventListener('click', () => {
    sendEvent('select_item', {
      item_list_name: 'study_session_plans',
      items: [item]
    });
  });

  card.querySelector('[data-action="add-to-cart"]').addEventListener('click', () => {
    cartItem = item;
    saveCartItem(item);

    if (cartStatus) {
      cartStatus.textContent = `${item.item_name} がカートに入りました`;
    }

    sendEvent('add_to_cart', {
      value: item.price,
      currency: item.currency,
      items: [item],
      page_name: pageName
    });
  });
});

if (cartItem && cartStatus) {
  cartStatus.textContent = `${cartItem.item_name} がカートに入っています`;
}

if (purchaseButton) {
  purchaseButton.addEventListener('click', () => {
    if (!cartItem) {
      sendEvent('purchase_attempt_without_cart', {
        message: '商品未選択のまま購入が押されました',
        page_name: pageName
      });
      return;
    }

    sendEvent('purchase', {
      transaction_id: `demo-${Date.now()}`,
      value: cartItem.price,
      currency: cartItem.currency,
      items: [cartItem],
      page_name: pageName
    });

    cartItem = null;
    saveCartItem(null);

    if (cartStatus) {
      cartStatus.textContent = '購入イベントを送信しました';
    }
  });
}

if (demoForm) {
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(demoForm);
    const name = formData.get('name');
    const topic = formData.get('topic');

    sendEvent('generate_lead', {
      form_name: 'study_session_form',
      topic,
      user_name_length: String(name).length,
      page_name: pageName
    });

    demoForm.reset();
  });
}

window.addEventListener('load', () => {
  sendEvent('demo_view_loaded', {
    page_type: 'study_session_demo',
    page_name: pageName,
    page_path: window.location.pathname
  });
});