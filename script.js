const pages = [
   [
    "Roblox Domains",
    "Domains that take you to roblox!",
    "pages/robloxdomains"
  ], 
    
   [
    "Santa's Winter Stronghold",
    "Special Christmas Level",
    "pages/santaswinterstronghold"
  ],
   
   [
    "The Chronicles Of Roblox",
    "roblox lore",
    "pages/thechroniclesofroblox"
  ]
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
