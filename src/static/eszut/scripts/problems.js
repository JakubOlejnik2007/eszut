const buttons = document.querySelectorAll("button");
console.log(buttons)
buttons.forEach(x => x.addEventListener("click", async (evt)=> {
    await fetch(`/eszut/markReportAsSolved`, {
        method: 'POST',
        body: JSON.stringify({ id: evt.target.id }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      location.reload();
}))