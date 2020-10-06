const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];


  highScoresList.innerHTML = highScores
  .map( (score,index) => {
    return `<tr><td> ${index + 1} </td> <td>${score.name} </td> <td> ${score.score}</td> </tr>`;
  })
  .join("");