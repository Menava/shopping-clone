const apiUrl='http://localhost:3000/'

async function fetchData(url){
  const dataPromise=await fetch(`${apiUrl}${url}`)
  const data=await dataPromise.json()
  return data
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
    <a href="#" class="btn">  ${editing?'DELETE':'Add to Cart'} </a>
    </div>
    `
  })
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
    default:
      // code block
  }
}

run()

