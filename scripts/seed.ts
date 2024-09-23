const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    
    try {

        await database.category.createMany({
            data: [
                { name: " Computer Science" },
                { name: " Music Science" },
                { name: " Fitness " },
                { name: " Photography " },
                { name: " Accountent " },
                { name: "  engineering " },
                {name: " Filming"},
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