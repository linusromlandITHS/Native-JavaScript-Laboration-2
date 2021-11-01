const main = document.querySelector("#main")
mainContentArea = document.querySelector("#mainContentArea")

/**
 * 
 * Shows the main content and hides loading display
 */
 loading = () => {
    console.log("Loading complete!")
    main.style.display = "block"
    mainContentArea.style.display = "flex";
    loadingArea.style.display = "none"
}