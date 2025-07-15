
import { type LucideIcon, Monitor, Server, Layers, TestTube, Combine, LayoutTemplate, AppWindow } from 'lucide-react';

export type CareerPath = {
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  domains: string[];
  tools: string[];
  skills: string[];
};

export const careerPaths: CareerPath[] = [
  {
    name: 'Frontend Developer',
    slug: 'frontend-developer',
    description: 'Build the user-facing part of websites and web applications, focusing on user experience and interface design.',
    icon: Monitor,
    domains: ['web-development', 'ui-ux-design', 'data-structures-algorithms'],
    tools: ['git', 'github', 'figma', 'vscode', 'javascript', 'vercel', 'netlify'],
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Angular', 'UI/UX Principles', 'Responsive Design', 'API Integration']
  },
  {
    name: 'Backend Developer',
    slug: 'backend-developer',
    description: 'Develop the server-side logic, databases, and APIs that power applications from behind the scenes.',
    icon: Server,
    domains: ['web-development', 'cloud-devops', 'data-structures-algorithms', 'data-engineering'],
    tools: ['git', 'github', 'docker', 'kubernetes-tool', 'postman', 'postgresql', 'mysql', 'redis', 'go', 'python', 'java'],
    skills: ['Node.js', 'Python', 'Go', 'Java', 'REST APIs', 'SQL', 'NoSQL', 'Microservices', 'Authentication']
  },
  {
    name: 'Full-Stack Developer',
    slug: 'full-stack-developer',
    description: 'Work on both the frontend and backend of applications, handling everything from UI to databases and servers.',
    icon: Layers,
    domains: ['web-development', 'app-development', 'cloud-devops', 'ui-ux-design', 'data-structures-algorithms'],
    tools: ['git', 'github', 'docker', 'vscode', 'javascript', 'python', 'postgresql', 'firebase', 'vercel'],
    skills: ['Frontend Frameworks (React, etc.)', 'Backend Development (Node.js, etc.)', 'Database Management', 'DevOps', 'API Design']
  },
  {
    name: 'Data Scientist',
    slug: 'data-scientist',
    description: 'Analyze and interpret complex data to help organizations make better decisions using machine learning and statistical methods.',
    icon: TestTube,
    domains: ['machine-learning', 'data-analytics', 'data-engineering', 'llms', 'data-structures-algorithms'],
    tools: ['python', 'postgresql', 'mysql', 'docker'],
    skills: ['Python (Pandas, NumPy)', 'R', 'Statistics', 'Machine Learning Algorithms', 'Data Visualization', 'SQL']
  },
  {
    name: 'DevOps Engineer',
    slug: 'devops-engineer',
    description: 'Automate and streamline the software development lifecycle, from building and testing to deployment and operations.',
    icon: Combine,
    domains: ['cloud-devops', 'kubernetes', 'linux', 'aws', 'gcp', 'azure'],
    tools: ['git', 'github', 'docker', 'kubernetes-tool', 'terraform', 'jenkins', 'nginx'],
    skills: ['CI/CD', 'Docker', 'Kubernetes', 'Cloud Platforms (AWS, GCP, Azure)', 'Infrastructure as Code (Terraform)', 'Scripting']
  },
  {
    name: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    description: 'Create user-friendly interfaces and experiences that are both visually appealing and easy to navigate.',
    icon: LayoutTemplate,
    domains: ['ui-ux-design', 'graphic-design', 'product-management'],
    tools: ['figma', 'canva', 'notion'],
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Figma', 'Visual Design']
  },
  {
    name: 'Mobile Developer',
    slug: 'mobile-developer',
    description: 'Design, build, and maintain applications for mobile devices on platforms like iOS and Android.',
    icon: AppWindow,
    domains: ['app-development', 'ui-ux-design', 'data-structures-algorithms'],
    tools: ['git', 'github', 'firebase', 'supabase', 'javascript', 'java'],
    skills: ['Swift (iOS)', 'Kotlin (Android)', 'React Native', 'Flutter', 'Mobile UI/UX', 'API Integration']
  },
];
