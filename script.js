console.log("Tohle je testovací výpis");

let plocha = document.getElementById('plocha')
let vypis = document.getElementById('vypis')

let finishButton = document.getElementById('finishButton')

let checkbox_abc = document.getElementById('signs_abc')
let checkbox_ABC = document.getElementById('signs_ABC')
let checkbox_nums = document.getElementById('signs_nums')
let checkbox_spec = document.getElementById('signs_spec')

let minulaX = 0
let minulaY = 0


let ready = false

let poziceX = undefined
let poziceY = undefined
let cas = undefined
let done = true

let hmm = "hmmmmm"
let table = ""


var slider = document.getElementById("slider1");
var output = document.getElementById("length");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
    pozadovanaDelka = this.value
}

const signs_abc = "abcdefghijklmnopqrstuvwxyz"
const signs_ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const signs_numbers = "0123456789"
const signs_special = ` !@#$%^&*()-_=+[]{}|\\;:'",.<>?/~`

let limit



let heslo = ""
let pozadovanaDelka = slider.value;

let count = pozadovanaDelka
let souradkyACas = ""
let finalCisla = []

plocha.addEventListener('mousemove', async function(udalost) {

    if (done) {return}

    poziceX = udalost.clientX
    poziceY = udalost.clientY
    cas = performance.now()

    rozdilX = Math.abs(poziceX - minulaX)
    rozdilY = Math.abs(poziceY - minulaY)

    if (rozdilX > 15 || rozdilY > 15 || count >= pozadovanaDelka) {
        souradkyACas += `${poziceX}${poziceY}${cas}|`
        minulaX = poziceX
        minulaY = poziceY
        count--
    } 
    
    
})

function start() {


    souradkyACas = ""
    pozadovanaDelka = slider.value
    count = pozadovanaDelka
    console.log("pozDelka: "+pozadovanaDelka)
    console.log("count: "+count)

    heslo = ""
    poleCisel = []
    finalCisla = []
    makeTable()
    
    hmm += "🤔"
    vypis.innerText = hmm


    console.log(table)
    console.log(table.length)
    calculateLimit()
    console.log("limit: " + limit)


    done = false
}


function calculateLimit() {
    for (let i = 1;; i++) {
        if (table.length*i<=255 && table.length*(i+1)>255) {
            limit = table.length*i
            return
        }
    }
}


function makeTable() {
    table = ""
    if (checkbox_abc.checked) {
        table += signs_abc
    }
    if (checkbox_ABC.checked) {
        table += signs_ABC
    }
    if (checkbox_nums.checked) {
        table += signs_numbers
    }
    if (checkbox_spec.checked) {
        table += signs_special
    }
}


async function finish() {
    if (count <= 0) {

        vypis.innerText = await udelejHeslo(souradkyACas, pozadovanaDelka)


        done = true
    } else {
        finishButton.innerText = `moc brzo retard`
        setTimeout(() => {
            finishButton.innerText = "generate password"
        }, 500)
    
    }
}


async function udelejHash(textovaEntropie) {
    const encoder = new TextEncoder()
    const data = encoder.encode(textovaEntropie)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    const cisteBajty = new Uint8Array(hashBuffer)
    return cisteBajty

}

async function udelejHeslo(souradkyACas, delka){
    
    loop1: for (let i = 1;;i++) {
        let poleCisel = await udelejHash(souradkyACas+"_"+i)
        for (let ii = 0;ii<=poleCisel.length;ii++) {
            if (poleCisel[ii]<=limit) {
                finalCisla.push(poleCisel[ii])
            }
            if (finalCisla.length>=delka) {
                break loop1
            }
        }
    }
    
    console.log("final cisla: " + finalCisla)
    console.log("final cisla len: "+ finalCisla.length)
    
    var heslo = ""
    var pozice = 0

    for (var i = 0;i<finalCisla.length;i++) {
        pozice = finalCisla[i] % table.length
        heslo = heslo + table[pozice]
    }
    return heslo
}