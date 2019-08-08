

const request = async () => {
  const response = await fetch('http://localhost:4000/links/durango');
  const json = await response.json();
  const number = parseInt(json);
  console.log(number);
}

request();
//console.log(s,'Hola');
const reset = fetch('http://localhost:4000/links/durango')
.then(res => res.json())
.then(data => obj = data)
.then(() => console.log(obj))
//var obj;
//fetch('https://jsonplaceholder.typicode.com/posts/1')
 // .then(res => res.json())
  //.then(data => obj = data)
  //.then(() => console.log(obj))
//console.log(obj);
console.log(reset);
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  
  function drawChart () {
    let n =request();
    console.log(n,'s');
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      n],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ]);

  var options = {
    title: 'My Daily Activities'
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}
