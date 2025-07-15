
import { type LucideIcon, GitBranch, Github, Figma, Palette, Flame, ToyBrick, Database, Send, Code, FileCode, Keyboard, Container, Box, Layers, Cog, Server, KanbanSquare, FileText, MessageSquare, Triangle, CloudUpload, Orbit, Cloud, Plane } from 'lucide-react';

export type Tool = {
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  category: string;
  resources: { title: string; url: string; type: 'YouTube' | 'Blog' | 'Course' | 'Official Docs' }[];
  tips: string[];
};

export const tools: Tool[] = [
  {
    name: "Git",
    slug: "git",
    description: "A distributed version control system for tracking changes in source code during software development.",
    icon: GitBranch,
    category: "Version Control",
    resources: [
        { title: 'Pro Git Book', url: 'https://git-scm.com/book/en/v2', type: 'Official Docs' },
        { title: 'Learn Git Branching', url: 'https://learngitbranching.js.org/', type: 'Course' },
        { title: 'Git Immersion', url: 'http://gitimmersion.com/', type: 'Course' }
    ],
    tips: ["Commit often and with clear messages.", "Use branches for new features or bug fixes.", "Learn interactive rebase for a clean commit history."]
  },
  {
    name: "GitHub",
    slug: "github",
    description: "A web-based platform for version control and collaboration, allowing developers to host and review code.",
    icon: Github,
    category: "Version Control",
    resources: [
        { title: 'GitHub Docs', url: 'https://docs.github.com/', type: 'Official Docs' },
        { title: 'GitHub Skills', url: 'https://skills.github.com/', type: 'Course' },
        { title: 'GitHub on YouTube', url: 'https://www.youtube.com/@GitHub', type: 'YouTube' }
    ],
    tips: ["Master pull requests for code reviews.", "Use GitHub Actions for CI/CD.", "Leverage GitHub Issues for project management."]
  },
  {
    name: "Figma",
    slug: "figma",
    description: "A collaborative interface design tool for creating wireframes, prototypes, and user interfaces.",
    icon: Figma,
    category: "Design",
    resources: [
        { title: 'Figma Learn', url: 'https://www.figma.com/learn/', type: 'Official Docs' },
        { title: 'Figma on YouTube', url: 'https://www.youtube.com/@Figma', type: 'YouTube' },
        { title: 'Figma Community', url: 'https://www.figma.com/community', type: 'Blog' }
    ],
    tips: ["Learn to use components and variants.", "Master auto layout for responsive designs.", "Use plugins to extend Figma's functionality."]
  },
  {
    name: "Canva",
    slug: "canva",
    description: "An online design and publishing tool with a mission to empower everyone to design anything.",
    icon: Palette,
    category: "Design",
    resources: [
        { title: 'Canva Design School', url: 'https://www.canva.com/designschool/', type: 'Course' },
        { title: 'Canva on YouTube', url: 'https://www.youtube.com/@Canva', type: 'YouTube' },
        { title: 'Canva Help Center', url: 'https://www.canva.com/help/', type: 'Official Docs' }
    ],
    tips: ["Use templates to get started quickly.", "Explore the vast library of elements and photos.", "Understand brand kits for consistency."]
  },
  {
    name: "Firebase",
    slug: "firebase",
    description: "A platform by Google providing backend services, including a NoSQL database (Firestore) and a real-time database.",
    icon: Flame,
    category: "Database",
    resources: [
        { title: 'Firebase Documentation', url: 'https://firebase.google.com/docs', type: 'Official Docs' },
        { title: 'Firebase on YouTube', url: 'https://www.youtube.com/c/firebase', type: 'YouTube' },
        { title: 'Fireship.io', url: 'https://fireship.io/', type: 'Blog' }
    ],
    tips: ["Start with Firestore for a flexible database.", "Use Firebase Authentication for easy user sign-in.", "Leverage Cloud Functions for serverless backend logic."]
  },
  {
    name: "Firebase Studio",
    slug: "firebase-studio",
    description: "A collaborative AI coding partner that helps users build and modify web apps with conversational language.",
    icon: ToyBrick,
    category: "Development Environment",
    resources: [
        { title: 'Firebase Blog', url: 'https://firebase.blog/', type: 'Blog' },
        { title: 'Firebase on YouTube', url: 'https://www.youtube.com/c/firebase', type: 'YouTube' },
        { title: 'Genkit Documentation', url: 'https://firebase.google.com/docs/genkit', type: 'Official Docs' }
    ],
    tips: ["Be clear and concise with your prompts.", "Break down complex requests into smaller steps.", "Review the generated code to learn and understand."]
  },
  {
    name: "Supabase",
    slug: "supabase",
    description: "An open source Firebase alternative, providing a full-featured Postgres database, authentication, and more.",
    icon: Database,
    category: "Database",
    resources: [
        { title: 'Supabase Docs', url: 'https://supabase.com/docs', type: 'Official Docs' },
        { title: 'Supabase on YouTube', url: 'https://www.youtube.com/c/Supabase', type: 'YouTube' },
        { title: 'Supabase Blog', url: 'https://supabase.com/blog', type: 'Blog' }
    ],
    tips: ["Leverage the power of Postgres for relational data.", "Use Row Level Security (RLS) for fine-grained access control.", "Explore Edge Functions for low-latency serverless compute."]
  },
  {
    name: "Postman",
    slug: "postman",
    description: "An API platform for developers to design, build, test and iterate on their APIs.",
    icon: Send,
    category: "API Development",
    resources: [
        { title: 'Postman Learning Center', url: 'https://learning.postman.com/', type: 'Official Docs' },
        { title: 'Postman on YouTube', url: 'https://www.youtube.com/c/Postman', type: 'YouTube' },
        { title: 'Postman Blog', url: 'https://blog.postman.com/', type: 'Blog' }
    ],
    tips: ["Use environments to manage variables for different stages.", "Write tests to validate API responses.", "Use collections to organize and share your API requests."]
  },
  {
    name: "Visual Studio Code",
    slug: "vscode",
    description: "A lightweight but powerful source-code editor which runs on your desktop and is available for Windows, macOS and Linux.",
    icon: Code,
    category: "Development Environment",
    resources: [
        { title: 'VS Code Docs', url: 'https://code.visualstudio.com/docs', type: 'Official Docs' },
        { title: 'VS Code on YouTube', url: 'https://www.youtube.com/c/VisualStudioCode', type: 'YouTube' },
        { title: 'VS Code Tips and Tricks', url: 'https://code.visualstudio.com/docs/getstarted/tips-and-tricks', type: 'Blog' }
    ],
    tips: ["Master the command palette (Ctrl+Shift+P).", "Explore the extensive marketplace for extensions.", "Customize your settings.json for a personalized workflow."]
  },
  {
    name: "IntelliJ IDEA",
    slug: "intellij-idea",
    description: "A capable and ergonomic IDE for JVM and other languages, with a focus on developer productivity.",
    icon: FileCode,
    category: "Development Environment",
    resources: [
        { title: 'IntelliJ IDEA Docs', url: 'https://www.jetbrains.com/idea/documentation/', type: 'Official Docs' },
        { title: 'JetBrainsTV on YouTube', url: 'https://www.youtube.com/c/JetBrainsTV', type: 'YouTube' },
        { title: 'IntelliJ IDEA Blog', url: 'https://blog.jetbrains.com/idea/', type: 'Blog' }
    ],
    tips: ["Learn the keymaps to navigate code quickly.", "Use the built-in debugger effectively.", "Leverage its powerful refactoring tools."]
  },
  {
    name: "Neovim",
    slug: "neovim",
    description: "A hyperextensible Vim-based text editor that’s fast, modern, and highly configurable.",
    icon: Keyboard,
    category: "Development Environment",
    resources: [
        { title: 'Neovim Docs', url: 'https://neovim.io/doc/', type: 'Official Docs' },
        { title: 'ThePrimeagen on YouTube', url: 'https://www.youtube.com/c/ThePrimeagen', type: 'YouTube' },
        { title: 'Neovim Reddit Community', url: 'https://www.reddit.com/r/neovim/', type: 'Blog' }
    ],
    tips: ["Embrace modal editing.", "Customize your init.lua or init.vim.", "Learn to use Telescope for fuzzy finding."]
  },
  {
    name: "Docker",
    slug: "docker",
    description: "A platform for developing, shipping, and running applications in isolated environments called containers.",
    icon: Container,
    category: "DevOps & Infrastructure",
    resources: [
        { title: 'Docker Docs', url: 'https://docs.docker.com/', type: 'Official Docs' },
        { title: 'Docker on YouTube', url: 'https://www.youtube.com/user/dockerrun', type: 'YouTube' },
        { title: 'Play with Docker', url: 'https://labs.play-with-docker.com/', type: 'Course' }
    ],
    tips: ["Keep your images small.", "Use multi-stage builds.", "Understand the difference between CMD and ENTRYPOINT."]
  },
  {
    name: "Kubernetes",
    slug: "kubernetes-tool",
    description: "An open-source container orchestration system for automating software deployment, scaling, and management.",
    icon: Box,
    category: "DevOps & Infrastructure",
    resources: [
        { title: 'Kubernetes Docs', url: 'https://kubernetes.io/docs/home/', type: 'Official Docs' },
        { title: 'Kubernetes Course by freeCodeCamp', url: 'https://www.youtube.com/watch?v=s_o8dwzRlu4', type: 'YouTube' },
        { title: 'Kubernetes by Example', url: 'https://kubernetesbyexample.com/', type: 'Blog' }
    ],
    tips: ["Understand the difference between a Deployment and a StatefulSet.", "Use kubectl efficiently.", "Learn about Helm for package management."]
  },
  {
    name: "Terraform",
    slug: "terraform",
    description: "An infrastructure as code (IaC) tool that lets you build, change, and version infrastructure safely and efficiently.",
    icon: Layers,
    category: "DevOps & Infrastructure",
    resources: [
        { title: 'Terraform Docs', url: 'https://www.terraform.io/docs', type: 'Official Docs' },
        { title: 'HashiCorp on YouTube', url: 'https://www.youtube.com/c/HashiCorp', type: 'YouTube' },
        { title: 'Terraform Registry', url: 'https://registry.terraform.io/', type: 'Blog' }
    ],
    tips: ["Keep your state file secure.", "Use modules for reusable infrastructure.", "Run `terraform plan` before you `apply`."]
  },
  {
    name: "Jenkins",
    slug: "jenkins",
    description: "An open-source automation server which enables developers to reliably build, test, and deploy their software.",
    icon: Cog,
    category: "DevOps & Infrastructure",
    resources: [
        { title: 'Jenkins Docs', url: 'https://www.jenkins.io/doc/', type: 'Official Docs' },
        { title: 'Jenkins on YouTube', url: 'https://www.youtube.com/c/jenkinsci', type: 'YouTube' },
        { title: 'Jenkins Blog', url: 'https://www.jenkins.io/blog/', type: 'Blog' }
    ],
    tips: ["Use Pipelines as Code with Jenkinsfiles.", "Secure your Jenkins instance.", "Distribute builds across multiple agents."]
  },
  {
    name: "PostgreSQL",
    slug: "postgresql",
    description: "A powerful, open-source object-relational database system with over 30 years of active development.",
    icon: Database,
    category: "Database",
    resources: [
        { title: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/', type: 'Official Docs' },
        { title: 'Postgres FM Podcast', url: 'https://postgres.fm/', type: 'Blog' },
        { title: 'PG Casts by Crunchy Data', url: 'https://www.crunchydata.com/pgcasts', type: 'Course' }
    ],
    tips: ["Use indexes wisely to improve query performance.", "Understand transaction isolation levels.", "Leverage its support for JSONB for semi-structured data."]
  },
  {
    name: "MongoDB",
    slug: "mongodb",
    description: "A source-available cross-platform document-oriented database program, classified as a NoSQL database.",
    icon: Database,
    category: "Database",
    resources: [
        { title: 'MongoDB Docs', url: 'https://docs.mongodb.com/', type: 'Official Docs' },
        { title: 'MongoDB on YouTube', url: 'https://www.youtube.com/c/MongoDB', type: 'YouTube' },
        { title: 'MongoDB University', url: 'https://learn.mongodb.com/', type: 'Course' }
    ],
    tips: ["Design your schema based on your application's query patterns.", "Understand indexing for performance.", "Use aggregation pipelines for complex data processing."]
  },
  {
    name: "Redis",
    slug: "redis",
    description: "An in-memory data structure store, used as a distributed, in-memory key–value database, cache and message broker.",
    icon: Server,
    category: "Database",
    resources: [
        { title: 'Redis Docs', url: 'https://redis.io/docs/', type: 'Official Docs' },
        { title: 'Redis University', url: 'https://redis.com/redis-enterprise/training/redis-university/', type: 'Course' },
        { title: 'Redis Developer Blog', url: 'https://redis.com/blog/', type: 'Blog' }
    ],
    tips: ["Use it for caching, session management, or real-time analytics.", "Choose the right data structure for your use case.", "Understand persistence options."]
  },
  {
    name: "MySQL",
    slug: "mysql",
    description: "The world's most popular open-source relational database, known for its reliability and ease of use.",
    icon: Database,
    category: "Database",
    resources: [
        { title: 'MySQL Documentation', url: 'https://dev.mysql.com/doc/', type: 'Official Docs' },
        { title: 'W3Schools MySQL Tutorial', url: 'https://www.w3schools.com/mysql/', type: 'Course' },
        { title: 'MySQL Tutorial by freeCodeCamp', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', type: 'YouTube' }
    ],
    tips: ["Choose the right storage engine (e.g., InnoDB, MyISAM).", "Optimize queries using EXPLAIN.", "Regularly back up your databases."]
  },
  {
    name: "Jira",
    slug: "jira",
    description: "A proprietary issue tracking product developed by Atlassian that allows bug tracking and agile project management.",
    icon: KanbanSquare,
    category: "Project Management",
    resources: [
        { title: 'Atlassian Jira Guides', url: 'https://www.atlassian.com/software/jira/guides', type: 'Official Docs' },
        { title: 'Atlassian on YouTube', url: 'https://www.youtube.com/c/Atlassian', type: 'YouTube' },
        { title: 'Atlassian Community', url: 'https://community.atlassian.com/', type: 'Blog' }
    ],
    tips: ["Customize workflows to match your team's process.", "Use JQL (Jira Query Language) for powerful searching.", "Integrate it with your CI/CD tools."]
  },
  {
    name: "Notion",
    slug: "notion",
    description: "An all-in-one workspace for notes, tasks, wikis, and databases that blends everyday work apps into one.",
    icon: FileText,
    category: "Project Management",
    resources: [
        { title: 'Notion Help & Support', url: 'https://www.notion.so/help', type: 'Official Docs' },
        { title: 'Notion on YouTube', url: 'https://www.youtube.com/c/Notion', type: 'YouTube' },
        { title: 'Thomas Frank Explains', url: 'https://www.youtube.com/c/ThomasFrank', type: 'YouTube' }
    ],
    tips: ["Start with templates to understand possibilities.", "Use databases and linked views to organize everything.", "Learn keyboard shortcuts to be faster."]
  },
  {
    name: "Slack",
    slug: "slack",
    description: "A channel-based messaging platform that connects your teams, tools, customers, and partners in a digital HQ.",
    icon: MessageSquare,
    category: "Project Management",
    resources: [
        { title: 'Slack Help Center', url: 'https://slack.com/help', type: 'Official Docs' },
        { title: 'Slack on YouTube', url: 'https://www.youtube.com/c/Slack', type: 'YouTube' },
        { title: 'Slack Blog', url: 'https://slack.com/blog', type: 'Blog' }
    ],
    tips: ["Organize conversations in channels.", "Use threads to keep discussions focused.", "Integrate your favorite apps to streamline workflows."]
  },
  {
    name: "NGINX",
    slug: "nginx",
    description: "A high-performance web server, reverse proxy, load balancer, and HTTP cache.",
    icon: Server,
    category: "DevOps & Infrastructure",
    resources: [
        { title: 'NGINX Docs', url: 'https://nginx.org/en/docs/', type: 'Official Docs' },
        { title: 'DigitalOcean NGINX Tutorials', url: 'https://www.digitalocean.com/community/tags/nginx', type: 'Blog' },
        { title: 'NGINX Admin Guide', url: 'https://docs.nginx.com/nginx/admin-guide/', type: 'Course' }
    ],
    tips: ["Use it as a reverse proxy to manage traffic to your app servers.", "Configure it for load balancing across multiple backend servers.", "Leverage its capabilities for caching static content."]
  },
  {
    name: "Vercel",
    slug: "vercel",
    description: "A cloud platform for static sites and Serverless Functions that fits perfectly with your workflow.",
    icon: Triangle,
    category: "Hosting & Deployment",
    resources: [
        { title: 'Vercel Docs', url: 'https://vercel.com/docs', type: 'Official Docs' },
        { title: 'Vercel on YouTube', url: 'https://www.youtube.com/c/Vercel', type: 'YouTube' },
        { title: 'Next.js by Vercel', url: 'https://nextjs.org/', type: 'Official Docs' }
    ],
    tips: ["Enjoy zero-config deployments for Next.js apps.", "Use Serverless Functions for your backend API.", "Utilize Preview Deployments for every Git push."]
  },
  {
    name: "Netlify",
    slug: "netlify",
    description: "An all-in-one platform for automating modern web projects, from hosting to serverless functions.",
    icon: CloudUpload,
    category: "Hosting & Deployment",
    resources: [
        { title: 'Netlify Docs', url: 'https://docs.netlify.com/', type: 'Official Docs' },
        { title: 'Netlify Blog', url: 'https://www.netlify.com/blog/', type: 'Blog' },
        { title: 'Jamstack Explorers', url: 'https://explorers.netlify.com/', type: 'Course' }
    ],
    tips: ["Connect your Git repository for continuous deployment.", "Use Netlify Functions for server-side logic.", "Manage forms and user authentication with built-in services."]
  },
  {
    name: "Render",
    slug: "render",
    description: "A unified cloud to build and run all your apps and websites with free TLS certificates, a global CDN, and private networks.",
    icon: Orbit,
    category: "Hosting & Deployment",
    resources: [
        { title: 'Render Docs', url: 'https://render.com/docs', type: 'Official Docs' },
        { title: 'Render Blog', url: 'https://render.com/blog', type: 'Blog' },
        { title: 'Render Community', url: 'https://community.render.com/', type: 'Blog' }
    ],
    tips: ["Use 'render.yaml' for infrastructure as code.", "Deploy services, databases, and cron jobs all in one place.", "Take advantage of Preview Environments for pull requests."]
  },
  {
    name: "Heroku",
    slug: "heroku",
    description: "A cloud platform as a service (PaaS) supporting several programming languages. Known for its simplicity.",
    icon: Cloud,
    category: "Hosting & Deployment",
    resources: [
        { title: 'Heroku Dev Center', url: 'https://devcenter.heroku.com/', type: 'Official Docs' },
        { title: 'The Heroku Blog', url: 'https://blog.heroku.com/', type: 'Blog' },
        { title: 'Heroku on YouTube', url: 'https://www.youtube.com/c/Heroku', type: 'YouTube' }
    ],
    tips: ["Use Buildpacks to automate the build process.", "Scale your application with 'dynos'.", "Extend functionality with the Heroku Add-ons marketplace."]
  },
  {
    name: "Fly.io",
    slug: "fly-io",
    description: "A platform for deploying and running full-stack applications and databases close to your users.",
    icon: Plane,
    category: "Hosting & Deployment",
    resources: [
        { title: 'Fly.io Docs', url: 'https://fly.io/docs/', type: 'Official Docs' },
        { title: 'The Fly.io Blog', url: 'https://fly.io/blog/', type: 'Blog' },
        { title: 'Fly.io Community', url: 'https://community.fly.io/', type: 'Blog' }
    ],
    tips: ["Use the powerful `flyctl` command-line tool.", "Deploy Docker containers or full-stack apps.", "Distribute your app globally for lower latency."]
  },
  {
    name: "C",
    slug: "c",
    description: "A general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion.",
    icon: FileCode,
    category: "Programming Language",
    resources: [
      { title: 'Learn C', url: 'https://www.learn-c.org/', type: 'Course' },
      { title: 'C Programming Language, 2nd Edition (K&R)', url: 'https://en.wikipedia.org/wiki/The_C_Programming_Language', type: 'Blog' },
      { title: 'C Programming for Beginners by freeCodeCamp', url: 'https://www.youtube.com/watch?v=KJgsSAhyzos', type: 'YouTube' }
    ],
    tips: ["Master pointers; they are the power and peril of C.", "Understand memory management (malloc, free).", "Read and understand existing C codebases like the Linux kernel."]
  },
  {
    name: "C++",
    slug: "cpp",
    description: "A high-level, general-purpose programming language created as an extension of the C programming language, with object-oriented features.",
    icon: FileCode,
    category: "Programming Language",
    resources: [
      { title: 'Learn C++', url: 'https://www.learncpp.com/', type: 'Course' },
      { title: 'C++ Core Guidelines', url: 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines', type: 'Official Docs' },
      { title: 'The C++ Programming Language by Bjarne Stroustrup', url: 'https://www.stroustrup.com/4th.html', type: 'Blog' }
    ],
    tips: ["Understand the RAII (Resource Acquisition Is Initialization) principle.", "Leverage the Standard Template Library (STL).", "Learn the differences between modern C++ (11/14/17/20) and older standards."]
  },
  {
    name: "C#",
    slug: "csharp",
    description: "A modern, object-oriented, and type-safe programming language developed by Microsoft for the .NET framework.",
    icon: FileCode,
    category: "Programming Language",
    resources: [
      { title: 'C# Documentation', url: 'https://docs.microsoft.com/en-us/dotnet/csharp/', type: 'Official Docs' },
      { title: 'IAmTimCorey on YouTube', url: 'https://www.youtube.com/c/IAmTimCorey', type: 'YouTube' },
      { title: 'C# Players Guide', url: 'http://csharp-players-guide.com/', type: 'Course' }
    ],
    tips: ["Leverage LINQ for powerful data querying.", "Understand async/await for asynchronous programming.", "Explore the vast .NET ecosystem for different application types."]
  },
  {
    name: "Go",
    slug: "go",
    description: "A statically typed, compiled programming language designed at Google. It is known for its simplicity, efficiency, and strong support for concurrency.",
    icon: FileCode,
    category: "Programming Language",
    resources: [
      { title: 'Official Go Documentation', url: 'https://go.dev/doc/', type: 'Official Docs' },
      { title: 'A Tour of Go', url: 'https://go.dev/tour/', type: 'Course' },
      { title: 'Go by Example', url: 'https://gobyexample.com/', type: 'Blog' }
    ],
    tips: ["Embrace simplicity and readability.", "Use goroutines and channels for concurrent programming.", "Leverage the powerful standard library."]
  },
  {
    name: "Python",
    slug: "python",
    description: "An interpreted, high-level and general-purpose programming language known for its simple, readable syntax.",
    icon: FileCode,
    category: "Programming Language",
    resources: [
      { title: 'Python.org Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'Official Docs' },
      { title: 'Automate the Boring Stuff with Python', url: 'https://automatetheboringstuff.com/', type: 'Course' },
      { title: 'Real Python', url: 'https://realpython.com/', type: 'Blog' }
    ],
    tips: ["Embrace the 'Pythonic' way of writing code (PEP 8).", "Use virtual environments to manage project dependencies.", "Explore the rich ecosystem of libraries like NumPy, Pandas, Django, and Flask."]
  },
  {
    name: "Java",
    slug: "java",
    description: "A high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.",
    icon: FileCode,
    category: "Programming Language",
    resources: [
      { title: 'Oracle Java Tutorials', url: 'https://docs.oracle.com/javase/tutorial/', type: 'Official Docs' },
      { title: 'Baeldung', url: 'https://www.baeldung.com/', type: 'Blog' },
      { title: 'Java Brains on YouTube', url: 'https://www.youtube.com/c/JavaBrainsChannel', type: 'YouTube' }
    ],
    tips: ["Understand the JVM (Java Virtual Machine).", "Master the Java Collections Framework.", "Explore build tools like Maven or Gradle."]
  },
  {
    name: "JavaScript",
    slug: "javascript",
    description: "A high-level, often just-in-time compiled language that conforms to the ECMAScript specification. The language of the web.",
    icon: FileCode,
    category: "Programming Language",
    resources: [
      { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'Official Docs' },
      { title: 'JavaScript.info', url: 'https://javascript.info/', type: 'Course' },
      { title: 'You Don\'t Know JS (Book Series)', url: 'https://github.com/getify/You-Dont-Know-JS', type: 'Blog' }
    ],
    tips: ["Understand `this` keyword, prototypes, and closures.", "Learn ES6+ features like arrow functions, promises, and async/await.", "Grasp the asynchronous nature of the language and the event loop."]
  },
  {
    name: "R",
    slug: "r-lang",
    description: "A programming language and free software environment for statistical computing and graphics.",
    icon: FileCode,
    category: "Programming Language",
    resources: [
      { title: 'R for Data Science (Book)', url: 'https://r4ds.had.co.nz/', type: 'Course' },
      { title: 'The R Project for Statistical Computing', url: 'https://www.r-project.org/', type: 'Official Docs' },
      { title: 'R-bloggers', url: 'https://www.r-bloggers.com/', type: 'Blog' }
    ],
    tips: ["Master the Tidyverse for data manipulation and visualization.", "Learn to use RStudio for a powerful development environment.", "Explore CRAN for a vast collection of packages for any statistical task."]
  }
];
