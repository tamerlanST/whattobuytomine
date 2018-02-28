(function(){

function onLoad() {
	var resultTextEl = document.getElementById('result_value');

	var hashRate1080tiEl = document.getElementById('hash_rate_1080ti');

	doHttpRequest('http://localhost:3000/api?method=simplemultialgo.info', function(error, result) {
		if (error) return;

		var payingObj = null;

		result.result.simplemultialgo.some(function(obj) {
			if (obj.name === 'equihash') {
				payingObj = obj;
				return;
			}
		});

		if (!payingObj) return;

		resultTextEl.innerText = parseFloat(payingObj.paying) * parseFloat(hashRate1080tiEl.value) / 1000000 * 10700;
	});
}

window.addEventListener('load', onLoad);

})();