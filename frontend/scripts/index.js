const apiUrl='http://localhost:3000/'

async function fetchData(url){
  const dataPromise=await fetch(`${apiUrl}${url}`)
  const data=await dataPromise.json()
  return data
}

async function showProducts(){
  const cardEle=document.querySelector('.home-cards')
  const products=await fetchData('admin/get-product')
  products.forEach(product=>{
    cardEle.innerHTML+=`
    <div>
    <img src=${product.imageUrl} alt='Not Found' onerror="this.src='images/deals.jpg'">
    <h2>${product.title}</h2>
    <p>${product.description}</p>
    <p>$${product.price}</p>
    <a href="#" class="btn"> Details</a>
    <a href="#" class="btn"> Add to Cart </a>
    </div>
    `
  })
}

async function addProducts(){
  document.querySelector('.add-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const title=document.querySelector('[name="title"]').value
    const imageUrl=document.querySelector('[name="imageUrl"]').value
    const price=document.querySelector('[name="price"]').value
    const description=document.querySelector('[name="description"]').value

    fetch(`${apiUrl}admin/add-product`,{
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
      window.location.replace("http://127.0.0.1:5500/frontend/index.html")
    })
    
    
  })
}


function run(){
  const currentPath=window.location.pathname
  switch(currentPath) {
    case '/frontend/index.html':
      showProducts()
      break;
    case '/frontend/add-product.html':
      addProducts()
      break;
    case '/frontend/admin-product.html':
      console.log('In admin product')
      break;
    default:
      // code block
  }
}

run()

