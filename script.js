var hamburguer = document.querySelector(".hamburguer"); 

hamburguer.addEventListener("click", function(){
    document.querySelector(".sidebar").classList.toggle("show-menu");
    document.querySelector(".hamburguer").classList.toggle("show-menu");
    document.querySelector("#line1").classList.toggle("show-menu");
    document.querySelector("#line2").classList.toggle("show-menu");
    document.querySelector("#line3").classList.toggle("show-menu");
}); 

const qtde = document.querySelector("#qtde").value

const buttonprojects = document.getElementById('divteste')

function ativar(){
    document.querySelector(".projects2").classList.toggle("show");

    if(document.querySelector(".projects2").classList.contains("show")) {
        buttonprojects.innerText = Oi
    }
}; 

function showNav(){
    document.querySelector(".navResponsive").classList.toggle("showNav");
}
