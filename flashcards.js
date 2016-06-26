function shuffle(array) {
	var i = array.length
	if (i == 0) return false
	while (--i) {
		var j = Math.floor(Math.random() * (i + 1))
		var tempi = array[i]
		var tempj = array[j]
		array[i] = tempj
		array[j] = tempi
	}
}
  
var cards = []
var cardTypes = ['Question', 'Answer']
window.onload = function() {
	var req = new XMLHttpRequest()
	req.open('GET', 'flashcards.json', true)
	req.onload = function () {
		cards = JSON.parse(req.responseText)
		shuffle(cards)
	}
	req.send()
}


  
var card = document.querySelector('.card')
card.classList.remove('hidden')
var text = document.querySelector('.card .text')
var label = document.querySelector('.card .label')
var index = -1

function update() {
	if (index < 0) {
		index = -1
		label.innerHTML = 'Start'
		text.innerHTML = document.getElementById('instructions').innerHTML
		document.getElementById('completed').innerHTML = '<span style="width:0%"></span>'
		return
	}
	var c = Math.floor(index / 2)
	var h = index % 2
	label.innerHTML = 'Card ' + (c + 1) + ' of ' + cards.length + ' - ' + cardTypes[h]
	document.getElementById('completed').innerHTML = '<span style="width: ' + 100 * ((c + 1) / cards.length) + '%"></span>'
	text.innerHTML = cards[c][h]
}
function forward() {
    index++
    if (index >= cards.length*2) index = -1
    update()
}
function back() {
    index--
    if (index < -1) index = cards.length*2 - 1
    update()
}

document.body.addEventListener('keydown', function(e){
	if(e.keyCode==32 || e.keyCode == 39){
      forward()
	}
	if(e.keyCode==37 || e.keyCode == 8){
      back()
	}
})

card.addEventListener('click', function(e) {
	if (e.target.id !== 'completed') {
		var rect = card.getBoundingClientRect()
		var left = rect.left + document.body.scrollLeft
		if (e.clientX - left > card.clientWidth / 2) {
			forward()
		} else {
			back()
		}
	}
})	
document.getElementById('completed').addEventListener('click', function(e) {
	var position = e.clientX - (document.getElementById('completed').getBoundingClientRect().left + document.body.scrollLeft)
	var percent = position / document.getElementById('completed').clientWidth*100
	index = Math.floor(percent * cards.length / 100*2)
	update()
})

update()