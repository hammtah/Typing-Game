
// by clicking on the theme2 palette button we change the theme to this theme
document.getElementById("theme-2-palette").addEventListener("click", ()=>{
    document.querySelector("body").classList.add("theme-2")
})
document.getElementById("theme-1-palette").addEventListener("click", ()=>{
    // because theme1 is the default theme, we don't have to add a "theme1" class 
    //because she is already there by default, because theme 1 is set in the body,
    // so all we have to do is to remove other themes classes from body so the theme1 will be set again
    document.querySelector("body").classList.remove("theme-2")
})