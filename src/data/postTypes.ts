// ملف بيانات التخصصات والجامعات الشامل لمنصة PEERORA

export interface UniversityEntry {
  name: string;
  country: string;
}

export const COUNTRIES = [
  "France", "Netherlands", "Switzerland", "Singapore", "India", 
  "United Arab Emirates", "Qatar", "Turkey", "Brazil", "South Africa", "Saudi Arabia"
];

export const UNIVERSITIES: UniversityEntry[] = [
  // السعودية والخليج
  { name: "King Saud University (KSU)", country: "Saudi Arabia" },
  { name: "Princess Nourah bint Abdulrahman University (PNU)", country: "Saudi Arabia" },
  { name: "Jazan University", country: "Saudi Arabia" },
  { name: "King Fahd University of Petroleum and Minerals (KFUPM)", country: "Saudi Arabia" },
  { name: "King Abdulaziz University (KAU)", country: "Saudi Arabia" },
  { name: "Imam Abdulrahman bin Faisal University (IAU)", country: "Saudi Arabia" },
  // فرنسا
  { name: "PSL University", country: "France" },
  { name: "Sorbonne University", country: "France" },
  { name: "Paris-Saclay University", country: "France" },
  { name: "École Polytechnique", country: "France" },
  { name: "École Normale Supérieure", country: "France" },
  { name: "University of Strasbourg", country: "France" },
  { name: "University of Lyon", country: "France" },
  // هولندا
  { name: "University of Amsterdam", country: "Netherlands" },
  { name: "Delft University of Technology", country: "Netherlands" },
  { name: "Eindhoven University of Technology", country: "Netherlands" },
  { name: "Leiden University", country: "Netherlands" },
  { name: "Utrecht University", country: "Netherlands" },
  { name: "Erasmus University Rotterdam", country: "Netherlands" },
  // سويسرا
  { name: "ETH Zurich", country: "Switzerland" },
  { name: "EPFL", country: "Switzerland" },
  { name: "University of Zurich", country: "Switzerland" },
  { name: "University of Geneva", country: "Switzerland" },
  { name: "University of Lausanne", country: "Switzerland" },
  // سنغافورة
  { name: "National University of Singapore", country: "Singapore" },
  { name: "Nanyang Technological University", country: "Singapore" },
  { name: "Singapore Management University", country: "Singapore" },
  // الهند
  { name: "Indian Institute of Technology Bombay", country: "India" },
  { name: "Indian Institute of Technology Delhi", country: "India" },
  { name: "Indian Institute of Technology Madras", country: "India" },
  { name: "Indian Institute of Technology Kanpur", country: "India" },
  { name: "Indian Institute of Technology Kharagpur", country: "India" },
  { name: "Indian Institute of Science", country: "India" },
  { name: "University of Delhi", country: "India" },
  { name: "Jawaharlal Nehru University", country: "India" },
  { name: "University of Mumbai", country: "India" },
  // الإمارات
  { name: "United Arab Emirates University", country: "United Arab Emirates" },
  { name: "Khalifa University", country: "United Arab Emirates" },
  { name: "American University of Sharjah", country: "United Arab Emirates" },
  { name: "University of Sharjah", country: "United Arab Emirates" },
  { name: "Zayed University", country: "United Arab Emirates" },
  { name: "American University in Dubai", country: "United Arab Emirates" },
  // قطر
  { name: "Qatar University", country: "Qatar" },
  { name: "Hamad Bin Khalifa University", country: "Qatar" },
  { name: "Doha Institute for Graduate Studies", country: "Qatar" },
  // تركيا
  { name: "Middle East Technical University", country: "Turkey" },
  { name: "Istanbul Technical University", country: "Turkey" },
  { name: "Boğaziçi University", country: "Turkey" },
  { name: "Istanbul University", country: "Turkey" },
  { name: "Hacettepe University", country: "Turkey" },
  { name: "Koç University", country: "Turkey" },
  { name: "Bilkent University", country: "Turkey" },
  // البرازيل
  { name: "University of São Paulo", country: "Brazil" },
  { name: "University of Campinas", country: "Brazil" },
  { name: "Federal University of Rio de Janeiro", country: "Brazil" },
  { name: "Federal University of Minas Gerais", country: "Brazil" },
  { name: "University of Brasília", country: "Brazil" },
  // جنوب إفريقيا
  { name: "University of Cape Town", country: "South Africa" },
  { name: "University of the Witwatersrand", country: "South Africa" },
  { name: "Stellenbosch University", country: "South Africa" },
  { name: "University of Johannesburg", country: "South Africa" },
  { name: "University of Pretoria", country: "South Africa" }
];

