// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", function(){
    const quoteForm = document.getElementById("new-quote-form")





    fetchQuotes().then(renderQuotes)
    quoteForm.addEventListener("submit", newQuote)


   

    
    function fetchQuotes(){
        console.log("beginning of fetchQuotes function")
        return fetch("http://localhost:3000/quotes?_embed=likes")
        .then(r => r.json())

    }
    
    
    function renderQuotes(quotes){
        console.log("beginning of renderQuotes")
        let myQuotes = document.querySelector("#quote-list")
        myQuotes.innerHTML = ""
        
        quotes.forEach(quote => {
            let quoteCard = document.createElement("li")
            quoteCard.class = "quote-card"
            quoteCard.id = quote.id

            quoteCard.innerHTML = `<blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
        <button data-id=${quote.id} class='btn-success'>Likes: <span id=span>${quote.likes.length}</span></button>
            <button data-id=${quote.id} class='btn-danger'>Delete</button>
          </blockquote>`
          myQuotes.append(quoteCard)

        })
        let delButtons = document.getElementsByClassName("btn-danger")
        for (let i = 0; i < delButtons.length; i++) {
            delButtons[i].addEventListener("click", deleteQuote)
        }

        let likeButtons = document.getElementsByClassName("btn-success")
        for (let i = 0; i < likeButtons.length; i++) {
            likeButtons[i].addEventListener("click", likeQuote)
        }
        console.log("end of renderQuotes function")
       
    }


    function newQuote(event){
        console.log("beginning of newQuote function")
        event.preventDefault()
        let quoteInput = document.getElementById("new-quote-input")
        let quoteAuthor = document.getElementById("author")



        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "Accept": "applicaton/json"
            },
            body: JSON.stringify({quote: quoteInput.value, author: quoteAuthor.value})
        })
        .then(r => r.json())
        .then(quote => {


            let myQuotes = document.querySelector("#quote-list")
            let quoteCard = document.createElement("li")
            quoteCard.class = "quote-card"
            quoteCard.id = quote.id
            quoteCard.innerHTML = `<blockquote class="blockquote">
                <p class="mb-0">${quoteInput.value}</p>
                <footer class="blockquote-footer">${quoteAuthor.value}</footer>
                <br>
            <button data-id=${quote.id} class='btn-success'>Likes: <span id=span>0</span></button>
                <button data-id=${quote.id} class='btn-danger'>Delete</button>
              </blockquote>`
              
              myQuotes.append(quoteCard)
            
            fetchQuotes().then(renderQuotes)
            console.log(quote.id)
            quoteInput.value = ""
            quoteAuthor.value = ""
    
            
            console.log("end of newQuote function")

        })

    }


    function deleteQuote(event){
        console.log("deleteQuote function")
        console.log("working")
        let quoteToDel = event.target.dataset.id
        console.log(quoteToDel)
        fetch(`http://localhost:3000/quotes/${quoteToDel}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: quoteToDel})
        })
        .then(r => r.json())
        .then(deleted => {

            let goodBye = document.getElementById(quoteToDel)
            goodBye.parentNode.removeChild(goodBye)
        })
    }



    function likeQuote(event){
        let updateButton = event.target
     
        function secondsSinceEpoch(){ return Math.floor( Date.now() / 1000 ) }
        let createdAt = secondsSinceEpoch();
        let likeThisQuote = parseInt(event.target.dataset.id);
        
        console.log("beginning of likeQuote")
    

        fetch(`http://localhost:3000/likes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({quoteId: likeThisQuote, createdAt: createdAt})
        })
        .then(r => r.json())
        .then(like => {
            fetchQuotes().then(renderQuotes)
        })
    }
   
})

