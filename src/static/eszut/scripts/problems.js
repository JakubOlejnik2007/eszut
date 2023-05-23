const selectButtonsAndAddListener = async (selector) => {
    let buttons = document.querySelectorAll(selector);
    buttons.forEach((x) =>
        x.addEventListener("click", async (evt) => {
            await fetch(`/eszut/markReportAsSolved`, {
                method: "POST",
                body: JSON.stringify({ id: evt.target.id }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            location.reload();
        })
    );
};

const fetchSolvedButton = document.querySelector(".fetchSolved");
const solvedProblemsDiv = document.querySelector("#solved-problems");

const fetchAndInsertSolvedProblems = async () => {
    console.log("test 123");
    let problems = await fetch(`/eszut/getSolvedProblems`, {
        method: "POST",
    });
    problems = await problems.json();
    let output = "";
    problems.forEach((x) => {
        output += `
      <article id="article${x._id}">
      <table>
          <tr class="solved">
              <td>ID</td>
              <td><span style="font-size: 0.6em;">${x._id}</span></td>
          </tr>
          <tr>
              <td>Gdzie?</td>
              <td>${x.where}</td>
          </tr>
          <tr>
              <td>Kto?</td>
              <td>${x.who}</td>
          </tr>
          <tr>
              <td>Co?</td>
              <td>${x.what}</td>
          </tr>
          <tr>
              <td>Kategoria</td>
              <td>${x.category[0].name}</td>
          </tr>
          <tr>
              <td colspan="2">
                  <button class="markAsUnsolved" id="${x._id}">Oznacz jako nierozwiązany</button>
              </td>
          </tr>
      </table>
  </article>
      `;
    });
    solvedProblemsDiv.innerHTML = output;
    selectButtonsAndAddListener(".markAsUnsolved");
};

selectButtonsAndAddListener(".markAsSolvedButton");

fetchSolvedButton.addEventListener("click", fetchAndInsertSolvedProblems);
