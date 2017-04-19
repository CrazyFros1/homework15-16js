var searchBlock = document.querySelector('.search');
var searchInput = searchBlock.querySelector('.search__input');
var searchButton = searchBlock.querySelector('.search__submit');

searchButton.addEventListener('click', getValue);

searchInput.addEventListener('keypress', function (event) {
	var key = event.which || event.keyCode;
	if (key === 13) {
		getValue();
	}
});

function getValue(e) {
	sendRequest(searchInput.value);
	return false;
}

function sendRequest(searchTitle) {
	var xhr = new XMLHttpRequest();
	var searchText = encodeURI(searchTitle);
	xhr.open('GET', 'https://webhose.io/search?token=a93635e9-2897-4d42-892c-2aaa588edebf&format=json&q='+ searchText, true);

	xhr.onreadystatechange = function() {
		if(xhr.readyState !== 4) return;

		if (xhr.status !== 200) {
			console.log(xhr.status + ':' + xhr.responseText);
		} else {
			try {
				var search = JSON.parse(xhr.responseText);
				console.log(search);
				var tmpl = document.getElementById('search-template').innerHTML.trim();
				tmpl = _.template(tmpl);
				var result = document.getElementById('search__results');
				result.innerHTML = tmpl({data: search});
			} catch(e) {
				console.log('Error' + e.message);
			}
		}
	};

	xhr.send();
}