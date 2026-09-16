let plocha = document.getElementById('plocha')
let vypis = document.getElementById('vypis')

let count = 0
let cislo = ""

let minulaX = 0
let minulaY = 0


let ready = false

const tabulka = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
let heslo = ""
let pozadovanaDelka = 10;

plocha.addEventListener('mousemove', async function(udalost) {
    
    if (ready === true) return;


    let poziceX = udalost.clientX
    let poziceY = udalost.clientY

    let rozdilX = Math.abs(poziceX - minulaX)
    let rozdilY = Math.abs(poziceY - minulaY)
    let cas = performance.now()
    

    if (rozdilX > 15 || rozdilY > 15) {
        if (count < 100) {
            count++
            
            cislo += `${poziceX}${poziceY}${cas}|`

            minulaX = poziceX
            minulaY = poziceY

        } else {
            
            ready = true;
            let poleCisel = await udelejHash(cislo)

            console.log(poleCisel)

            vypis.innerText = udelejHeslo(poleCisel)
    
            
        }
    }

})


async function udelejHash(textovaEntropie) {
    const encoder = new TextEncoder()
    const data = encoder.encode(textovaEntropie)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    const cisteBajty = new Uint8Array(hashBuffer)
    return cisteBajty

}

function udelejHeslo(cisla){
    
    var heslo = ""
    var pozice = 0

    for (var i = 0;i<pozadovanaDelka;i++) {
        pozice = cisla[i] % 64
        heslo = heslo + tabulka[pozice]

    }

    return heslo
}