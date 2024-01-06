const apiUrl='http://localhost:3000/'

async function fetchData(url){
  const dataPromise=await fetch(`${apiUrl}${url}`)
  const data=await dataPromise.json()
  return data
}

function cardClicked(e){
  if(e.target.textContent.trim()==='DELETE'){
    fetch(`${apiUrl}${`admin/delete-product/${e.target.dataset.pid}`}`).then(result=>location.reload())
  }
  if(e.target.textContent.trim()==="Add to Cart"){
    fetch(`${apiUrl}${`add-to-cart/${e.target.dataset.pid}`}`).then(result=>result.text().then(result=>console.log(result)))
  }

}

async function showProducts(editing){
  const cardEle=document.querySelector('.home-cards')
  const products=await fetchData('products')
  products.forEach(product=>{
    cardEle.innerHTML+=`
    <div>
    <img src=${product.imageUrl} alt='Not Found' onerror="this.src='images/deals.jpg'">
    <h2>${product.title}</h2>
    <p>${product.description}</p>
    <p>$${product.price}</p>
    <a href='${editing?`add-product.html?productID=${product._id}`:`product.html?productID=${product._id}`}' class="btn"> ${editing?'Edit':'Details'}</a>
    <a href="#" class='btn' data-pid=${product._id}> ${editing?'DELETE':'Add to Cart'} </a>
    </div>
    `
  })
  cardEle.addEventListener('click',cardClicked)
}

async function showProduct(prodID){
  const prodEle=document.querySelector('.product')
  const product=await fetchData(`products/${prodID}`)
  prodEle.innerHTML=
  `
    <h2>${product.title}</h2>
    <img src="${product.imageUrl}" alt="No Image" onerror="this.src='./images/deals.jpg'">
    <p>$${product.price}</p>
    <p>${product.description}</p>
    <a class="btn">Add to Cart</a>
  `
}

function cartClicked(e){
  if(e.target.textContent.trim()==='DELETE')
  {
    fetch(`${apiUrl}deleteCart/${e.target.dataset.proid}`).then(result=>location.reload())
  }
  else if(e.target.textContent.trim()==='Order Now'){
    fetch(`${apiUrl}addOrder`).then(window.location.replace("order.html"))
  }
}

async function showCart(){
  const itemCard=document.querySelector('.cart')
  const cart=await fetchData('getCart')
  
  if(cart.length==0){
    itemCard.innerHTML='Your Cart is empty'
  }
  else{
    cart.forEach(item=>{
      console.log(item.productID._id)
      itemCard.innerHTML+=
      `
        <div>
          <p>${item.productID.title}</p>
          <p>Quantity:${item.quantity}</p>
          <a href="#" class="btn" data-proID=${item.productID._id}> DELETE</a>
        </div>
      `
    })
    itemCard.innerHTML+=`<button class="btn"> Order Now</button>`
  }
}

async function addProducts(productID){
  if(productID){
    const product=await fetchData(`products/${productID}`)
    document.querySelector('[name="title"]').value=product.title
    document.querySelector('[name="imageUrl"]').value=product.imageUrl
    document.querySelector('[name="price"]').value=product.price
    document.querySelector('[name="description"]').value=product.description
  }
  document.querySelector('.add-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const title=document.querySelector('[name="title"]').value
    const imageUrl=document.querySelector('[name="imageUrl"]').value
    const price=document.querySelector('[name="price"]').value
    const description=document.querySelector('[name="description"]').value

    fetch(`${apiUrl}${productID?`admin/update-product/${productID}`:'admin/add-product'}`,{
      method:'POST',
      body:JSON.stringify({
        title:title,
        imageUrl:imageUrl,
        price:price,
        description:description
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response=>{
      if(!response.ok){
        throw new Error('Something went wrong')
      }
      window.location.replace("index.html")
    })
  })
}

async function showOrder(){
  const ordersEle=document.querySelector('.orders')
  const orders=await fetchData('order')
  orders.forEach(order=>{
    let newDiv=document.createElement('div')
    let newTitle=document.createElement('h2')
    newTitle.textContent=`Order - #${order._id}`
    let newUl=document.createElement('ul')
    
    order.items.forEach(item=>{
      let newLi=document.createElement('li')
      newLi.classList.add('btn')
      newLi.textContent=`${item.product.title}(${item.quantity})`
      newUl.appendChild(newLi)
    })

    newDiv.appendChild(newTitle)
    newDiv.appendChild(newUl)
    ordersEle.appendChild(newDiv)
  })
}

function run(){
  const currentPath=window.location.pathname
  let productID
  switch(currentPath) {
    case '/frontend/index.html':
      showProducts(false)
      break;
    case '/frontend/add-product.html':
      productID=window.location.search.split('=')[1]
      addProducts(productID)
      break;
    case '/frontend/admin-product.html':
      showProducts(true)
      break;
    case '/frontend/product.html':
      productID=window.location.search.split('=')[1]
      showProduct(productID)
      break;
    case '/frontend/cart.html':
      document.querySelector('.cart').addEventListener('click',cartClicked)
      showCart()
      break;
    case '/frontend/order.html':
      showOrder()
      break
    default:
      // code block
  }
}

run()

