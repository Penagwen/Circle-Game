const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

loading();
const scoreDis = document.querySelector('#scoreEl') 
const startGameBtn = document.querySelector('#startGameBtn')
const modelEl = document.querySelector('#modleEl')
const bigScoreEl = document.querySelector('#bigScoreEl')
const shopBtnEl = document.querySelector('#shopBtn')
const shopEl = document.querySelector('#shopEl')
const pointsEl = document.querySelector('#pointsEl')
let TotalScore = parseInt(getCookie('allScore'));
const startGameBtnn = document.querySelector('#startGameBtnn')
let slowMoActive = false
let THEPOT = 'Stop Time'
const allPots = ['Stop Time', 'Teleport']
let first = true
const abilityType = document.querySelector('#abilityType')
const abilityNum = document.querySelector('#abilityNumEl')
let cycle = 0
let StopPot = parseInt(getCookie("stopPots"));
let TeleportPot = parseInt(getCookie("teleportPots"));
let teleportActive = false
const BuySlowMoBtn = document.querySelector('#BuySlowMoBtn')
const BuyTeleportBtn = document.querySelector('#BuyTeleportBtn')
let end = false
let deccess = false
let up = false
let down = false
let left = false
let right = true
const MoveAroundBtn = document.querySelector('#MoveAroundBtn')
const buttonTutorial = document.querySelector('#buttonTutorial')
const useAbilityBtn = document.querySelector('#useAbilityBtn')
const abilityTutorial = document.querySelector('#abilityTutorial')
const firstStartBtn = document.querySelector('#firstStartBtn')
const finalTutorial = document.querySelector('#finalTutorial')
const skipBtn = document.querySelector('#skipBtn')
let Tutorial1 = true
let Tutorial2 = false
const numberOfStopPot = document.querySelector('#stopPotions')
const numberOfTeleportPot = document.querySelector('#teleportPotions')
numberOfStopPot.innerHTML = getCookie("stopPots");
numberOfTeleportPot.innerHTML = "|| "+getCookie("teleportPots")+" ||"
if(getCookie("tutorialGo") == 'true'){
    Tutorial1 = false
    Tutorial2 = false
    buttonTutorial.style.display = 'none'
    modleEl.style.display = 'flex'
}


canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    
    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update(velocity){
        this.velocity = velocity
        this.draw()
        this.x -= this.velocity.x
        this.y -= this.velocity.y
    }
}

class Enemy{
    constructor(x, y, radius, color, velocity, tag){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.tag = tag
    }
    
    draw(){
        if(this.tag == 'normal'){
            c.beginPath()
            c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
            if(slowMoActive == false){
                c.fillStyle = this.color
            }else{
                c.fillStyle = '#FFFFFF'
            }
            c.fill()
        }else{
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            c.lineWidth = 1;
            if(slowMoActive == false){
                c.strokeStyle = this.color
            }else{
                c.strokeStyle = '#FFFFFF'
            }
            c.stroke();
        }
            
    }
    
