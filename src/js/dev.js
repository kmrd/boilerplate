/*

Auto refresh on updated build 

*/

var touch;

function initRefreshWatch() {
	if ( document.location.href.indexOf('localhost') !== -1 ) {
		console.log( 'Watching for changes...' );
		setInterval(update, 1000);
	}
}

function update() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {

			if ( typeof touch === 'undefined' )  {
				touch = this.responseText;
			}

			if ( this.responseText !== touch ) {
				console.log('changed');
				location.reload();
			}
		}
	};
	xhttp.open("GET", "/touch", true);
	xhttp.send();

}

window.onload = initRefreshWatch();
