// for(inicialização; condição; incrementação)

for(let i = 0; i < 5; i = i + 1) {
    console.log(i)
}

// minhaLista.forEach(function(item, indice, minhaLista) {
    // código
// })

const frutas = ['maçã', 'laranja', 'banana']

frutas.forEach(function(fruta) {
    console.log(fruta)
})

frutas.forEach((fruta) => {
    console.log(fruta)
})

// const novaLista = listaOriginal.map(function(item, indice, listaOriginal) {
//     return novoItem
// })

const numeros = [1,2,3,4]
const quadrado = numeros.map(function(numero) {
    return numero * numero
})

// [1, 4, 9, 16]
console.log(quadrado)

// function nomeFuncao() {
    // código
// }

function dizerOi() {
    console.log('Olá mundo!')
}

dizerOi()

function saudacao(nome) {
    console.log(`Olá ${nome}`)
}

saudacao('Gustavo')

function somar(x, y){
    return x + y
}

console.log(somar(3, 4))
