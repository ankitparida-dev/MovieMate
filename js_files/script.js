const trailerBtn = document.querySelector(".trailer");
const overlay = document.querySelector(".overlay");
const items = document.querySelector(".items");
const navbar = document.querySelector(".nav-bar");
const trailerIframe = document.querySelector(".youtube-trailer iframe");
const next_prev = document.querySelector(".next-prev");


trailerBtn.addEventListener("click", function() {
    // Set transitions first
    navbar.style.transition = "opacity 1s";
    overlay.style.transition = "opacity 1s";
    items.style.transition = "opacity 1s";
    trailerIframe.style.transition = "opacity 1s";
    next_prev.style.transition = "opacity 1s";


    trailerIframe.style.zIndex = 2;
    trailerIframe.style.opacity = 1;
    overlay.style.opacity = 0;
    items.style.opacity = 0;
    navbar.style.opacity = 0;
    next_prev.style.opacity = 0;
});


    // trailerBtn.addEventListener("click",function(){
    //     heroVideo.style.zIndex = -6;
    //     overlay.style.opacity = 1;
    //     items.style.opacity = 2;
    //     navbar.style.opacity = 2;
    // });