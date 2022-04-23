const pages = [
    [
        "Connect 4",
        "Connect 4 tokens in a row to win. Can be played against another player or a bot.",
        "game?game=connect4"
    ],

      [
    "Stealing the Diamond",
    "Try to steal the diamond as Henry Stickmin!",
    "pages/stealdiamond"
  ], 
    
    [
    "Escaping the Prison",
    "Try to escape the prison as Henry Stickmin!",
    "pages/escapingprison"
  ], 
  
       [
    "Breaking the Bank",
    "Try to break inside the bank as Henry Stickmin!",
    "pages/breakingthebank"
  ], 
             
  [
    "Clash Toyale",
    "Place cards and destroy the opponent's towers!",
    "pages/clashtoyale"
  ], 
            
            [
    "Zomballs",
    "A shooter game where you shoot zombies.",
    "pages/playzomballs"
  ], 
        
        [
    "Mirror Match",
    "Can you defeat yourself?",
    "pages/mirrormatch"
  ], 
       
       [
    "Cat Trap",
    "Trap the cat!",
    "pages/cattrap"
  ], 
      
      [
    "Wordle",
    "Guess the daily 5-letter word!",
    "pages/wordle/wordle"
  ], 
    
    [
    "Territorial.io",
    "Conquer other territories!",
    "pages/territorialio"
  ], 
   
  // [
  //  "1x1x1x1",
  //  "scary hacker",
  //  "pages/1x1x1x1"
 // ], 
   
  // [
  //  "Unusual Roblox Domains",
  //  "Domains that take you to Roblox!",
  //  "pages/robloxdomains"
  //],   
      
  // [
  //  "Info & Contact",
   // "unelectrized.xyz",
  //  "pages/info"
  //]   
    
   //[
   // "Santa's Winter Stronghold",
  //  "Special Christmas Level",
   // "pages/santaswinterstronghold"
  //],
   
  // [
 //   "The Chronicles Of Roblox",
  //  "roblox lore",
  //  "pages/thechroniclesofroblox"
  //]
]

let currentPages = []

const thingTemplate = document.querySelector("[data-thing-template]")
const stuffContainer = document.querySelector("[data-stuff-container]")
const searchInput = document.querySelector("[data-search]")

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase()
  currentPage.forEach(page => {
    const visible = page.title.includes(value) || page.description.includes(value)
    page.element.classList.toggle("hide", !visible)
  })
})

currentPage = pages.map(page => {
  const card = thingTemplate.content.cloneNode(true).children[0]
  const header = card.querySelector("[data-header]")
  const body = card.querySelector("[data-body]")
  const pagelink = card.querySelector("[data-pagelink]")
  
  header.textContent = page[0]
  body.textContent = page[1]
  pagelink.href = page[2]
  
  stuffContainer.append(card)
  
  return { title: page[0].toLowerCase(), description: page[1].toLowerCase(), element: card }
})
