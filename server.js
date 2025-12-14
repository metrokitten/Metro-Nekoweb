const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Endpoint to receive survey submissions
app.post('/submit-survey', (req, res) => {
  const answers = req.body;
  const filePath = path.join(__dirname, 'survey_answers.json');

  // Read existing answers or start with an empty array
  let allAnswers = [];
  if (fs.existsSync(filePath)) {
    allAnswers = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  allAnswers.push(answers);

  fs.writeFileSync(filePath, JSON.stringify(allAnswers, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});