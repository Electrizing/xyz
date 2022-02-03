const pages = [
  [
    "Robux",
    "Robux is a currency that is used in Roblox."
  ],
  
  [
    "Bruh",
    "bruh."
  ]
]

const thingTemplate = document.querySelector("[data-thing-template]")
const stuffContainer = document.querySelector("[data-stuff-container]")

pages.forEach(page => {
  const card = thingTemplate.content.cloneNode(true).children[0]
  const header = card.querySelector("[data-header]")
  const body = card.querySelector("[data-body]")
  
  header.textContent = page[0]
  body.textContent = page[1]
  
  stuffContainer.append(card)
})
