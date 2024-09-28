const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    
    try {

        await database.category.createMany({
            data: [
                { name: "Computer Science" },  // No extra spaces
                { name: "Music" },
                { name: "Fitness" },
                { name: "Photography" },
                { name: "Accounting" },  // Correct spelling
                { name: "Engineering" },
                { name: "Filming" },
            ]
        })
        console.log("succes");
    }
    
    catch(error) {
        console.log("Error seeding db Category", error);

    }
    finally {
        await database.$disconnect();
    }
    
}

main();