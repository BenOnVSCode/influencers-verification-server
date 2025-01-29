import { PrismaClient, VerificationStatus } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Valid categories
const VALID_CATEGORIES = [
  'Nutrition',
  'Fitness',
  'Medicine',
  'Mental Health',
  'Neuroscience',
  'Longevity'
] as const;

type Category = typeof VALID_CATEGORIES[number];

async function cleanup() {
  // Delete all existing records
  await prisma.claim.deleteMany({});
  await prisma.influencer.deleteMany({});
  console.log('🧹 Cleaned up existing records');
}

async function main() {
  await cleanup();

  // Health influencers data
  const influencers = [
    {
      name: "Dr. Mark Hyman",
      twitter_handle: "drmarkhyman",
      category: "Nutrition" as Category,
      trustScore: 85.5,
      trend: true,
    },
    {
      name: "Dr. Andrew Huberman",
      twitter_handle: "hubermanlab",
      category: "Neuroscience" as Category,
      trustScore: 92.0,
      trend: true,
    },
    {
      name: "Dr. Rhonda Patrick",
      twitter_handle: "foundmyfitness",
      category: "Longevity" as Category,
      trustScore: 88.5,
      trend: true,
    },
  ];

  // Create influencers
  for (const influencer of influencers) {
    const createdInfluencer = await prisma.influencer.create({
      data: influencer,
    });

    // Claims for Dr. Mark Hyman
    if (influencer.name === "Dr. Mark Hyman") {
      const claims = [
        {
          text: "Intermittent fasting can improve insulin sensitivity and promote weight loss",
          date_range: "2024",
          category: "Nutrition" as Category,
          confidence_score: 85,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Multiple peer-reviewed studies support the benefits of intermittent fasting for metabolic health",
          authorId: createdInfluencer.id,
        },
        {
          text: "Processed seed oils are major contributors to inflammation",
          date_range: "2024",
          category: "Nutrition" as Category,
          confidence_score: 75,
          verification_status: "Questionable" as VerificationStatus,
          reasoning: "While some studies suggest negative effects, more research is needed for definitive conclusions",
          authorId: createdInfluencer.id,
        },
        {
          text: "Magnesium supplementation can improve sleep quality",
          date_range: "2024",
          category: "Medicine" as Category,
          confidence_score: 82,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Clinical studies support magnesium's role in sleep regulation",
          authorId: createdInfluencer.id,
        },
        {
          text: "Sugar is more addictive than cocaine",
          date_range: "2024",
          category: "Nutrition" as Category,
          confidence_score: 45,
          verification_status: "Debunked" as VerificationStatus,
          reasoning: "This claim oversimplifies addiction mechanisms and lacks scientific evidence",
          authorId: createdInfluencer.id,
        },
        {
          text: "Gut health directly impacts mental health through the gut-brain axis",
          date_range: "2024",
          category: "Mental Health" as Category,
          confidence_score: 88,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Extensive research supports the gut-brain connection and its impact on mental health",
          authorId: createdInfluencer.id,
        },
      ];

      await prisma.claim.createMany({ data: claims });
    }

    // Claims for Dr. Andrew Huberman
    if (influencer.name === "Dr. Andrew Huberman") {
      const claims = [
        {
          text: "Morning sunlight exposure helps regulate circadian rhythm",
          date_range: "2024",
          category: "Neuroscience" as Category,
          confidence_score: 95,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Well-documented scientific evidence supports the role of morning light in circadian entrainment",
          authorId: createdInfluencer.id,
        },
        {
          text: "Cold exposure can increase brown fat activation",
          date_range: "2024",
          category: "Fitness" as Category,
          confidence_score: 85,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Research supports the relationship between cold exposure and brown fat activation",
          authorId: createdInfluencer.id,
        },
        {
          text: "Viewing distant objects for 30 seconds can reduce eye strain",
          date_range: "2024",
          category: "Medicine" as Category,
          confidence_score: 78,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Studies support the 20-20-20 rule for reducing digital eye strain",
          authorId: createdInfluencer.id,
        },
        {
          text: "Non-sleep deep rest (NSDR) can replace actual sleep",
          date_range: "2024",
          category: "Neuroscience" as Category,
          confidence_score: 40,
          verification_status: "Debunked" as VerificationStatus,
          reasoning: "While NSDR has benefits, it cannot fully replace the restorative functions of sleep",
          authorId: createdInfluencer.id,
        },
        {
          text: "Caffeine has a 6-hour half-life in most people",
          date_range: "2024",
          category: "Neuroscience" as Category,
          confidence_score: 90,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Pharmacological studies consistently show this half-life for caffeine metabolism",
          authorId: createdInfluencer.id,
        },
      ];

      await prisma.claim.createMany({ data: claims });
    }

    // Claims for Dr. Rhonda Patrick
    if (influencer.name === "Dr. Rhonda Patrick") {
      const claims = [
        {
          text: "Sulforaphane from broccoli sprouts has anti-cancer properties",
          date_range: "2024",
          category: "Nutrition" as Category,
          confidence_score: 88,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Multiple studies demonstrate the anti-cancer effects of sulforaphane",
          authorId: createdInfluencer.id,
        },
        {
          text: "Sauna use can increase heat shock proteins and longevity",
          date_range: "2024",
          category: "Longevity" as Category,
          confidence_score: 82,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Research supports the hormetic benefits of heat stress through sauna use",
          authorId: createdInfluencer.id,
        },
        {
          text: "Fish oil supplementation improves cognitive function in all ages",
          date_range: "2024",
          category: "Medicine" as Category,
          confidence_score: 65,
          verification_status: "Questionable" as VerificationStatus,
          reasoning: "Benefits vary by age and cognitive status; more research needed for universal claims",
          authorId: createdInfluencer.id,
        },
        {
          text: "Time-restricted feeding improves metabolic health",
          date_range: "2024",
          category: "Nutrition" as Category,
          confidence_score: 87,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Multiple studies show benefits of time-restricted feeding on metabolism",
          authorId: createdInfluencer.id,
        },
        {
          text: "Regular exercise increases lifespan and healthspan",
          date_range: "2024",
          category: "Longevity" as Category,
          confidence_score: 95,
          verification_status: "Verified" as VerificationStatus,
          reasoning: "Extensive research demonstrates the positive impact of exercise on longevity markers",
          authorId: createdInfluencer.id,
        },
      ];

      await prisma.claim.createMany({ data: claims });
    }
  }

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 