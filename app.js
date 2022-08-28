document.addEventListener("DOMContentLoaded", initUI);

function initUI() {
  const addToCart = document.querySelectorAll(".book-item-button");
  console.log(addToCart);
  addToCart.forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });
  const form = document.querySelector(".booking-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    // save to localStorage
    localStorage.setItem("booking.customer", JSON.stringify(formData));

    const customerName = JSON.parse(
      localStorage.getItem("booking.customer")
    ).name;

    const bookingBtn = document.querySelector(".booking-btn");
    bookingBtn.textContent = "Saving...";

    setTimeout(() => {
      const checkoutContainer = document.querySelector(".checkout-container");
      checkoutContainer.innerHTML = `
        <div class="complete-state text-center border rounded mt-5 px-4 py-3">
          <i class="bi bi-check-circle-fill fs-1"></i>
          <h2 class="mt-3">Thank you , ${customerName}!</h2>
          <p class="mt-3">
            We've saved your order details! Will contact you soon.
          </p>
          <div class="d-flex justify-content-center mt-4">
            <button class="btn btn-dark">Continue</button>
          </div>
        </div>`;
    }, 2000);
  });
  const signButton = document.querySelector(".sign-btn");
  signButton.addEventListener("click", () => {
    const formComfirm = document.querySelector(".sign-form");
    if (formComfirm.style.display === "none") {
      formComfirm.style.display = "block";
    } else {
      formComfirm.style.display = "none";
    }
  });
  
}

function handleAddToCart(event) {
  const shopItem = event.target.closest(".booking");
  const title = shopItem.querySelector(".hotel-title").textContent;
  const price = shopItem.querySelector(".hotel-price").textContent;
  const img = shopItem.querySelector(".hotel-image").src;
  addItemToUI(title, price, img);
  updateCartTotal();
}

function addItemToUI(title, price, img) {
  const cartRow = document.createElement("div");
  cartRow.classList.add("card-row");
  const cartItemNames = document.querySelectorAll(".card-item-title");
  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].textContent == title) {
      console.log("same");
      alert("Item already added");
      return;
    }
  }
  const cartItems = document.querySelector(".card-items");
  const cartRowContent = `<div class='card-item row justify-content-space-between align-items-center border py-3 px-1 fs-6'>
                            <div class='col-2'>
                                <img class='cart-img img-fluid' src=${img} alt='' />
                            </div>
                            <div class='col-6'>
                                <p class='card-item-title pb-0'>${title}</p>
                                <p class='card-price text-secondary pb-0'>${price}</p>
                            </div>
                            <div class='col-2'>
                                <input class='card-quantity-input w-100' type='number' min='1' value='1' />
                            </div>
                            <div class="col-1 text-center">
                                <button class="card-remove btn btn-danger btn-sm text-center rounded-full "> 
                                Remove</button>
                        </div>`;

  cartRow.innerHTML = cartRowContent;
  cartItems.appendChild(cartRow);

  const toast = new bootstrap.Toast(document.querySelector("#notification"));
  toast.show();
  const offcanvas = new bootstrap.Offcanvas("#cart-sidebar");
  offcanvas.show();

  cartRow.querySelector(".card-remove").addEventListener("click", removeItem);
  cartRow
    .querySelector(".card-quantity-input")
    .addEventListener("change", handleQuantityChange);
}

function handleQuantityChange(event) {
  const input = event.target;
  if (input.value.value < 1) {
    input.value = 1;
  }
  updateCartTotal();
}

function removeItem(event) {
  const deleteConfirm = confirm("Are you sure to delete?");
  if (deleteConfirm) {
    const btnClicked = event.target;

    btnClicked.closest(".card-row").remove();
  }
  updateCartTotal();
}
function updateCartTotal() {
  const cartItemsContainers = document.querySelector(".card-items");
  const cartRow = cartItemsContainers.querySelectorAll(".card-row");
  let total = 0;
  cartRow.forEach((row) => {
    const priceEl = row.querySelector(".card-price");
    const quantityInput = row.querySelector(".card-quantity-input");
    const price = parseFloat(priceEl.textContent);
    const quantity = quantityInput.value;

    total = total + price * quantity;
  });
  //console.log(total);
  document.querySelector(".cart-total-price").textContent = total.toFixed(2);
}
