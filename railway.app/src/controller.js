const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// create an array of random 9 riddles from the riddle table
const assignRiddles = async (team) => {
  var riddles = [];

  riddles =
    await prisma.$queryRaw`SELECT * FROM Riddle WHERE id NOT IN (${riddles
      .map((r) => r.id)
      .join(",")}) ORDER BY RAND() LIMIT 9`;

  const teamRiddles = await prisma.teamRiddle.createMany({
    data: riddles.map((r) => ({
      teamId: team.id,
      riddleId: r.id,
    })),
  });
};

// Create a route to create a team
const createTeam = async (req, res) => {
  const { name, leaderName } = req.body;

  const code = generateCode();
  const teamWithCode = await prisma.team.findUnique({
    where: { code },
  });

  // Check if the team code already exists. If it does, generate a new one
  if (teamWithCode) {
    return createTeam(req, res);
  }

  // Create a team in the database
  const team = await prisma.team.create({
    data: {
      name,
      TotalTimeTaken: 0,
      leaderName,
      code,
    },
  });

  // Assi2ddles
  assignRiddles(team);

  if (team) {
    return res.json({
      status: "success",
      message: "Team created successfully",
      data: team,
    });
  }
};

// Check if the team has solved all the riddles
const checkIfTeamFinished = async (teamId) => {
  const teamRiddles = await prisma.teamRiddle.findMany({
    where: {
      teamId: teamId,
      solved: false,
    },
  });

  if (teamRiddles.length === 0) {
    return true;
  } else {
    return false;
  }
};

// Create a route to check the answer of the riddle. If the answer is correct, return the next riddle assigned to the team from the teamRiddles table and add a time penalty to the team if the answer is wrong
const checkRiddleAns = async (req, res) => {
  const { riddleId, teamId, answer } = req.body;

  // Get the riddle from the database
  const riddle = await prisma.riddle.findUnique({
    where: { id: riddleId },
  });

  // Check if the answer is correct
  if (riddle.answer === answer) {
    // Update the teamRiddles table
    const teamRiddle = await prisma.teamRiddle.update({
      where: {
        teamId_riddleId: {
          teamId: teamId,
          riddleId: riddleId,
        },
      },
      data: {
        solved: true,
      },
    });

    // Check if the team has solved all the riddles
    const finished = await checkIfTeamFinished(teamId);

    if (finished) {
      return res.json({ message: "finished" });
    }

    // Return the next riddle assigned to the team from the teamRiddles table
    const nextRiddle = await prisma.riddle.findFirst({
      where: {
        teamRiddles: {
          every: {
            teamId: teamId,
            solved: false,
          },
        },
      },
      orderBy: { random: true },
    });

    res.json({ message: "correct", riddle: nextRiddle });
  } else {
    // Add a time penalty to the team
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        TotalTimeTaken: team.TotalTimeTaken + 5,
      },
    });

    // Return the same riddle
    res.json({ message: "Wrong", riddle });
  }
};

// Create a route to create riddle in bulk
const createRiddles = async (req, res) => {
  const riddles = req.body;
  const createdRiddles = await prisma.riddle.createMany({
    data: riddles,
  });

  if (createdRiddles) {
    return res.json({
      status: "success",
      message: "Riddles created successfully",
      data: createdRiddles,
    });
  }
};

// generate team code
function generateCode() {
  const lettersAndNumbers = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "T";

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * lettersAndNumbers.length);
    code += lettersAndNumbers[randomIndex];
  }

  return code;
}

module.exports = {
  createTeam,
  checkRiddleAns,
  createRiddles,
};
