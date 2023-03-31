// const csv = require("csv-parser");
// const fs = require("fs");
// const prisma = require("@prisma/client");

// // Define a Prisma model that matches the structure of your CSV file
// const Riddle = prisma.Riddle;

// // Read the contents of your CSV file using a CSV parsing library
// const path = './text.csv'

// const stream = fs.createReadStream(path);

// stream.on("error", (err) => {
//   console.log(err);
// });

// stream
//   .pipe(csv())
//   .on("data", async (row) => {
//     // Use the createMany method in Prisma to insert the data into the database
//     await Riddle.createMany({
//       data: [
//         {
//           question: row.question,
//           answer: row.answer,
//         },
//       ],
//     });
//   })
//   .on("end", () => {
//     console.log("CSV file successfully seeded to database");
//   });

async function createReadStream() {
  var csvData = [];
  return new Promise((resolve) => {
    fs.createReadStream("text.csv")
      .pipe(csv())
      .on("data", (data) => csvData.push(data))
      .on("end", () => {
        resolve(csvData);
      });
  });
}

const finalData = await createReadStream();
console.log(finalData);