const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const main = async () => {
    await prisma.class.createMany({
        data: [
            {name: "Abnormal Psychology"},
            {name: "Advertising Strategy"},
            {name: "Advertising Writing"},
            {name: "Algebra and Trigonometry"},
            {name: "Algorithm Abstraction"},
            {name: "Architectural Design 1"},
            {name: "Architectural Design 2"},
            {name: "Beginner French 1"},
            {name: "Beginner French 2"},
            {name: "Beginner Japanese 1"},
            {name: "Beginner Japanese 2"},
            {name: "Beginner Chinese 1"},
            {name: "Beginner Chinese 2"},
            {name: "Beginner Spanish 1"},
            {name: "Beginner Spanish 2"},
            {name: "Biological Sciences"},
            {name: "Biology 1"},
            {name: "Biology 1 Lab"},
            {name: "Biology 2"},
            {name: "Biology 2 Lab"},
            {name: "Biomolecular Engineering"},
            {name: "Calculus 1"},
            {name: "Calculus 2"},
            {name: "Calculus 3"},
            {name: "Chemistry 1 Lab"},
            {name: "Chemistry 2 Lab"},
            {name: "Comparative Psychology"},
            {name: "Computer Architecture"},
            {name: "Computer Network Fundamentals"},
            {name: "Computer Vision"},
            {name: "Data Science"},
            {name: "Data Structures and Algorithms"},
            {name: "Developmental Psychology"},
            {name: "Discovering Physics"},
            {name: "Discrete Structures"},
            {name: "Engineering Statistics"},
            {name: "Environmental Science"},
            {name: "General Chemistry 1"},
            {name: "General Chemistry 2"},
            {name: "Human Physiology"},
            {name: "Information and Database Systems"},
            {name: "Intermediate Chinese"},
            {name: "Intermediate French"},
            {name: "Intermediate Japanese"},
            {name: "Intermediate Spanish"},
            {name: "International Business"},
            {name: "Introduction to Architecture"},
            {name: "Introduction to Art History"},
            {name: "Introduction to Biological Sciences"},
            {name: "Introduction to Biomedical Engineering"},
            {name: "Introduction to Computer Organization"},
            {name: "Introduction to Financial Accounting"},
            {name: "Introduction to Managerial Accounting"},
            {name: "Macroeconomics"},
            {name: "Microeconomics"},
            {name: "Modern Philosophy"},
            {name: "Object-Oriented Programming"},
            {name: "Operating Systems"},
            {name: "Physics with Calculus 1"},
            {name: "Physics with Calculus 1 Lab"},
            {name: "Physics with Calculus 2"},
            {name: "Physics with Calculus 2 Lab"},
            {name: "Thermodynamics"},
        ],
        skipDuplicates: true,
    });

    await prisma.goalOption.createMany({
        data: [
            {goal: "Exam prep"},
            {goal: "Improve class grade"},
            {goal: "Project help"},
            {goal: "Enhance learning"},
            {goal: "Remain motivated"},
            {goal: "Be kept accountable"},
            {goal: "Socialize while studying"},
            {goal: "Learn new study skills"},
            {goal: "Share my knowledge"},
        ],
        skipDuplicates: true,
    });
}

main()
    .catch((error) => {
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })



