let plocha = document.getElementById('plocha')
let vypis = document.getElementById('vypis')

let finishButton = document.getElementById('finishButton')

let checkbox_abcd = document.getElementById('signs_abcd')
let checkbox_ABCD = document.getElementById('signs_ABCD')
let checkbox_nums = document.getElementById('signs_nums')
let checkbox_spec = document.getElementById('signs_spec')

var checkboxElems = document.querySelectorAll("input[type='checkbox']")
var selections = {}


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


output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
    pozadovanaDelka = this.value
}

const signs_abc = "abcdefghijklmnopqrstuvwxyz"
const signs_ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const signs_num = "0123456789"
const signs_spe = ` !@#$%^&*()-_=+[]{}|\\;:'",.<>?/~`

let limit



let heslo = ""
let pozadovanaDelka = slider.value;

let count = pozadovanaDelka
let souradkyACas = ""
let finalCisla = []

for (var i = 0; i < checkboxElems.length; i++) {
    checkboxElems[i].addEventListener("click", checkboxCheck);
}

function checkboxCheck(e) {
    if (!checkbox_abcd.checked && !checkbox_ABCD.checked && !checkbox_nums.checked && !checkbox_spec.checked) {
        e.target.checked = true
    }
}


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

    heslo = ""
    poleCisel = []
    finalCisla = []
    makeTable()
    calculateLimit()
    
    hmm += "🤔"
    vypis.innerText = hmm

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
    if (checkbox_abcd.checked) {
        table += signs_abc
    }
    if (checkbox_ABCD.checked) {
        table += signs_ABC
    }
    if (checkbox_nums.checked) {
        table += signs_num
    }
    if (checkbox_spec.checked) {
        table += signs_spe
    }
}


async function finish() {
    
    if (done) {
        finishButton.innerText = `<- tady musis dement`
        setTimeout(() => {
            finishButton.innerText = "generate password"
        }, 500)
    } else if (count <= 0) {
        fancyVypis(await udelejHeslo(souradkyACas, pozadovanaDelka),vypis)
        done = true
    } else {
        finishButton.innerText = `moc brzo retard`
        setTimeout(() => {
            finishButton.innerText = "generate password"
        }, 500)
    
    }
    
    
}

async function fancyVypis(text, entity) {
    let doba = 400 //ms
    let vypis = ""
    
    for (let i = 0;i<text.length;i++) {
        await new Promise(resolve => setTimeout(resolve, doba/text.length));
        vypis = vypis + text[i]
        entity.innerText = vypis
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
    
    
    var heslo = ""
    var pozice = 0

    for (var i = 0;i<finalCisla.length;i++) {
        pozice = finalCisla[i] % table.length
        heslo = heslo + table[pozice]
    }
    return heslo
}


