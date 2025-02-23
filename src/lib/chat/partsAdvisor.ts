interface PartRecommendation {
  name: string;
  description: string;
  price: number;
  category: string;
  useCase: string[];
  compatibility: string[];
}

const partsDatabase: PartRecommendation[] = [
  {
    name: "Shimano XT M8100 Disc Brakes",
    description: "High-performance hydraulic disc brakes with excellent modulation and stopping power",
    price: 299.99,
    category: "Brakes",
    useCase: ["trail", "enduro", "downhill"],
    compatibility: ["all mountain bikes", "modern disc brake mounts"]
  },
  {
    name: "RockShox Pike Ultimate Fork",
    description: "Premium trail fork with sophisticated damping and plush feel",
    price: 899.99,
    category: "Suspension",
    useCase: ["trail", "all-mountain", "enduro"],
    compatibility: ["29er", "27.5", "boost spacing"]
  },
  {
    name: "Maxxis Minion DHF Tire",
    description: "Aggressive trail tire with excellent cornering grip",
    price: 79.99,
    category: "Tires",
    useCase: ["trail", "enduro", "downhill", "all-mountain"],
    compatibility: ["29er", "27.5", "tubeless ready"]
  },
  {
    name: "SRAM GX Eagle Drivetrain",
    description: "Reliable 12-speed drivetrain with wide gear range",
    price: 499.99,
    category: "Drivetrain",
    useCase: ["trail", "cross-country", "all-mountain"],
    compatibility: ["12-speed", "SRAM XD driver"]
  },
  {
    name: "Race Face Next R Carbon Handlebar",
    description: "Lightweight carbon fiber handlebar with optimal trail feel",
    price: 169.99,
    category: "Cockpit",
    useCase: ["trail", "cross-country", "enduro"],
    compatibility: ["31.8mm clamp", "35mm clamp"]
  }
];

export function generateResponse(input: string): string {
  const inputLower = input.toLowerCase();
  
  // Check for greetings or general inquiries
  if (inputLower.includes('hello') || inputLower.includes('hi') || inputLower.includes('hey')) {
    return "Hello! I'm here to help you find the perfect bike parts. What type of riding do you do, and what parts are you looking for?";
  }

  // Check for budget inquiries
  if (inputLower.includes('budget') || inputLower.includes('cheap') || inputLower.includes('expensive')) {
    return "I can help you find parts in your budget. Could you specify your price range and what type of part you're looking for?";
  }

  // Check for specific part categories
  const categories = {
    brakes: ["brake", "stopping", "braking"],
    suspension: ["fork", "suspension", "shock"],
    tires: ["tire", "tyre", "grip", "traction"],
    drivetrain: ["drivetrain", "gear", "shifting", "cassette", "derailleur"],
    cockpit: ["handlebar", "stem", "grips"]
  };

  // Check for riding styles
  const ridingStyles = {
    trail: ["trail", "all-mountain"],
    enduro: ["enduro", "aggressive"],
    downhill: ["downhill", "dh"],
    crossCountry: ["cross-country", "xc", "climbing"]
  };

  // Identify category and riding style from input
  let matchedCategory: string | null = null;
  let matchedStyle: string | null = null;

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => inputLower.includes(keyword))) {
      matchedCategory = category;
      break;
    }
  }

  for (const [style, keywords] of Object.entries(ridingStyles)) {
    if (keywords.some(keyword => inputLower.includes(keyword))) {
      matchedStyle = style;
      break;
    }
  }

  // Generate appropriate response based on matched criteria
  if (matchedCategory && matchedStyle) {
    const recommendations = partsDatabase.filter(part => 
      part.category.toLowerCase() === matchedCategory &&
      part.useCase.some(use => use.includes(matchedStyle!))
    );

    if (recommendations.length > 0) {
      const rec = recommendations[0];
      return `For ${matchedStyle} riding, I recommend the ${rec.name} (${rec.price}). ${rec.description}. Would you like more details about this or other options?`;
    }
  } else if (matchedCategory) {
    const recommendations = partsDatabase.filter(part => 
      part.category.toLowerCase() === matchedCategory
    );

    if (recommendations.length > 0) {
      const rec = recommendations[0];
      return `I recommend checking out the ${rec.name}. It's a great option priced at $${rec.price}. ${rec.description}. What type of riding will you be doing? This will help me make a more specific recommendation.`;
    }
  } else if (matchedStyle) {
    return `For ${matchedStyle} riding, there are several parts that could enhance your experience. What specific component are you looking to upgrade? (e.g., brakes, suspension, tires)`;
  }

  // Default response if no specific matches
  return "I can help you find the right parts for your bike. Could you tell me more about what type of riding you do and what specific parts you're interested in? For example, are you looking for brakes, suspension, tires, or something else?";
}

export function getPartRecommendations(category: string, ridingStyle: string): PartRecommendation[] {
  return partsDatabase.filter(part => 
    part.category.toLowerCase() === category.toLowerCase() &&
    part.useCase.some(use => use.toLowerCase().includes(ridingStyle.toLowerCase()))
  );
} 