export const MAJORS = [
  // Computer Science & IT
  "Computer Science", "Software Engineering", "Information Technology", "Information Systems",
  "Information Security", "Cybersecurity", "Artificial Intelligence", "Machine Learning", "Deep Learning",
  "Data Science", "Data Analytics", "Big Data", "Computer Engineering", "Computer Networks",
  "Cloud Computing", "Cloud Engineering", "Database Systems", "Web Development", "Mobile Application Development",
  "Game Development", "Computer Graphics", "Human-Computer Interaction", "Robotics", "Internet of Things",
  "Embedded Systems", "Computer Vision", "Natural Language Processing", "Bioinformatics", "Computational Science",
  "Digital Forensics", "Blockchain Technology", "Cryptography", "Network Security", "DevOps",
  "Software Architecture", "Operating Systems", "Distributed Systems", "Parallel Computing", "Quantum Computing", "Computational Biology",
  
  // Engineering
  "Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Electronics Engineering",
  "Chemical Engineering", "Industrial Engineering", "Aerospace Engineering", "Biomedical Engineering",
  "Environmental Engineering", "Materials Engineering", "Mechatronics Engineering", "Architectural Engineering",
  "Petroleum Engineering", "Nuclear Engineering", "Manufacturing Engineering", "Systems Engineering",
  "Telecommunications Engineering", "Automotive Engineering", "Marine Engineering", "Mining Engineering",
  "Geological Engineering", "Renewable Energy Engineering", "Robotics Engineering", "Artificial Intelligence Engineering",

  // Business & Management
  "Business Administration", "Accounting", "Finance", "Marketing", "Management", "Human Resources",
  "International Business", "Entrepreneurship", "Business Analytics", "Project Management", "Supply Chain Management",
  "Operations Management", "Banking", "Insurance", "Investment", "Economics", "FinTech",
  "Management Information Systems", "Digital Marketing", "E-Commerce", "Real Estate Management", "Hospitality Management", "Tourism Management",

  // Natural Sciences
  "Mathematics", "Applied Mathematics", "Statistics", "Physics", "Applied Physics", "Chemistry",
  "Biochemistry", "Biology", "Microbiology", "Biotechnology", "Genetics", "Molecular Biology",
  "Neuroscience", "Astronomy", "Astrophysics", "Geology", "Earth Sciences", "Environmental Science",
  "Marine Science", "Oceanography", "Zoology", "Botany",

  // Medicine & Health
  "Medicine", "Dentistry", "Pharmacy", "Nursing", "Public Health", "Physical Therapy", "Occupational Therapy",
  "Radiology", "Medical Laboratory Science", "Nutrition", "Dietetics", "Veterinary Medicine",
  "Biomedical Sciences", "Medical Imaging", "Respiratory Therapy", "Emergency Medical Services",
  "Health Informatics", "Epidemiology", "Healthcare Administration", "Medical Technology",

  // Social Sciences
  "Psychology", "Sociology", "Political Science", "International Relations", "Anthropology", "Geography",
  "Communication", "Media Studies", "Journalism", "Social Work", "Criminology", "Development Studies", "Human Geography", "Social Psychology",

  // Law
  "Law", "International Law", "Commercial Law", "Criminal Law", "Constitutional Law", "Human Rights Law",
  "Intellectual Property Law", "Environmental Law", "Corporate Law", "Cyber Law", "Tax Law",

  // Arts & Humanities
  "English", "Arabic", "Linguistics", "Translation", "History", "Philosophy", "Literature", "Fine Arts",
  "Graphic Design", "Interior Design", "Fashion Design", "Music", "Theatre", "Film", "Photography",
  "Animation", "Architecture", "Archaeology", "Cultural Studies", "Visual Arts",

  // Education
  "Education", "Early Childhood Education", "Elementary Education", "Secondary Education", "Special Education",
  "Educational Technology", "Educational Psychology", "Curriculum and Instruction", "Educational Leadership",
  "TESOL", "Language Education", "Mathematics Education", "Science Education", "Computer Science Education",

  // Agriculture & Environment
  "Agriculture", "Agricultural Engineering", "Forestry", "Fisheries", "Animal Science", "Horticulture",
  "Food Science", "Soil Science", "Environmental Management", "Wildlife Conservation", "Plant Science", "Agricultural Economics", "Food Technology",

  // Services
  "Hospitality", "Tourism", "Aviation", "Transportation", "Logistics", "Sports Science", "Physical Education",
  "Fitness", "Culinary Arts", "Safety Management", "Security Services", "Disaster Management"
];

export const ACADEMIC_LEVELS = [
  { value: "Associate Degree", label: "Associate Degree", iconKey: "book" },
  { value: "Diploma", label: "Diploma", iconKey: "book" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree", iconKey: "graduation" },
  { value: "Master's Degree", label: "Master's Degree", iconKey: "award" },
  { value: "Doctorate / PhD", label: "Doctorate / PhD", iconKey: "star" },
  { value: "Professional Degree", label: "Professional Degree", iconKey: "star" },
  { value: "Certificate", label: "Certificate", iconKey: "sparkles" }
];

export function searchUniversities(query: string): UniversityEntry[] {
  if (!query.trim()) return UNIVERSITIES;
  const q = query.toLowerCase();
  return UNIVERSITIES.filter(
    (u) => u.name.toLowerCase().includes(q) || u.country.toLowerCase().includes(q)
  );
}

export function getUniversityCountry(universityName: string): string {
  const found = UNIVERSITIES.find((u) => u.name.toLowerCase() === universityName.toLowerCase());
  return found ? found.country : "Global";
}