    update(velocity){
        this.velocity = velocity
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

function init(){
    player =  new Player(canvas.width/2, canvas.height/2, 10, 'red')
    enemies = []
    score = 0
    slowMoActive = false
    scoreDis.innerHTML = score
    bigScoreEl.innerHTML = score
    end = false
}

function Potions(){
    deccess = false
    if(THEPOT == "Stop Time"){
        if(StopPot > 0 || Tutorial2 == true){
            if(slowMoActive == false){
                slowMoActive = true
                setTimeout(() => {
                    slowMoActive = false;
                    enemies.forEach((enemy, index) => {
                        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x)
                        let velo = {
                            x: 0,
                            y: 0
                        }
                        if(enemy.tag == "normal"){
                            velo.x = Math.cos(angle)* (4 - enemy.radius/6)
                            velo.y = Math.sin(angle)* (4 - enemy.radius/6)
                        }else{
                            velo.x = Math.cos(angle)* (12 - enemy.radius/6)
                            velo.y = Math.sin(angle)* (12 - enemy.radius/6)
                        }
                        enemy.update(velo)
                        if(deccess == false){
                            if(Tutorial2 != true){
                                StopPot --;
                            }
                            
                            deccess = true
                        }
                    })
                }, 5000)    
            }
        }
    }else if(THEPOT == 'Teleport'){
        if(TeleportPot > 0 || Tutorial2 == true){
            if(teleportActive == false){
                teleportActive = true
                const playerRad = 10
                gsap.to(player, {
                    radius: 0
                })
                let nextX = (Math.random()*canvas.width-player.radius)+player.radius
                let nextY = (Math.random()*canvas.height-player.radius)+player.radius
                enemies.forEach((enemy, index) => {
                    let dist = Math.hypot(nextX - enemy.x, nextX - enemy.y)
                    while(dist - enemy.radius - (player.radius*2) < 1){
                        nextX = (Math.random()*canvas.width-player.radius)+player.radius
                        nextY = (Math.random()*canvas.height-player.radius)+player.radius
                        dist = Math.hypot(nextX - enemy.x, nextX - enemy.y)
                    }
                })
                setTimeout(() =>{
                    player.x = nextX
                    player.y = nextY
                    gsap.to(player, {
                        radius: playerRad
                    })
                    setTimeout(() =>{
                        teleportActive = false
                        if(deccess == false){
                            if(Tutorial2 != true){
                               TeleportPot --; 
                            }
                        }
                    },450)
                },250)
            }
        }
    }
}

function spawnEnemies(){
    setInterval(() =>{
        if(slowMoActive == false){
            let x
            let y
            let radius = Math.round(Math.random()*7)+7
            if(Math.random() < 0.5){
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
                y = Math.random() * canvas.height
            }else{
                x = Math.random() * canvas.width
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
            }
            const angle = Math.atan2(player.y - y, player.x - x)
            const velocity = {
                x: 0,
                y: 0
            }
            let tags = ''
            if(Math.random() > score/100000){
                velocity.x = Math.cos(angle)* (4 - radius/6)
                velocity.y = Math.sin(angle)* (4 - radius/6)
                tags = 'normal'
            }else{
                velocity.x = Math.cos(angle)* (12 - radius/6)
                velocity.y = Math.sin(angle)* (12 - radius/6)
                tags = 'speed'
            }
            enemies.push(new Enemy(x, y, radius, 'black', velocity, tags))
        }
    },750)
}

let dir = {
    x: 0,
    y: 0
}
let animationId
function animate(){
    animationId = requestAnimationFrame(animate)
    if(slowMoActive == false){
        c.fillStyle = 'rgba(255, 255, 255, 0.5)'
    }else{
        c.fillStyle = 'rgba(0, 0, 0, 0.07)'
    }
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    if(player.x <= 0 + player.radius + 5){
        if(dir.x > 0){
            dir.x = 0
        }
    }else if(player.x >= canvas.width - player.radius - 5){
        if(dir.x < 0){
            dir.x = 0
        }
    }else if(player.y <= 0 + player.radius + 5){
        if(dir.y > 0){
            dir.y = 0
        }
    }else if(player.y >= canvas.height - player.radius - 5){
        if(dir.y < 0){
            dir.y = 0
        }
    }
    player.update(dir)
    if(slowMoActive == false){
        score += 1    
    }
    scoreDis.innerHTML = score
    if(StopPot < 0){
        StopPot = 0;
    }
    if(TeleportPot < 0){
        TeleportPot = 0;
    }
    abilityType.innerHTML = THEPOT
    if(THEPOT == 'Stop Time'){
        abilityNum.innerHTML = ":"+StopPot
    }else if(THEPOT == 'Teleport'){
        abilityNum.innerHTML = ":"+TeleportPot
    }
    
    enemies.forEach((enemy, index) => {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x)
        if(slowMoActive == false){
            let velo = {
                x: 0,
                y: 0
            }
            if(enemy.tag == "normal"){
                velo.x = Math.cos(angle)* (4 - enemy.radius/6)
                velo.y = Math.sin(angle)* (4 - enemy.radius/6)
            }else{
                velo.x = Math.cos(angle)* (12 - enemy.radius/6)
                velo.y = Math.sin(angle)* (12 - enemy.radius/6)
            }
            enemy.update(Math.random() > 0.99 ? velo : {x:enemy.velocity.x, y:enemy.velocity.y});
        }else{
            enemy.draw()
        }
        if( 
            enemy.x + enemy.radius < 0 ||
            enemy.x - enemy.radius > canvas.width ||
            enemy.y + enemy.radius < 0 ||
            enemy.y - enemy.radius > canvas.height ){
            setTimeout(() =>{
                enemies.splice(index, 1)
            }, 0)
        }
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        
        // end the game
        if(dist - enemy.radius - player.radius < 1){
            if(Tutorial2 == false){
                setTimeout(() => {
                    cancelAnimationFrame(animationId);
                    if(end == false){
                        TotalScore += score
                        document.cookie = `allScore=${TotalScore}; expires=Wed, 18 Dec 2026 12:00:00 GMT;`;
                        end = true
                    }
                    ScoreStop = true
                    slowMoActive = false
                    modleEl.style.display = 'flex'
                    bigScoreEl.innerHTML = score
                }, 30)    
            }else{
                setTimeout(() => {
                    cancelAnimationFrame(animationId);
                    if(end == false){
                        end = true
                    }
                    ScoreStop = true
                    slowMoActive = false
                    Tutorial2 = false
                    document.cookie = "tutorialGo=true; expires=Wed, 18 Dec 2026 12:00:00 GMT;";
                    finalTutorial.style.display = 'flex'
                    bigScoreEl.innerHTML = score
                }, 30) 
            }
        }
    })
}

