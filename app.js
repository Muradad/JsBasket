const cartBtn = document.querySelector(".cart-btn");
const clearCartBtn = document.querySelector(".btn-clear");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".total-value");
const cartContent = document.querySelector(".cart-list");
const productsDOM = document.querySelector("#products-dom");


// Boş bir səbət və düymə siyahısı yaradırıq
let cart = []; // Səbət massivi, içindəki məhsulları saxlayır
let buttonsDOM = []; // Məhsul düymələrini saxlayır

// Məhsulları gətirən asinxron funksiya təyin edirik
async function getProducts() {
    try {
        const response = await fetch("/db.json"); // db.json faylını tətbiq edirik
        const data = await response.json(); // JSON məlumatlarını açırıq
        return data; // Məhsul məlumatlarını qaytarırıq
    } catch (error) {
        console.error(error); // Səhv halında səhv mesajını konsola yazırıq
        return []; // Boş bir massiv qaytarırıq
    }
}

function displayProducts(products) {
    productsDOM.innerHTML = products.map(item => `
        <div class="col-lg-4 col-md-6">
            <div class="product">
                <div class="product-image">
                    <img src="${item.image}" alt="məhsul" class="img-fluid" />
                </div>
                <div class="product-hover">
                    <span class="product-price">$ ${item.price}</span>
                    <button class="btn-add-to-cart" data-id="${item.id}">
                        <i class="fas fa-cart-shopping"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// Səbət düymələrini əldə etmək üçün bir funksiya təyin edirik
function getBagButtons() {
    const buttons = document.querySelectorAll(".btn-add-to-cart"); // Məhsul əlavə et düymələrini seçirik
    buttonsDOM = Array.from(buttons); // Düymələri bir massivə çeviririk

    buttons.forEach(button => {
        const id = button.dataset.id; // Məhsulun unikal identifikatorunu əldə edirik
        const inCart = cart.some(item => item.id === id); // Məhsulun səbətdə olub-olmamasını yoxlayırıq

        if (inCart) {
            button.disabled = true; // Əgər məhsul səbətdədirsə düyməni deaktiv edirik
            button.style.opacity = "0.3"; // Düymənin opacitisini azaldırıq
        } else {
            button.addEventListener("click", () => addToCart(id)); // Səbətə əlavə et düyməsinə klik edildikdə addToCart funksiyasını çağırırıq
        }
    });
}

// Səbətə məhsul əlavə etmək üçün bir funksiya təyin edirik
function addToCart(id) {
    const button = buttonsDOM.find(button => button.dataset.id === id); // Düyməni tapırıq
    button.disabled = true; // Düyməni deaktiv edirik
    button.style.opacity = "0.3"; // Düymənin opacsini azaldırıq

    const product = getProduct(id); // Məhsulu əldə edirik
    const cartItem = { ...product, amount: 1 }; // Səbət elementini yaradırıq və məhsulu kopyalayaraq miqdarını 1ə təyin edirik
    cart.push(cartItem); // Səbətə elementi əlavə edirik
    saveCart(cart); // Səbeti qeyd edirik
    saveCartValues(cart); // Səbət dəyərlərini qeyd edirik
    addCartItem(cartItem); // Səbət məzmununa elementi əlavə edirik
    showCart(); // Səbeti göstəririk
}

// Səbət dəyərlərini yeniləmək üçün bir funksiya təyin edirik
function saveCartValues(cart) {
    let tempTotal = 0; // Vərəqil toplam dəyəri
    let itemsTotal = 0; // Ümumi məhsul sayı

    cart.forEach(item => {
        tempTotal += item.price * item.amount; // Vərəqil toplama qiymət * miqdar əlavə edirik
        itemsTotal += item.amount; // Məhsul sayını artırırıq
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2)); // Ümumi dəyəri yeniləyirik
    cartItems.innerText = itemsTotal; // Məhsul sayını yeniləyirik
}

function addCartItem(item) {
    const li = document.createElement("li");
    li.classList.add("cart-list-item");
    li.innerHTML = `
        <div class="cart-left">
            <div class="cart-left-image">
                <img src="${item.image}" alt="məhsul" class="img-fluid" />
            </div>
            <div class="cart-left-info">
                <a class="cart-left-info-title" href="#">${item.title}</a>
                <span class="cart-left-info-price">$ ${item.price}</span>
            </div>
        </div>
        <div class="cart-right">
            <div class="cart-right-quantity">
                <button class="quantity-minus" data-id="${item.id}">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.amount}</span>
                <button class="quantity-plus" data-id="${item.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="cart-right-remove">
                <button class="cart-remove-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    cartContent.appendChild(li);
}

function showCart() {
    cartBtn.click();
}

function setupAPP() {
    cart = getCart();
    saveCartValues(cart);
    populateCart(cart);
}

function populateCart(cart) {
    cart.forEach(item => addCartItem(item));
}

function cartLogic() {
    clearCartBtn.addEventListener
    cartContent.addEventListener("click", event => {
        if (event.target.classList.contains("cart-remove-btn")) {
            const removeItem = event.target; // Sil düyməsini əldə edirik
            const id = removeItem.dataset.id; // Elementin identifikatorunu əldə edirik
            removeItem.parentElement.parentElement.parentElement.remove(); // Elementi səbətdən silirik
            removeItemFromCart(id); // Səbətdən elementi silirik
            } else if (event.target.classList.contains("quantity-minus")) {
            const lowerAmount = event.target; // Miqdarı azalt düyməsini əldə edirik
            const id = lowerAmount.dataset.id; // Elementin identifikatorunu əldə edirik
            decreaseCartItemAmount(id); // Səbət elementinin miqdarını azaldırıq
            } else if (event.target.classList.contains("quantity-plus")) {
            const addAmount = event.target; // Miqdarı artır düyməsini əldə edirik
            const id = addAmount.dataset.id; // Elementin identifikatorunu əldə edirik
            increaseCartItemAmount(id); // Səbət elementinin miqdarını artırırıq
        }
    });
}

