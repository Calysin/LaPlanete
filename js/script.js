class ScoreHistory {
    constructor(){
        this.identity = ["","","",""]; 
        this.scores = [];
    }
    
    addIdentity (info, index){
        this.identity[index] = info;
    }

    addScores (score, theme) {
        this.scores.push([score,theme]);
    }

    removeScores () {
        this.scores = [];
    }

    getHistory () {
        return [this.identity, this.scores];
    }
}

let historyScores = new ScoreHistory();
console.log(historyScores.getHistory());

// création d'une session navigateur pour stocker les scores et les informations de l'utilisateur
function saveScores() { 
	console.log('Saving scores history...'); 
	console.log(historyScores.getHistory()); 
	sessionStorage.setItem('scoresHistory', JSON.stringify(historyScores.getHistory()));
}

// Fonction pour charger les scores et l'identité de la session navigateur 
function loadScores() { 
	// Récupérer l'historique des score et de l'identité de la session navigateur 
	const scoresHistory = JSON.parse(sessionStorage.getItem('scoresHistory')); 
	console.log("Loading the saved scores...")
    if (scoresHistory[0]){
        if (scoresHistory[0][0]!==""){
            const identity = scoresHistory[0];
            var str = document.getElementsByClassName("info");
            //Remplissage des données de l'utilisateur
            for(let i=0; i<str.length; i++){
                str[i].value = identity[i];
                str[i].disabled = true;
                historyScores.addIdentity(str[i].value,i);
            }
            //Rmplissage du tableau
            if (scoresHistory[1]) { 
                const scores = scoresHistory[1];
                let i = 1;
                for(const score of scores){
                    tentative = i++;
                    tableFilling(score[0],score[1]);
                }
            }
            changerTheme();
            document.getElementById("startButton").style.display = "none";
        }
    } 
} 

function quizConfirm() {
    var str = document.getElementsByClassName("info");
    let verif = false;

    //Verifier que tous les champs sont remplis
	for (var i = 0; i<str.length; i++) {
		if (str[i].value === ''){
            str[i].classList.add('notFilled');

			verif = true;
		} else {
            str[i].classList.remove('notFilled');
        }
	}

    //si non afficher message
    if (verif){
        document.getElementById("errorMessage").style.display = "contents";
        return false;
    } else {
        document.getElementById("errorMessage").style.display = "none";
    }

    //si tout remplit disable les champs d'infos 
    for (var i = 0; i<str.length; i++) {
		str[i].disabled = true;
        historyScores.addIdentity(str[i].value,i);
	}

    //display du fieldset suivant et retirer le display du bouton
    document.getElementById("themeChoix").style.display = "block";
    document.getElementById("startButton").style.display = "none";
}

//afficher le fieldset du quiz sur l'écosystème terrestre 
function afficherTerrestre(){
    document.querySelector("link[rel='stylesheet']").href = "../css/styleTerrestre.css";
    document.getElementById("quizzTerrestres").style.display = "block";
    document.getElementById("themeChoix").style.display = "none";
}

//afficher le fieldset du quiz sur l'écosystème marin 
function afficherMarins(){
    document.querySelector("link[rel='stylesheet']").href = "../css/styleMarin.css";
    document.getElementById("quizzMarins").style.display = "block";
    document.getElementById("themeChoix").style.display = "none";
}

//afficher le fieldset de choix du quiz (et retirer ceux des quiz) 
function changerTheme(){
    document.querySelector("link[rel='stylesheet']").href = "../css/style.css";
    document.getElementById("quizzTerrestres").style.display = "none";
    document.getElementById("quizzMarins").style.display = "none";
    document.getElementById("themeChoix").style.display = "block";
}

let tentative = 0;

function submitQuizz(theme){
    tentative++;
    let score = 0;

    //Vérification des bonnes réponses (calcule du score)
    const bonnesReponses = document.getElementsByClassName("bonneRep");
    for (const rep of bonnesReponses){
        if(rep.checked){
            score+=3;
        }
    }

    //Vérification si mauvaise checkbox cochée (suite du calcule du score)
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');
    for (const check of checked){
        if (check.className !== "bonneRep"){
            score-=1.5;
        }
    }

    //Retirer les selections des réponses 
    const radio = document.querySelectorAll('input[type="radio"]:checked');
    for (const uncheckRadio of radio){
        uncheckRadio.checked = false;
    }
    for (const uncheck of checked){
        uncheck.checked = false;
    }

    //appel de la fonction de remplissage du tableau
    tableFilling(score,theme);
} 


let best = -1;
//Remplissage du tableau 
function tableFilling(score,theme){  
    const table = document.getElementById('result').getElementsByTagName('tbody')[0];

    // Création d'une nouvelle ligne
    const newRow = table.insertRow();
    newRow.className = theme;

      // Ajout des cellules pour le numéro de la tentative, le theme et le score
    const cellTentative = newRow.insertCell(0);
    const cellTheme = newRow.insertCell(1);
    const cellScore = newRow.insertCell(2);

      // Remplissage des cellules et vérification du meilleur score et remplissage de la case
    console.log(theme)
    const bScore = document.getElementById("bestScore");
    cellTentative.textContent = tentative;
    if (theme==="marin"){
        cellTheme.textContent = "Ecosystèmes Marins";
        if(score>best){
            bScore.innerHTML = score;
            best = score;
            bScore.className = theme;
        } else if (score === best && bScore.className!== theme){
            bScore.className = "mix";
        }
    }else {
        cellTheme.textContent = "Ecosystèmes Terrestres";
        if(score>best){
            bScore.innerHTML = score;
            best = score;
            bScore.className = theme;
        } else if (score === best && bScore.className!== theme){
            bScore.className = "mix";
        }
    }
    cellScore.textContent = score;
	console.log(score);
    historyScores.addScores(score,theme);
}

//supression de l'historique des scores 
function emptyScores (){
    const table = document.getElementById('result').getElementsByTagName('tbody')[0];
    table.replaceChildren();
    tentative = 0;
    historyScores.removeScores();
    const bScore = document.getElementById("bestScore");
    bScore.innerHTML = "";
    bScore.className = "";
    best = 0;
}

window.addEventListener('beforeunload', saveScores);
window.addEventListener('load', loadScores);