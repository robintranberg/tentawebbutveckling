class PhotoGallery
{
    //Constructor containing my selectors
    constructor()
    {
        this.API_KEY = '563492ad6f917000010000013a6f79bdd68a47199caa701bab553adf';
        // The querySelector() method returns the first element that matches a specified CSS selector(s) in the document.
        this.galleryDIv = document.querySelector('.gallery');
        this.searchForm = document.querySelector('.header form');
        this.loadMore = document.querySelector('.load-more');
        this.logo = document.querySelector('.logo');
        this.pageIndex = 1;
        this.searchValueGlobal = '';
        this.eventHandle();
    }
    //Eventhandler, eg when the DOMContent is loaded I wanna retrieve the pictures from my API_KEY
    eventHandle()
    {
        document.addEventListener('DOMContentLoaded', () => {
            this.getImg(1);
        });
        this.searchForm.addEventListener('submit', (e) => {
            this.pageIndex = 1;
            this.getSearchedImages(e);
        });
        this.loadMore.addEventListener('click', (e) => {
            this.loadMoreImages(e);
        });
        this.logo.addEventListener('click', () => {
            this.pageIndex = 1;
            this.galleryDIv.innerHTML = '';
            this.getImg(this.pageIndex);
        });
    }
    //Getting images from my API_KEY by calling the function fetchImages.
    async getImg(index){
        this.loadMore.setAttribute('data-img', 'curated');
        const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
        console.log(data);
    }
    //Fetching the images from my API_KEY
    async fetchImages(baseURL){
        const response = await fetch(baseURL,{
            method: 'GET',
            headers:{
                Accept: 'application/json',
                Authorization: this.API_KEY
            }
        });
        const data = await response.json();
        return data;
    }
            // the document.createElement() method creates the HTML element specified by tagName, or an HTMLUnknownElement if tagName isn't recognized.
    GenerateHTML(photos){
        photos.forEach(photo=>{
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
            <a class="popup" onclick="popup('${photo.src.original}','${photo.photographer}');"/>
            <img class="main" src="${photo.src.medium}"></button>
            <h3>${photo.photographer}</h3>
            </a>
            `;
            this.galleryDIv.appendChild(item);
        })
    }
    async getSearchedImages(e){
        this.loadMore.setAttribute('data-img', 'search');
        // preventDefault method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
        e.preventDefault();
        this.galleryDIv.innerHTML = '';
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue;
        const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos)
        e.target.reset();
    }
    async getMoreSearchedImages(index){
        const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`;
        const data = await this.fetchImages(baseURL);
        console.log(data);
        this.GenerateHTML(data.photos)
    }
    loadMoreImages(e){
        let index = ++this.pageIndex;
        // The getAttribute() method of the Element interface returns the value of a specified attribute on the element. 
        // If the given attribute does not exist, the value returned will either be null or "" (the empty string);
        const loadMoreData = e.target.getAttribute('data-img');
        if(loadMoreData === 'curated')
        {
            this.getImg(index)
        }
        else
        {
            this.getMoreSearchedImages(index);
        }
    }
}
//Creating a new instance of the PhotoGallery
const gallery = new PhotoGallery;

// Retrieve the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, the modal opens
function popup(url,name){
    modal.style.display = "block";
    document.getElementById("head").innerHTML = name;
    document.getElementById("imgs").src = url;
    document.getElementById("foot").href = url;
    document.getElementById("foot").innerHTML = 'Open image in a new window';
}

// When the user clicks on <span> (x), the modal closes
span.onclick = function() {
  modal.style.display = "none";
}

// When clicking outside of the modal, windows is closed.
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}