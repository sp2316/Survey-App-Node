const express = require("express");
const port = 8000;

const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const app = express();
app.use(express.urlencoded());

const db = require("./config/mongoose");

const Survey = require("./models/survey");

app.post("/post", async (req, res) => {
  console.log("Connected to react");
  let questions = [],
    answers = [];

  for (const [key, value] of Object.entries(req.body)) {
    questions.push(key);
    answers.push(value);
  }

  //Every time we submit the data, the old data will be replaced with fresh data
  Survey.deleteMany({}, () => console.log("data removed"));

  // console.log(req.body);
  //adding data to db
  for (let i = 0; i < questions.length; i++) {
    await Survey.create({
      question: questions[i],
      answer: answers[i],
    });
  }
  //json to csv
  await Survey.find({})
    .lean()
    .exec((err, data) => {
      if (err) throw err;
      const csvFields = ["id", "question", "answer"];
      console.log(csvFields);
      const json2csvParser = new Json2csvParser({
        csvFields,
      });
      const csvData = json2csvParser.parse(data);
      fs.writeFile("survey_data.csv", csvData, (err) => {
        if (err) throw err;
        console.log("write succcessful");
      });
    });

  // console.log(questions, answers);

  return res.send("thanks for filling the survey");
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server running!");
  }
});