window.addEventListener('keydown', (event) => {
    if(Tutorial1 != true){
        if(event.key == 'w' || event.key == 'W'){
            dir.y = 7
            up = true
            down = false
            left = false
            right = false
        }else if(event.key == 's' || event.key == 'S'){
            dir.y = -7
            up = false
            down = true
            left = false
            right = false
        }
        
        if(event.key == 'a' || event.key == 'A'){
            dir.x = 7
            up = false
            down = false
            left = true
            right = false
        }else if(event.key == 'd' || event.key == 'D'){
            dir.x = -7
            up = false
            down = false
            left = false
            right = true
        }
        
        if(event.key == 'q' || event.key == 'Q'){
            Potions();
        }
        if(event.key == 'ArrowUp'){
            if(cycle == allPots.length-1){
                cycle = 0
            }else{
                cycle ++
            }
            THEPOT = allPots[cycle]
        }else if(event.key == 'ArrowDown'){
            if(cycle == 0){
                cycle = allPots.length-1
            }else{
                cycle --
            }
            THEPOT = allPots[cycle]
        }
    }else if(Tutorial2 != true){
        if(event.key == 'w' || event.key == 'W'){
            dir.y = 7
            up = true
            down = false
            left = false
            right = false
        }else if(event.key == 's' || event.key == 'S'){
            dir.y = -7
            up = false
            down = true
            left = false
            right = false
        }
        
        if(event.key == 'a' || event.key == 'A'){
            dir.x = 7
            up = false
            down = false
            left = true
            right = false
        }else if(event.key == 'd' || event.key == 'D'){
            dir.x = -7
            up = false
            down = false
            left = false
            right = true
        }
        let once = true
        setTimeout(() => {
            cancelAnimationFrame(animationId);
            if(end == false){
                end = true
                if(once == true){
                    abilityTutorial.style.display = 'flex'
                    once = false
                }
                Tutorial1 = false
                Tutorial2 = true
            }
        }, 2500)
    }else{
        if(event.key == 'w' || event.key == 'W'){
            dir.y = 7
            up = true
            down = false
            left = false
            right = false
        }else if(event.key == 's' || event.key == 'S'){
            dir.y = -7
            up = false
            down = true
            left = false
            right = false
        }
        
        if(event.key == 'a' || event.key == 'A'){
            dir.x = 7
            up = false
            down = false
            left = true
            right = false
        }else if(event.key == 'd' || event.key == 'D'){
            dir.x = -7
            up = false
            down = false
            left = false
            right = true
        }
            
        if(event.key == 'q' || event.key == 'Q'){
            Potions();
        }
        if(event.key == 'ArrowUp'){
            if(cycle == allPots.length-1){
                cycle = 0
            }else{
                cycle ++
            }
            THEPOT = allPots[cycle]
        }else if(event.key == 'ArrowDown'){
            if(cycle == 0){
                cycle = allPots.length-1
            }else{
                cycle --
            }
            THEPOT = allPots[cycle]
        }
    }        
})