// Səbəti təmizləmək üçün bir funksiya təyin edirik
function clearCart() {
    const cartItems = cart.map(item => item.id); // Səbətdəki elementlərin identifikatorlarını əldə 
    cartItems.forEach(id => removeItemFromCart(id));  // Hər bir elementi səbətdən silirik
    while (cartContent.children.length > 0) {
    cartContent.removeChild(cartContent.children[0]); ; // Səbət içindəki məzmunu təmizləyirik
    }
    }
// Səbətdən elementi silmək üçün bir funksiya təyin edirik
function removeItemFromCart(id) {
cart = cart.filter(item => item.id !== id); // Elementi səbətdən çıxarıraq filterləyirik    
saveCart(cart); // Sepeti kaydediyoruz
const button = buttonsDOM.find(button => button.dataset.id === id); // Əlaqəli düyməni tapiriq
button.disabled = false; // Düyməni aktiv edirik
button.style.opacity = "1"; // Düymənin saydamlığını normallaşdırırıq
}
// Səbət elementinin miqdarını azaltmaq üçün bir funksiya təyin edirik
function decreaseCartItemAmount(id) {
    const tempItem = cart.find(item => item.id === id);// Elementi müvəqqəti olaraq əldə edirik
    if (tempItem.amount > 1) {
        tempItem.amount--; // Miqdarı azaldırıq
        saveCart(cart); // Səbeti yadda saxlayırıq
        saveCartValues(cart); // Səbət dəyərlərini yeniləyirik        
        const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);//Miktarı gösteren elementi alıyoruz
        quantityElement.innerText = tempItem.amount;  // Miqdarı yeniləyirik
    } else {
        removeItemFromCart(id);// Əgər miqdar 1-dirsə elementi səbətdən silirik
    }
}
// Səbət elementinin miqdarını artırmaq üçün bir funksiya təyin edirik
function increaseCartItemAmount(id) {
    const tempItem = cart.find(item => item.id === id); // Elementi müvəqqəti olaraq əldə edirik
    tempItem.amount++; // Miqdarı artırırıq
    saveCart(cart); // Səbeti yadda saxlayırıq
    saveCartValues(cart); // Səbət dəyərlərini yeniləyirik
    const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);//Miktarı gösteren elementi alıyoruz
    quantityElement.innerText = tempItem.amount; // Miqdarı yeniləyirik
}
// Səbeti brauzer yerli saxlamaq üçün bir funksiya təyin edirik
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart)); // Səbeti JSON formatında yerli saxlamaqda saxlayırıq
    }
    
    // Səbeti yerli saxlamadan əldə etmək üçün bir funksiya təyin edirik
    function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || []; // Səbeti əldə edirik və ya boş bir massiv qaytarırıq
    }
    
    // Məhsulu identifikatora görə əldə etmək üçün bir funksiya təyin edirik
    function getProduct(id) {
    const products = JSON.parse(localStorage.getItem("products")); // Məhsulları yerli saxlamadan əldə edirik
    return products.find(product => product.id === id); // Müvafiq məhsulu identifikatora görə tapırıq
    }
    
    // Səhifə yükləndikdə tətbiqi başlatmaq üçün bir funksiya təyin edirik
    document.addEventListener("DOMContentLoaded", async () => {
    setupAPP(); // Tətbiqi başlatırıq
    const products = await getProducts(); // Məhsulları əldə edirik
    displayProducts(products); // Məhsulları göstəririk
    getBagButtons(); // Səbət düymələrini əldə edirik
    cartLogic(); // Səbeti idarə edirik
    });
    // addToCart(id) funksiyası, bir məhsulu səbətə əlavə etmək üçün istifadə edilir.
    function addToCart(id) {
    const button = buttonsDOM.find(button => button.dataset.id === id); // Müvafiq məhsul düyməsini tapırıq

    
    
    
    button.disabled = true; // Düyməni deaktiv edirik, beləliklə eyni məhsulu təkrar əlavə edə bilməzlər
    button.style.opacity = "0.3"; // Düymənin saydamlığını azaldırıq, seçilə bilməz halına gəlirik
    
    const product = getProduct(id); // Verilən identifikatora sahib məhsulu əldə edirik
    const cartItem = { ...product, amount: 1 }; // Məhsulu kopyalayaraq və miqdarı 1-ə təyin edərək səbət elementini yaradırıq
    cart.push(cartItem); // Səbətə məhsulu əlavə edirik
    saveCart(cart); // Səbeti yerli saxlayırıq
    saveCartValues(cart); // Səbət dəyərlərini yeniləyirik
    addCartItem(cartItem); // Səbət məzmununa elementi əlavə edirik
    showCart(); // Səbeti göstəririk
    
}

//qiymetleri sildikde totalmdan silinsn
function removeItemFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    saveCartValues(cart);
    const button = buttonsDOM.find(button => button.dataset.id === id);
    button.disabled = false;
    button.style.opacity = "1";
}

function decreaseCartItemAmount(id) {
    const tempItem = cart.find(item => item.id === id);
    if (tempItem.amount > 1) {
        tempItem.amount--;
        saveCart(cart);
        saveCartValues(cart);
        const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);
        quantityElement.innerText = tempItem.amount;
    } else {
        removeItemFromCart(id);
    }
}

function increaseCartItemAmount(id) {
    const tempItem = cart.find(item => item.id === id);
    tempItem.amount++;
    saveCart(cart);
    saveCartValues(cart);
    const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);
    quantityElement.innerText = tempItem.amount;
}

