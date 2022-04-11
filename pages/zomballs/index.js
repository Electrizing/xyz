const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.height = innerHeight
canvas.width = innerWidth

const playerScore = document.querySelector('#playerScore')
const startGameButton = document.querySelector('#startGameButton')
const startFrame = document.querySelector('#startFrame')
const highscoreLabel = document.querySelector('#highscoreLabel')
const hint = document.querySelector('#hint')
const scoreLabel = document.querySelector('#scoreLabel')
const ammoLabel = document.querySelector('#ammo')

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

let highscore = getCookie("highscore")
let ammo = 10
let playing = false

var shootSound = new Audio("shoot.wav");
var hitSound = new Audio("hitHurt.wav");

shootSound.volume = 0.3
hitSound.volume = 0.2

if (highscore == null || highscore == "") {
     highscore = 0
}

ammoLabel.style.display = 'none'
highscoreLabel.innerHTML = `Highscore: ${getCookie("highscore")}`

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color =  color
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()

        
    }
}

class Bullet {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color =  color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Zombie {
    constructor(x, y, radius, color, velocity, speed, health) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color =  color
        this.velocity = velocity
        this.speed = speed
        this.health = health
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()

        const angle = Math.atan2(player.y - this.y, player.x - this.x)
        
        const newVelocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        this.x = this.x + newVelocity.x * this.speed
        this.y = this.y + newVelocity.y * this.speed
    }
}

const friction = 0.99
class Particle {
    constructor(x, y, radius, color, velocity, explosive) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color =  color
        this.velocity = velocity
        this.alpha = 1
        this.explosive = explosive
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

let keyW = false
let keyS = false
let keyA = false
let keyD = false

const x = canvas.width / 2
const y = canvas.height / 2
let player = new Player(x, y, 10, 'white')

let bullets = []
let particles = []
let zombies = []
let otherPlayers = []
let score = 0
let spawnZombiesTimeout
let time = 1000

function spawnZombies() {
    const radius = Math.random() * (20 - 10) + 10
        
        let x
        let y
        
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ?  0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ?  0 - radius : canvas.height + radius
        }

        let right = false
        let bottom = false
        
        if (x > (canvas.width / 2)) {
            right = true
        }

        if (y > (canvas.height / 2)) {
            bottom = true
        }

        const distance = Math.hypot(player.x - x, player.y - y)

        if (distance - radius - player.radius < 200) {
           if (right) {
                //Right
                x = 0
           } else {
                //Left
                x = canvas.width
           }

           if (bottom) {
               y = 0
           } else {
               y = canvas.height
           }
        }

        let speed = 1
        let health = 1
        const green = (Math.random() * (255 - 50)) + 50
        const color = `rgb(0, ${green}, 0)`
       
        if (green > 102) {
            speed = 1.5
        } else {
            health = 2
        }

        const angle = Math.atan2(player.y - y, player.x - x)
        
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        zombies.push(new Zombie(x, y, radius, color, velocity, speed, health))
        let newTime = time * 0.999

        if (newTime < 300) {
            newTime = 300
        }

        time = newTime

        spawnZombiesTimeout = setTimeout(spawnZombies, time)
}

function init() {
    player = new Player(x, y, 10, 'white')
    bullets = []
    particles = []
    zombies = []
    score = 0
    time = 1000
    playerScore.innerHTML = 0
    canvas.height = innerHeight
    canvas.width = innerWidth
    spawnZombiesTimeout = setTimeout(spawnZombies, 1000)
}

let animationId
let newY = 0
let newX = 0



