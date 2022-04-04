var hamburguer = document.querySelector(".hamburguer"); 

hamburguer.addEventListener("click", function(){
    document.querySelector(".sidebar").classList.toggle("show-menu");
    document.querySelector(".hamburguer").classList.toggle("show-menu");
    document.querySelector("#line1").classList.toggle("show-menu");
    document.querySelector("#line2").classList.toggle("show-menu");
    document.querySelector("#line3").classList.toggle("show-menu");
}); 

const qtde = document.querySelector("#qtde").value




function ativar(){
    var btnProjects = document.getElementById('btnShowProjects')
    document.querySelector(".projects2").classList.toggle("show");

     if(document.querySelector(".projects2").classList.contains("show")) {
         btnProjects.innerHTML = "Ver menos"
    } else {
        btnProjects.innerHTML = "Ver mais"
    }


}; 

function showNav(){
    document.querySelector(".navResponsive").classList.toggle("showNav");
}
