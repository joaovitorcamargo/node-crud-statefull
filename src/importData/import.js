const {parse} = require('csv-parse')
const path = require('path')
const fs = require('node:fs')

const currentPath = path.join(__dirname, './data.csv');

//leio meu arquivo csv
const streamCsv = fs.createReadStream(currentPath)

const parsed = parse({
  delimiter: ",",
  skipEmptyLine: true,
  fromLine: 2
})


async function execute() {
  //Aqui aplico as configurações de parse
  const parsedLine = streamCsv.pipe(parsed)

  //Por parse ser um promise eu faço um for await para esperar cada promise
  for await (const line of parsedLine) {

    //com a promise resolvido, eu ja tenho os dados que são title e description
    const [title, description] = line;
    
    await fetch("http://127.0.0.1:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description
      })
    }).then(() => {
      console.log("linha importada!");
    })

  }
}

execute()