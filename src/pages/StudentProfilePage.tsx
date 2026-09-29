import { useApp } from '@/context/AppContext';
import { PageShell, BackButton } from '@/components/Nav';
import { PillButton } from '@/components/PillButton';
import { Mail, Phone, GraduationCap, Shield, Award, Star, Edit3, Save, X, LogOut, Plus, BookOpen, Heart, Sparkles, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { UniversityLogo } from '@/components/UniversityLogo';
import { AcademicLevelIconByValue } from '@/components/AcademicLevelIcons';

const COMPREHENSIVE_UNIVERSITIES = [
  'King Saud University (KSU)',
  'Princess Nourah bint Abdulrahman University (PNU)',
  'Imam Mohammad Ibn Saud Islamic University (IMSIU)',
  'King Saud bin Abdulaziz University for Health Sciences (KSAU-HS)',
  'Prince Sultan University (PSU)',
  'Alfaisal University',
  'Al Yamamah University',
  'Dar Al Uloom University',
  'Majmaah University',
  'Shaqra University',
  'King Abdulaziz University (KAU)',
  'Umm Al-Qura University (UQU)',
  'Taibah University',
  'Islamic University of Madinah',
  'Jeddah University',
  'Effat University',
  'Dar Al-Hekma University',
  'University of Business and Technology (UBT)',
  'Batterjee Medical College (BMC)',
  'Ibn Sina National College for Medical Studies',
  'King Fahd University of Petroleum and Minerals (KFUPM)',
  'Imam Abdulrahman bin Faisal University (IAU)',
  'King Faisal University (KFU)',
  'Prince Mohammad bin Fahd University (PMU)',
  'University of Hafr Al Batin',
  'King Khalid University (KKU)',
  'Jazan University',
  'Najran University',
  'Al Baha University',
  'University of Tabuk (UT)',
  'Fahd bin Sultan University (FBSU)',
  "University of Ha'il",
  'Northern Border University',
  'Jouf University',
  'Qassim University',
  'King Abdullah University of Science and Technology (KAUST)',
  'Massachusetts Institute of Technology',
  'Stanford University',
  'Harvard University',
  'California Institute of Technology',
  'Princeton University',
  'Yale University',
  'Columbia University',
  'University of California, Berkeley',
  'University of California, Los Angeles',
  'University of California, San Diego',
  'University of Michigan',
  'Carnegie Mellon University',
  'Cornell University',
  'University of Pennsylvania',
  'New York University',
  'University of Washington',
  'University of Texas at Austin',
  'Georgia Institute of Technology',
  'University of Illinois Urbana-Champaign',
  'University of Southern California',
  'University of Oxford',
  'University of Cambridge',
  'Imperial College London',
  'University College London',
  "King's College London",
  'University of Edinburgh',
  'University of Manchester',
  'University of Bristol',
  'University of Warwick',
  'University of Glasgow',
  'University of Leeds',
  'University of Birmingham',
  'University of Southampton',
  'University of Nottingham',
  'University of Sheffield',
  'University of Toronto',
  'University of British Columbia',
  'McGill University',
  'University of Alberta',
  'University of Waterloo',
  'McMaster University',
  'University of Montreal',
  'Western University',
  "Queen's University",
  'University of Ottawa',
  'University of Melbourne',
  'University of Sydney',
  'Australian National University',
  'University of Queensland',
  'Monash University',
  'UNSW Sydney',
  'University of Adelaide',
  'University of Western Australia',
  'University of Technology Sydney',
  'RMIT University',
  'University of Tokyo',
  'Kyoto University',
  'Osaka University',
  'Tohoku University',
  'Nagoya University',
  'Tokyo Institute of Technology',
  'Keio University',
  'Waseda University',
  'Tsinghua University',
  'Peking University',
  'Fudan University',
  'Shanghai Jiao Tong University',
  'Zhejiang University',
  'University of Science and Technology of China',
  'Nanjing University',
  'Sun Yat-sen University',
  'Seoul National University',
  'KAIST',
  'Yonsei University',
  'Korea University',
  'POSTECH',
  'Sungkyunkwan University',
  'Hanyang University',
  'Technical University of Munich',
  'Ludwig Maximilian University of Munich',
  'Heidelberg University',
  'Humboldt University of Berlin',
  'Free University of Berlin',
  'RWTH Aachen University',
  'University of Freiburg',
  'University of Bonn',
  'PSL University',
  'Sorbonne University',
  'Paris-Saclay University',
  'École Polytechnique',
  'École Normale Supérieure',
  'University of Strasbourg',
  'University of Lyon',
  'University of Amsterdam',
  'Delft University of Technology',
  'Eindhoven University of Technology',
  'Leiden University',
  'Utrecht University',
  'Erasmus University Rotterdam',
  'ETH Zurich',
  'EPFL',
  'University of Zurich',
  'University of Geneva',
  'University of Lausanne',
  'National University of Singapore',
  'Nanyang Technological University',
  'Singapore Management University',
  'Indian Institute of Technology Bombay',
  'Indian Institute of Technology Delhi',
  'Indian Institute of Technology Madras',
  'Indian Institute of Technology Kanpur',
  'Indian Institute of Technology Kharagpur',
  'Indian Institute of Science',
  'University of Delhi',
  'Jawaharlal Nehru University',
  'University of Mumbai',
  'United Arab Emirates University',
  'Khalifa University',
  'American University of Sharjah',
  'University of Sharjah',
  'Zayed University',
  'American University in Dubai',
  'Qatar University',
  'Hamad Bin Khalifa University',
  'Doha Institute for Graduate Studies',
  'Middle East Technical University',
  'Istanbul Technical University',
  'Boğaziçi University',
  'Istanbul University',
  'Hacettepe University',
  'Koç University',
  'Bilkent University',
  'University of São Paulo',
  'University of Campinas',
  'Federal University of Rio de Janeiro',
  'Federal University of Minas Gerais',
  'University of Brasília',
  'University of Cape Town',
  'University of the Witwatersrand',
  'Stellenbosch University',
  'University of Johannesburg',
  'University of Pretoria'
];

const COMPREHENSIVE_MAJORS = [
  'Medicine and Surgery',
  'Doctor of Pharmacy (PharmD)',
  'Dental Medicine and Surgery',
  'Nursing Sciences',
  'Medical Laboratory Technology',
  'Physical Therapy',
  'Radiography & Medical Imaging',
  'Clinical Nutrition',
  'Public Health & Epidemiology',
  'Health Administration',
  'Emergency Medical Services',
  'Anesthesia Technology',
  'Civil Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Industrial Engineering',
  'Petroleum Engineering',
  'Aerospace Engineering',
  'Biomedical Engineering',
  'Environmental Engineering',
  'Computer Science',
  'Information Technology',
  'Computer Engineering',
  'Software Engineering',
  'Artificial Intelligence & Data Science',
  'Cybersecurity',
  'Information Systems',
  'Robotics & Autonomous Systems',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biochemistry',
  'Biology',
  'Geology / Earth Sciences',
  'Environmental Sciences',
  'Statistics & Actuarial Science',
  'Business Administration',
  'Accounting',
  'Finance & Investment',
  'Marketing',
  'Management Information Systems (MIS)',
  'Human Resource Management (HRM)',
  'Supply Chain Management & Logistics',
  'Risk Management & Insurance',
  'E-Commerce',
  'Tourism & Hospitality Management',
  'Law (Jurisprudence)',
  'Islamic Law (Sharia)',
  'Arabic Language and Literature',
  'English Language & Translation',
  'Mass Communication & Digital Media',
  'Sociology',
  'Psychology',
  'Political Science',
  'International Relations',
  'History',
  'Geography',
  'Special Education',
  'Early Childhood Education',
  'Physical Education & Sports Science',
  'Curriculum & Instruction',
  'Architecture',
  'Interior Design',
  'Urban Planning',
  'Graphic Design',
  'Visual Arts',
  'Fashion & Textile Design',
  'Fine Arts & Musicology',
  'Culinary Arts',
  'Agricultural Sciences',
  'Food Science & Technology',
  'Marine Sciences',
  'Aviation Management',
  'Machine Learning',
  'Deep Learning',
  'Data Science',
  'Big Data',
  'Computer Networks',
  'Cloud Computing',
  'Cloud Engineering',
  'Database Systems',
  'Web Development',
  'Mobile Application Development',
  'Game Development',
  'Computer Graphics',
  'Human-Computer Interaction',
  'Internet of Things',
  'Embedded Systems',
  'Computer Vision',
  'Natural Language Processing',
  'Bioinformatics',
  'Computational Science',
  'Digital Forensics',
  'Blockchain Technology',
  'Cryptography',
  'Network Security',
  'DevOps',
  'Software Architecture',
  'Operating Systems',
  'Distributed Systems',
  'Parallel Computing',
  'Quantum Computing',
  'Computational Biology',
  'Materials Engineering',
  'Mechatronics Engineering',
  'Architectural Engineering',
  'Nuclear Engineering',
  'Manufacturing Engineering',
  'Systems Engineering',
  'Telecommunications Engineering',
  'Automotive Engineering',
  'Marine Engineering',
  'Mining Engineering',
  'Geological Engineering',
  'Renewable Energy Engineering',
  'Robotics Engineering',
  'Artificial Intelligence Engineering',
  'International Business',
  'Entrepreneurship',
  'Business Analytics',
  'Project Management',
  'Operations Management',
  'Banking',
  'Insurance',
  'Investment',
  'Economics',
  'FinTech',
  'Digital Marketing',
  'Real Estate Management',
  'Hospitality Management',
  'Tourism Management',
  'Applied Mathematics',
  'Applied Physics',
  'Microbiology',
  'Biotechnology',
  'Genetics',
  'Molecular Biology',
  'Neuroscience',
  'Astronomy',
  'Astrophysics',
  'Oceanography',
  'Zoology',
  'Botany',
  'Dentistry',
  'Pharmacy',
  'Public Health',
  'Occupational Therapy',
  'Radiology',
  'Medical Laboratory Science',
  'Nutrition',
  'Dietetics',
  'Veterinary Medicine',
  'Biomedical Sciences',
  'Medical Imaging',
  'Respiratory Therapy',
  'Health Informatics',
  'Epidemiology',
  'Healthcare Administration',
  'Medical Technology',
  'Anthropology',
  'Communication',
  'Media Studies',
  'Journalism',
  'Social Work',
  'Criminology',
  'Development Studies',
  'Human Geography',
  'Social Psychology',
  'International Law',
  'Commercial Law',
  'Criminal Law',
  'Constitutional Law',
  'Human Rights Law',
  'Intellectual Property Law',
  'Environmental Law',
  'Corporate Law',
  'Cyber Law',
  'Tax Law',
  'Linguistics',
  'Philosophy',
  'Literature',
  'Fashion Design',
  'Music',
  'Theatre',
  'Film',
  'Photography',
  'Animation',
  'Archaeology',
  'Cultural Studies',
  'Visual Arts',
  'Education',
  'Elementary Education',
  'Secondary Education',
  'Educational Technology',
  'Educational Psychology',
  'Educational Leadership',
  'TESOL',
  'Language Education',
  'Mathematics Education',
  'Science Education',
  'Computer Science Education',
  'Agriculture',
  'Agricultural Engineering',
  'Forestry',
  'Fisheries',
  'Animal Science',
  'Horticulture',
  'Food Science',
  'Soil Science',
  'Environmental Management',
  'Wildlife Conservation',
  'Plant Science',
  'Agricultural Economics',
  'Food Technology',
  'Hospitality',
  'Tourism',
  'Aviation',
  'Transportation',
  'Logistics',
  'Sports Science',
  'Fitness',
  'Safety Management',
  'Security Services',
  'Disaster Management'
];

const ACADEMIC_LEVELS = [
  { label: 'First Year', icon: <Sparkles size={16} className="text-daffodil-500" /> },
  { label: 'Second Year', icon: <BookOpen size={16} className="text-fuchsia-500" /> },
  { label: 'Third Year', icon: <Award size={16} className="text-sky-500" /> },
  { label: 'Fourth Year', icon: <Star size={16} className="text-sage-500" /> },
  { label: 'Fifth Year', icon: <Heart size={16} className="text-poppy-500" /> },
  { label: 'Graduate', icon: <GraduationCap size={16} className="text-navy-500" /> }
];

export function StudentProfilePage({ studentId }: { studentId: string }) {
  const { students, currentUser, navigate, updateProfile } = useApp() as any;
  const student = students.find((s: any) => s.id === studentId) ?? currentUser;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(student.name);
  const [editLevel, setEditLevel] = useState(student.level || 'Second Year');
  const [editPhone, setEditPhone] = useState(student.phone || '');
  const [editEmail, setEditEmail] = useState(student.email || '');
  const [editUsername, setEditUsername] = useState(student.username || '');
  
  const [majorSearch, setMajorSearch] = useState(student.major || '');
  const [showMajorDropdown, setShowMajorDropdown] = useState(false);

  const [universitySearch, setUniversitySearch] = useState(student.university || '');
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);

  const majorRef = useRef<HTMLDivElement>(null);
  const universityRef = useRef<HTMLDivElement>(null);

  const [skillsList, setSkillsList] = useState<string[]>(student.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [interestsList, setInterestsList] = useState<string[]>(student.interests || []);
  const [newInterestInput, setNewInterestInput] = useState('');

  const isMe = student.id === currentUser.id;

  const canSeeEmail = isMe || student.privacy.emailVisibility === 'everyone' || (student.privacy.emailVisibility === 'same-university' && student.university === currentUser.university);
  const canSeePhone = isMe || student.privacy.phoneVisible;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (majorRef.current && !majorRef.current.contains(event.target as Node)) {
        setShowMajorDropdown(false);
      }
      if (universityRef.current && !universityRef.current.contains(event.target as Node)) {
        setShowUniversityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMajors = COMPREHENSIVE_MAJORS.filter(m => 
    m.toLowerCase().includes(majorSearch.toLowerCase())
  );

  const filteredUniversities = COMPREHENSIVE_UNIVERSITIES.filter(u => 
    u.toLowerCase().includes(universitySearch.toLowerCase())
  );

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skillsList.includes(newSkillInput.trim())) {
      setSkillsList([...skillsList, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleAddInterest = () => {
    if (newInterestInput.trim() && !interestsList.includes(newInterestInput.trim())) {
      setInterestsList([...interestsList, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterestsList(interestsList.filter(i => i !== interestToRemove));
  };

  const handleSaveProfile = () => {
    const updatedData = {
      name: editName,
      major: majorSearch.trim() || student.major || 'Computer Science',
      university: universitySearch.trim() || student.university || 'Jazan University',
      level: editLevel,
      phone: editPhone,
      email: editEmail,
      username: editUsername,
      skills: skillsList,
      interests: interestsList,
    };

    if (updateProfile) {
      updateProfile(updatedData);
    }

    if (currentUser && currentUser.id === student.id) {
      Object.assign(currentUser, updatedData);
    }

    try {
      const storedUsers = JSON.parse(localStorage.getItem('peerora_students') || '[]');
      const updatedStudents = storedUsers.map((s: any) => 
        s.id === student.id ? { ...s, ...updatedData } : s
      );
      localStorage.setItem('peerora_students', JSON.stringify(updatedStudents));
      localStorage.setItem('peerora_current_user', JSON.stringify({ ...student, ...updatedData }));
    } catch (e) {
      console.error(e);
    }

    setIsEditing(false);
  };

  return (
    <PageShell>
      {!isMe && <BackButton label="Back" />}
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-card space-y-6">
          
          <div className="flex flex-col items-center border-b border-cream-200 pb-6 relative">
            {isMe && (
              <div className="absolute right-0 top-0 flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1.5 rounded-pill bg-navy-500 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-navy-600"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 rounded-pill bg-gray-200 px-3 py-2 text-xs font-bold text-navy-500 transition hover:bg-gray-300"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMajorSearch(student.major || '');
                      setUniversitySearch(student.university || '');
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1.5 rounded-pill bg-lavender-100 px-4 py-2 text-xs font-bold text-navy-600 shadow-sm transition hover:bg-lavender-200"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </button>
                )}
              </div>
            )}

            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-lavender-200 font-display text-3xl font-bold text-navy-600 shadow-sm">
              {editName ? editName.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'NS'}
            </div>
            
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-3 text-center rounded-xl border border-cream-300 bg-cream-50 px-3 py-1 font-display text-lg font-bold text-navy-500 outline-none"
              />
            ) : (
              <h1 className="mt-3 font-display text-xl font-bold text-navy-500">{student.name}</h1>
            )}
            <p className="text-xs font-semibold text-navy-400">@{student.username}</p>
          </div>

          <div className="space-y-4">
            
            {/* Major with Searchable Dropdown */}
            <div className="relative" ref={majorRef}>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Major</label>
              {isEditing ? (
                <div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={majorSearch}
                      onChange={(e) => {
                        setMajorSearch(e.target.value);
                        setShowMajorDropdown(true);
                      }}
                      onFocus={() => setShowMajorDropdown(true)}
                      className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 pl-10 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                      placeholder="Search major..."
                    />
                    <Search size={16} className="absolute left-3 text-navy-400" />
                  </div>
                  {showMajorDropdown && (
                    <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-2xl border border-cream-300 bg-white shadow-lg">
                      {filteredMajors.length > 0 ? (
                        filteredMajors.map((m) => (
                          <div
                            key={m}
                            onClick={() => {
                              setMajorSearch(m);
                              setShowMajorDropdown(false);
                            }}
                            className="cursor-pointer px-4 py-2.5 text-sm font-semibold text-navy-500 hover:bg-cream-100 transition"
                          >
                            {m}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-navy-400 italic">No majors found</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <GraduationCap size={16} className="text-navy-400" />
                  <span>{student.major}</span>
                </div>
              )}
            </div>

            {/* University with Searchable Dropdown */}
            <div className="relative" ref={universityRef}>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">University</label>
              {isEditing ? (
                <div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={universitySearch}
                      onChange={(e) => {
                        setUniversitySearch(e.target.value);
                        setShowUniversityDropdown(true);
                      }}
                      onFocus={() => setShowUniversityDropdown(true)}
                      className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 pl-10 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                      placeholder="Search university..."
                    />
                    <Search size={16} className="absolute left-3 text-navy-400" />
                  </div>
                  {showUniversityDropdown && (
                    <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-2xl border border-cream-300 bg-white shadow-lg">
                      {filteredUniversities.length > 0 ? (
                        filteredUniversities.map((u) => (
                          <div
                            key={u}
                            onClick={() => {
                              setUniversitySearch(u);
                              setShowUniversityDropdown(false);
                            }}
                            className="cursor-pointer px-4 py-2.5 text-sm font-semibold text-navy-500 hover:bg-cream-100 transition flex items-center gap-2"
                          >
                            <UniversityLogo name={u} size={18} />
                            <span>{u}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-navy-400 italic">No universities found</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <UniversityLogo name={student.university} size={20} />
                  <span>{student.university}</span>
                </div>
              )}
            </div>

            {/* Academic Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Academic Level</label>
              {isEditing ? (
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                >
                  {ACADEMIC_LEVELS.map((lvl) => (
                    <option key={lvl.label} value={lvl.label}>{lvl.label}</option>
                  ))}
                </select>
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <AcademicLevelIconByValue value={student.level} size={16} />
                  <span>{student.level}</span>
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                  placeholder="+1 (555) 000-0000"
                />
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <Phone size={16} className="text-navy-400" />
                  <span>{canSeePhone ? student.phone : 'Hidden by privacy settings'}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                  placeholder="name@example.com"
                />
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 flex items-center gap-2">
                  <Mail size={16} className="text-navy-400" />
                  {canSeeEmail ? (
                    <a href={`mailto:${student.email}`} className="text-navy-600 hover:underline">
                      {student.email}
                    </a>
                  ) : (
                    <span className="text-navy-400/50 italic">Hidden by privacy settings</span>
                  )}
                </div>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                  placeholder="student_name"
                />
              ) : (
                <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-navy-500">
                  @{student.username}
                </div>
              )}
            </div>

            {/* Student Skills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Student Skills</label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); }}}
                      className="flex-1 rounded-2xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                      placeholder="Add a skill (e.g. Python, React)"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="flex items-center gap-1 rounded-2xl bg-fuchsia-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-fuchsia-600 transition"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-cream-50 rounded-2xl border border-cream-200">
                    {skillsList.map((skill) => (
                      <span key={skill} className="flex items-center gap-1 rounded-pill bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-sky-500 hover:text-sky-800 ml-1">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 rounded-2xl border border-cream-200 bg-cream-50 p-3">
                  {student.skills.map((skill: string) => (
                    <span key={skill} className="rounded-pill bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">{skill}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Student Interests */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">Student Interests</label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newInterestInput}
                      onChange={(e) => setNewInterestInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInterest(); }}}
                      className="flex-1 rounded-2xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-navy-500 outline-none focus:border-navy-400"
                      placeholder="Add an interest (e.g. AI, Cloud)"
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="flex items-center gap-1 rounded-2xl bg-fuchsia-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-fuchsia-600 transition"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-cream-50 rounded-2xl border border-cream-200">
                    {interestsList.map((interest) => (
                      <span key={interest} className="flex items-center gap-1 rounded-pill bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-700">
                        {interest}
                        <button type="button" onClick={() => handleRemoveInterest(interest)} className="text-fuchsia-500 hover:text-fuchsia-800 ml-1">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 rounded-2xl border border-cream-200 bg-cream-50 p-3">
                  {student.interests.map((interest: string) => (
                    <span key={interest} className="rounded-pill bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-700">{interest}</span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
