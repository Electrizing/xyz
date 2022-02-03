const pages = [
  [
    Title: "Robux";
    Description: "Robux is a currency that is used in Roblox."
  ]
]

const thingTemplate = document.querySelector("[data-thing-template]")

pages.forEach(page => {
  const card = thingTemplate.content.cloneNode(true).children[0]
  const header = card.querySelector("[data-header]")
  const body = card.querySelector("[data-body]")
  
  console.log(page)
}