window.addEventListener('keyup', (event) => {
    if(event.key == 'w' || event.key == 's' || event.key == 'W'|| event.key == 'S'){
        dir.y = 0
    }
    if(event.key == 'a' || event.key == 'd'|| event.key == 'A'|| event.key == 'D'){
        dir.x = 0
    }
})

startGameBtn.addEventListener('click', (event) => {
    modleEl.style.display = 'none'
    init()
    animate()
    if(first == true){
        spawnEnemies() 
        first = false
    }
})

shopBtnEl.addEventListener('click', (event) =>{
    modleEl.style.display = 'none'
    shopEl.style.display = 'flex'
    pointsEl.innerHTML = TotalScore
})

startGameBtnn.addEventListener('click', (event) => {
    shopEl.style.display = 'none'
    init()
    animate()
    if(first == true){
        spawnEnemies() 
        first = false
    }
})

BuySlowMoBtn.addEventListener('click', (event) => {
    if(TotalScore >= 1000){
        StopPot ++;
        document.cookie = `stopPots=${StopPot}; expires=Wed, 18 Dec 2026 12:00:00 GMT;`;
        TotalScore -= 1000
        document.cookie = `allScore=${TotalScore}; expires=Wed, 18 Dec 2026 12:00:00 GMT;`;
        numberOfStopPot.innerHTML = getCookie("stopPots");
        pointsEl.innerHTML = TotalScore
    }
})

BuyTeleportBtn.addEventListener('click', (event) => {
    if(TotalScore >= 500){
        TeleportPot ++;
        document.cookie = `teleportPots=${TeleportPot}; expires=Wed, 18 Dec 2026 12:00:00 GMT;`;
        
        TotalScore -= 500
        document.cookie = `allScore=${TotalScore}; expires=Wed, 18 Dec 2026 12:00:00 GMT;`;
        numberOfTeleportPot.innerHTML = "|| "+getCookie("teleportPots")+" ||"
        pointsEl.innerHTML = TotalScore
    }
})

MoveAroundBtn.addEventListener('click', (event) => {
    buttonTutorial.style.display = 'none'
    init()
    animate()
})

useAbilityBtn.addEventListener('click', (event) => {
    abilityTutorial.style.display = 'none'
    init()
    animate()
    if(first == true){
        spawnEnemies() 
        first = false
    }
})

firstStartBtn.addEventListener('click', (event) => {
    finalTutorial.style.display = 'none'
    init()
    animate()
    if(first == true){
        spawnEnemies() 
        first = false
    }
})

function loading(){
    if(getCookie("tutorialGo") == null){
        document.cookie = "tutorialGo=false; expires=Wed, 18 Dec 2026 12:00:00 GMT;";
    }
    if(getCookie("allScore") == null){
        document.cookie = `allScore=${0}; expires=Wed, 18 Dec 2026 12:00:00 GMT;`;
    }
    if(getCookie("stopPots") == null){
        document.cookie = `stopPots=${0}; expires=Wed, 18 Dec 2026 12:00:00 GMT;`;
    }
    if(getCookie("teleportPots") == null){
        document.cookie = `teleportPots=${0}; expires=Wed, 18 Dec 2026 12:00:00 GMT;`;
    }
}

function getCookie(name) {
    var nameEQ = name + "=";
    //alert(document.cookie);
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(nameEQ) != -1) return c.substring(nameEQ.length,c.length);
    }
    return null;
} 

































































//
