const apiUrl='http://localhost:3000/'

async function fetchData(url){
  const dataPromise=await fetch(`${apiUrl}${url}`,{
    credentials:"include"
  })
  const data=await dataPromise.json()
  return data
}

function cardClicked(e){
  if(e.target.textContent.trim()==='DELETE'){
    fetch(`${apiUrl}${`admin/delete-product/${e.target.dataset.pid}`}`,{credentials:"include"}).then(result=>location.reload())
  }
  if(e.target.textContent.trim()==="Add to Cart"){
    fetch(`${apiUrl}${`add-to-cart/${e.target.dataset.pid}`}`,{credentials:"include"}).then(result=>result.text().then(result=>console.log(result)))
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
    fetch(`${apiUrl}deleteCart/${e.target.dataset.proid}`,{credentials:"include"}).then(result=>location.reload())
  }
  else if(e.target.textContent.trim()==='Order Now'){
    fetch(`${apiUrl}addOrder`,{credentials:"include"}).then(window.location.replace("order.html"))
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
      credentials:"include",
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

async function loginSubmit(e){
  e.preventDefault()
  const username=document.querySelector('[name="username"]').value
  const password=document.querySelector('[name="password"]').value

  fetch(`${apiUrl}login`,
  {
    method:'POST',
    headers:{"Content-Type":"application/json"},
    credentials:"include",
    body:JSON.stringify({
      email:username,
      password:password
    })
  }).then(result=>{
    if(!result.ok){
      return result.text().then(result=>console.log(result))
    }
    return result.json().then(data=>{
      document.cookie=`user=${JSON.stringify(data)}`
      window.location.replace('index.html')
    })
  }).catch(err=>console.log(err))
}


async function signupSubmit(e){
  e.preventDefault()
  const name=document.querySelector('[name="name"]').value
  const email=document.querySelector('[name="email"]').value
  const password=document.querySelector('[name="password"]').value


  fetch(`${apiUrl}signup`,
  {
    method:'POST',
    headers:{"Content-Type":"application/json"},
    credentials:"include",
    body:JSON.stringify({
      name:name,
      email:email,
      password:password
    })
  }).then(result=>{
    if(result.ok){
      return window.location.replace("login.html")
    }
    return result.text()
  })
  .then(result=>console.log(result))
}

async function logoutEvent(e){
  fetch(`${apiUrl}logout`,
  {
    credentials:"include",
  }).then(result=>{
    document.cookie='user=null;Max-Age=0'
    window.location.replace('login.html')

  })
}

async function resetPasswordEvent(e){
  e.preventDefault()

  fetch(`${apiUrl}reset-password`,
  {
    credentials:'include',
    headers:{"Content-Type":"application/json"},
    method:'POST',
    body:JSON.stringify({
      email:document.querySelector('[name="email"]').value
    })
  }).then(result=>{
    if(!result.ok){
      return result.text().then(result=>{
        throw new Error(result)
      })
    }
    return result.text()
  })
  .then(result=>{
    console.log(result)
  })
  .catch(err=>{
    console.log(err)
  })
}

async function confirmResetEvent(e,token){
  e.preventDefault()
  fetch(`${apiUrl}reset-password/${window.location.search.split('=')[1]}`,{
    credentials:'include',
    method:'POST',
    headers:{'Content-Type':"application/json"},
    body:JSON.stringify({
      password:document.querySelector('[name="password"]').value,
      confirmPassword:document.querySelector('[name="confirmPassword"]').value
    })
  })
  .then(result=>{
    if(!result.ok){
      return result.text().then(result=>{
        throw new Error(result)
      })
    }
    return result.text()
  })
  .then(result=>{
    return window.location.replace('login.html')
  })
  .catch(err=>{
    console.log(err)
  })
}

function run(){
  const currentPath=window.location.pathname
  let productID
  switch(currentPath) {
    case '/frontend/index.html':
      buildNav()
      showProducts(false)
      break;
    case '/frontend/add-product.html':
      buildNav()
      productID=window.location.search.split('=')[1]
      addProducts(productID)
      break;
    case '/frontend/admin-product.html':
      buildNav()
      showProducts(true)
      break;
    case '/frontend/product.html':
      buildNav()
      productID=window.location.search.split('=')[1]
      showProduct(productID)
      break;
    case '/frontend/cart.html':
      buildNav()
      document.querySelector('.cart').addEventListener('click',cartClicked)
      showCart()
      break;
    case '/frontend/order.html':
      buildNav()
      showOrder()
      break;
    case '/frontend/login.html':
      buildNav()
      const loginFormEle=document.querySelector('.login-form')
      loginFormEle.addEventListener('submit',loginSubmit)
      break;
    case '/frontend/signup.html':
      buildNav()
      const signupFormEle=document.querySelector('.signup')
      signupFormEle.addEventListener('submit',signupSubmit)
      break;
    case '/frontend/reset-password.html':
      buildNav()
      const resetFormEle=document.querySelector('.reset-form')
      resetFormEle.addEventListener('submit',resetPasswordEvent)
      break;
    case '/frontend/confirm-reset.html':
      buildNav()
      const confirmResetFormEle=document.querySelector('.confirm-reset-form')
      confirmResetFormEle.addEventListener('submit',confirmResetEvent)
      break;
    default:
      // code block
  }
}

run()


function buildNav(){
  const containerEle=document.querySelector('.container')

  const navEle=document.createElement('nav')
  const imgEle=document.createElement('img')

  const ulEle=document.createElement('ul')
  const mainLiEle=document.createElement('li')
  const mainLinkEle=document.createElement('a')
  const mainLiEle1=document.createElement('li')
  const mainLinkEle1=document.createElement('a')
  const mainLiEle2=document.createElement('li')
  const mainLinkEle2=document.createElement('a')
  const mainLiEle3=document.createElement('li')
  const mainLinkEle3=document.createElement('a')

  const ulEle1=document.createElement('ul')
  const rightLiEle=document.createElement('li')
  const rightIconEle=document.createElement('i')
  const rightLiEle1=document.createElement('li')
  const rightLinkEle=document.createElement('a')
  const rightIconEle1=document.createElement('i')
  const rightLiEle2=document.createElement('li')
  const rightIconEle2=document.createElement('i')
  const rightLiEle3=document.createElement('li')
  const rightLinkEle1=document.createElement('a')
  const rightIconEle3=document.createElement('i')
  

  navEle.classList.add('main-nav')
  ulEle.classList.add('main-menu')
  ulEle1.classList.add('right-menu')
  rightIconEle.classList.add('fas','fa-search')
  rightIconEle1.classList.add('fas','fa-shopping-cart')
  rightIconEle2.classList.add('fa-regular','fa-user','fa-lg')
  rightIconEle3.classList.add('fa-solid','fa-bars')

  imgEle.setAttribute("src", "images/logo1.jpg");
  mainLinkEle.setAttribute("href", "index.html");
  mainLinkEle1.setAttribute("href", "order.html");
  mainLinkEle2.setAttribute("href", "add-product.html");
  mainLinkEle3.setAttribute("href", "admin-product.html");

  rightLinkEle.setAttribute("href", "cart.html");
  rightLinkEle1.setAttribute("href", "login.html");

  mainLinkEle.textContent='Products'
  mainLinkEle1.textContent='Orders'
  mainLinkEle2.textContent='Add Product'
  mainLinkEle3.textContent='Admin Products'
  
  containerEle.appendChild(navEle)
  navEle.appendChild(imgEle)
  navEle.appendChild(ulEle)
  navEle.appendChild(ulEle1)

  ulEle.appendChild(mainLiEle)
 

  mainLiEle.appendChild(mainLinkEle)
  mainLiEle1.appendChild(mainLinkEle1)
  mainLiEle2.appendChild(mainLinkEle2)
  mainLiEle3.appendChild(mainLinkEle3)

  ulEle1.appendChild(rightLiEle)
  ulEle1.appendChild(rightLiEle1)
  ulEle1.appendChild(rightLiEle2)
  ulEle1.appendChild(rightLiEle3)

  rightLiEle.appendChild(rightIconEle)
  rightLiEle1.appendChild(rightLinkEle)
  rightLinkEle.appendChild(rightIconEle1)
  rightLiEle2.appendChild(rightLinkEle1)
  rightLinkEle1.appendChild(rightIconEle2)
  rightLiEle3.appendChild(rightIconEle3)

  if(document.cookie){
    let user=JSON.parse(document.cookie.split('=')[1])
    if(user){
      ulEle.appendChild(mainLiEle1)
      ulEle.appendChild(mainLiEle2)
      ulEle.appendChild(mainLiEle3)

      rightLinkEle1.removeAttribute('href')
      rightLinkEle1.addEventListener('click',logoutEvent);
    }
  }
  
}