function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(15, 15, 15, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()

    otherPlayers.forEach((otherPlayer, otherPlayerIndex) => {
        otherPlayer.draw()
    })

    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1)
        } else {
            particle.update()
        }

        if (particle.explosive == true) {
            const distance = Math.hypot(player.x - particle.x, player.y - particle.y)

            if (distance - particle.radius - player.radius < 1) {
                cancelAnimationFrame(animationId)

                let highscore = getCookie("highscore")

                if (highscore == null || highscore == "") {
                    highscore = 0
                }

                if (score >= highscore) {
                     document.cookie = "highscore=" + highscore
                }

                highscoreLabel.innerHTML = `Highscore: ${getCookie("highscore")}`
                hint.style.display = "flex"
                startFrame.style.display = 'flex'
                scoreLabel.style.display = 'none'
                ammoLabel.style.display = 'none'
                playerScore.style.display = 'none'
                playing = false
                clearTimeout(spawnZombiesTimeout)
        }
        }
    })

    newY = player.y
    newX = player.x

    if (keyW == true) {
        newY = newY - 5
    }

    if (keyS == true) {
        newY = newY + 5
    }

    if (keyA == true) {
        newX = newX - 5
    }

    if (keyD == true) {
        newX = newX + 5
    }

    if (newY > 0 && newY < canvas.height) {
        player.y = newY
    }

    if (newX > 0 && newX < canvas.width) {
        player.x = newX
    }

    bullets.forEach((bullet, bulletIndex) => {
        bullet.update()

        // Remove projectile when off screen! =>
        if (bullet.x + bullet.radius < 0 || bullet.x - bullet.radius > canvas.width || bullet.y + bullet.radius < 0 || bullet.y - bullet.radius > canvas.height) {
            setTimeout(() => {
                bullets.splice(bulletIndex, 1)
            })
        }
    });

    zombies.forEach((zombie, index) => {
        zombie.update()
        
        const distance = Math.hypot(player.x - zombie.x, player.y - zombie.y)

        if (distance - zombie.radius - player.radius < 1) {
           cancelAnimationFrame(animationId)

           let highscore = getCookie("highscore")

           if (highscore == null || highscore == "") {
               highscore = 0
           }

           if (score >= highscore) {
               document.cookie = "highscore=" + score
           }

           highscoreLabel.innerHTML = `Highscore: ${getCookie("highscore")}`
           hint.style.display = "flex"
           startFrame.style.display = 'flex'
           scoreLabel.style.display = 'none'
           ammoLabel.style.display = 'none'
           playerScore.style.display = 'none'
           playing = false
           clearTimeout(spawnZombiesTimeout)
        }

        bullets.forEach((bullet, bulletIndex) => {
            const distance = Math.hypot(bullet.x - zombie.x, bullet.y - zombie.y)

            if (distance - zombie.radius - bullet.radius < 1) {
                hitSound.play();

                if (ammo == 20) {
                   ammo = 20 
                } else if (ammo == 19) {
                    ammo += 1
                } else {
                    ammo += 2
                }
        
                ammoLabel.innerHTML = `${ammo} / 20`

               if (zombie.health == 2) {
                   zombie.health = 3
                   zombie.speed = 3
                   zombie.color = 'rgb(0, 255, 0)'

                   for (let i = 0; i < zombie.radius; i++) {
                        particles.push(new Particle(
                        bullet.x,
                        bullet.y,
                        Math.random() * 2,
                        zombie.color,
                        {
                            x: (Math.random() - 0.5) * (Math.random() * 3),
                            y: (Math.random() - 0.5) * (Math.random() * 3)
                        }
                    )
                    )

                    setTimeout(() => {
                        for (let i = 0; i < zombie.radius; i++) {
                            particles.push(new Particle(
                            zombie.x,
                            zombie.y,
                            Math.random() * 2,
                            zombie.color,
                            {
                                x: (Math.random() - 0.5) * (Math.random() * 3),
                                y: (Math.random() - 0.5) * (Math.random() * 3)
                            },
                            true
                            )
                            )
                        }
                    }, 1000)
                }

                   setTimeout(() => {
                    bullets.splice(bulletIndex, 1)
                    })
                    score += Math.floor(50 - zombie.radius)
                    playerScore.innerHTML = score

                    setTimeout(() => {
                        zombies.splice(index, 1)
                    }, 1000)
               } else if (zombie.health == 1) {
                    for (let i = 0; i < zombie.radius * 2; i++) {
                        particles.push(new Particle(
                        bullet.x,
                        bullet.y,
                        Math.random() * 2,
                        zombie.color,
                        {
                            x: (Math.random() - 0.5) * (Math.random() * 6),
                            y: (Math.random() - 0.5) * (Math.random() * 6)
                        }
                        )
                        )
                    }

                    setTimeout(() => {
                    zombies.splice(index, 1)
                    bullets.splice(bulletIndex, 1)
                    })

                    score += Math.floor(50 - zombie.radius * 2)
                    playerScore.innerHTML = score
               }
            }
        });
    });

}

let shotAt = 0

addEventListener('click', (event) =>
    {
      if (playing == true && ammo > 0) {
        let spread = 0

        if ((Date.now() - shotAt) < 500) {
            spread = 20
        }

        const xSpread = (Math.round(Math.random()) * 2 - 1) * spread
        const ySpread = (Math.round(Math.random()) * 2 - 1) * spread

        console.log(spread)

        const angle = Math.atan2(event.clientY - player.y + ySpread, event.clientX - player.x + xSpread)
        
        const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        }
        
        bullets.push(new Bullet(
            player.x,
            player.y,
            5,
            'rgb(255, 255, 102)',
            velocity
        ))
        
        ammo -= 1
        ammoLabel.innerHTML = `${ammo} / 20`
        
        shotAt = Date.now()
        shootSound.play();
      }
    })

let dashedAt = 0

addEventListener("keydown", (event) =>
    {
       var keyCode = event.keyCode;

       switch (keyCode) {
           case 87:
                keyW = true
                break;

           case 83:
               keyS = true
               break;

           case 65:
               keyA = true
               break;
            
           case 68:
               keyD = true
               break;

           case 16:
                if ((Date.now() - dashedAt) > 2000) {
                    dashedAt = Date.now()

                    dashPosX = 0
                    dashPosY = 0
     
                    if (keyW) {
                        dashPosY = -20
                    } else if (keyS) {
                        dashPosY = 20
                    }
     
                    if (keyA) {
                        dashPosX = -20
                    } else if (keyD) {
                        dashPosX = 20
                    }
     
                    if (player.x > 20 && player.x < canvas.width - 20) {
                         player.x += dashPosX
                    }
     
                    if (player.y > 20 && player.y < canvas.height - 20) {
                         player.y += dashPosY
                    }
                }

                break;
       }
    })

window.addEventListener("keyup", (event) =>
    {
        var keyCode = event.keyCode;

        switch (keyCode) {
            case 87:
                keyW = false
                break;
            case 83:
                keyS = false
                break;

            case 65:
                keyA = false
                break;
            case 68:
                keyD = false
                break;
        }
    })

startGameButton.addEventListener("click", (event) =>
{
    init()
    animate()
    //spawnZombies()
    ammo = 10
    ammoLabel.innerHTML = `${ammo} / 20`
    startFrame.style.display = 'none'
    hint.style.display = "none"
    scoreLabel.style.display = 'flex'
    playerScore.style.display = 'flex'
    ammoLabel.style.display = 'flex'

    setTimeout((event) => {
        playing = true
    }, 500)
})

addEventListener('resize', (event) => 
{   
    if (innerHeight >= canvas.height && innerWidth >= canvas.width) {
        canvas.height = innerHeight
        canvas.width = innerWidth
    } else {
       location.reload()
    }
});
