
import { type LucideIcon, Code2, Smartphone, BrainCircuit, Cloud, PenTool, Film, Megaphone, Paintbrush, Blocks, ShieldCheck, Box, Waypoints, Sparkles, Bot, Gamepad2, DatabaseZap, View, Cpu, ClipboardCheck, GanttChartSquare, BarChart, FileText, Terminal, Component, Database, Workflow } from 'lucide-react';

export type Domain = {
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  roadmap: { title: string; description: string }[];
  resources: { title: string; url: string; type: 'YouTube' | 'Blog' | 'Course' | 'Official Docs' }[];
  projectIdeas: { title: string; description: string; difficulty: 'Beginner' | 'Intermediate' }[];
  tools: { name:string; description: string }[];
  tips: string[];
};

export const domains: Domain[] = [
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Build websites and web applications. Learn HTML, CSS, JavaScript, and modern frameworks.',
    icon: Code2,
    roadmap: [
      { title: 'Learn HTML & CSS', description: 'Understand the basic structure and styling of web pages.' },
      { title: 'Master JavaScript', description: 'Learn the core programming language of the web.' },
      { title: 'Choose a Framework', description: 'Explore popular frameworks like React, Vue, or Angular.' },
      { title: 'Backend Basics', description: 'Learn Node.js, Express, and databases like MongoDB or PostgreSQL.' },
    ],
    resources: [
      { title: 'freeCodeCamp', url: 'https://www.youtube.com/@freecodecamp', type: 'YouTube' },
      { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', type: 'Blog' },
      { title: 'The Odin Project', url: 'https://www.theodinproject.com/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Portfolio Website', description: 'Create a personal portfolio to showcase your projects.', difficulty: 'Beginner' },
        { title: 'E-commerce Site', description: 'Build a full-stack online store with product listings and a shopping cart.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'VS Code', description: 'A versatile code editor.' },
        { name: 'Git & GitHub', description: 'For version control and collaboration.' },
        { name: 'Figma', description: 'For UI design and prototyping.' },
    ],
    tips: ['Build projects consistently.', 'Contribute to open source.', 'Stay updated with the latest trends.'],
  },
  {
    name: 'App Development',
    slug: 'app-development',
    description: 'Create mobile applications for iOS and Android using native or cross-platform technologies.',
    icon: Smartphone,
    roadmap: [
        { title: 'Choose a Platform', description: 'Decide between iOS (Swift), Android (Kotlin), or cross-platform (React Native, Flutter).'},
        { title: 'Learn the Language', description: 'Master Swift for iOS, Kotlin for Android, or Dart for Flutter.' },
        { title: 'Understand UI/UX', description: 'Learn design principles for mobile apps.' },
        { title: 'API Integration', description: 'Connect your app to backend services and third-party APIs.' },
    ],
    resources: [
        { title: 'Flutter Official Channel', url: 'https://www.youtube.com/@FlutterDev', type: 'YouTube' },
        { title: 'Kodeco', url: 'https://www.kodeco.com/', type: 'Blog' },
        { title: 'Udacity Nanodegree', url: 'https://www.udacity.com/course/android-kotlin-developer-nanodegree--nd940', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'To-Do List App', description: 'A simple app to manage daily tasks.', difficulty: 'Beginner' },
        { title: 'Weather App', description: 'Fetch and display weather data from an API.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Xcode', description: 'IDE for iOS development.' },
        { name: 'Android Studio', description: 'IDE for Android development.' },
        { name: 'Firebase', description: 'Backend services for mobile apps.' },
    ],
    tips: ['Focus on a great user experience.', 'Test on real devices.', 'Publish your app to the app stores.'],
  },
  {
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'Dive into AI, data science, and algorithms to build intelligent systems.',
    icon: BrainCircuit,
    roadmap: [
        { title: 'Python & Math Foundations', description: 'Strengthen your Python skills and understand linear algebra, calculus, and probability.'},
        { title: 'Core ML Concepts', description: 'Learn about supervised, unsupervised, and reinforcement learning.' },
        { title: 'Master a Framework', description: 'Work with TensorFlow or PyTorch.' },
        { title: 'Build and Deploy Models', description: 'Practice building models and deploying them to production.' },
    ],
    resources: [
        { title: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', type: 'YouTube' },
        { title: 'Towards Data Science', url: 'https://towardsdatascience.com/', type: 'Blog' },
        { title: 'Coursera Machine Learning by Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Spam Classifier', description: 'Build a model to classify emails as spam or not.', difficulty: 'Beginner' },
        { title: 'Image Recognition', description: 'Create a model to identify objects in images.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Jupyter Notebooks', description: 'For interactive data science.' },
        { name: 'Scikit-learn', description: 'Simple and efficient tools for data mining and data analysis.' },
        { name: 'Pandas & NumPy', description: 'For data manipulation and numerical computation.' },
    ],
    tips: ['Understand the theory behind algorithms.', 'Participate in Kaggle competitions.', 'Work with real-world datasets.'],
  },
  {
    name: 'Cloud / DevOps',
    slug: 'cloud-devops',
    description: 'Learn to build, deploy, and maintain scalable applications on the cloud.',
    icon: Cloud,
    roadmap: [
        { title: 'Linux & Networking Basics', description: 'Understand operating systems and networking fundamentals.'},
        { title: 'Choose a Cloud Provider', description: 'Learn AWS, Google Cloud, or Azure.' },
        { title: 'Containerization', description: 'Master Docker and Kubernetes for container orchestration.' },
        { title: 'CI/CD Pipelines', description: 'Automate your build, test, and deployment processes.' },
    ],
    resources: [
        { title: 'TechWorld with Nana', url: 'https://www.youtube.com/@TechWorldwithNana', type: 'YouTube' },
        { title: 'DevOps.com', url: 'https://devops.com/', type: 'Blog' },
        { title: 'A Cloud Guru', url: 'https://acloudguru.com/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Deploy a Website', description: 'Deploy a simple static website to a cloud service.', difficulty: 'Beginner' },
        { title: 'Automated CI/CD Pipeline', description: 'Set up a full CI/CD pipeline for a sample application.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Docker', description: 'Containerization platform.' },
        { name: 'Kubernetes', description: 'Container orchestration.' },
        { name: 'Terraform', description: 'Infrastructure as Code.' },
    ],
    tips: ['Get certified in a cloud platform.', 'Automate everything you can.', 'Understand security best practices.'],
  },
  {
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Design intuitive and beautiful user interfaces and experiences for digital products.',
    icon: PenTool,
    roadmap: [
        { title: 'Learn Design Principles', description: 'Understand color theory, typography, and layout.'},
        { title: 'Master a Design Tool', description: 'Become proficient in Figma, Sketch, or Adobe XD.' },
        { title: 'User Research & Personas', description: 'Learn how to understand your users and their needs.' },
        { title: 'Prototyping & Testing', description: 'Create interactive prototypes and test them with users.' },
    ],
    resources: [
        { title: 'Figma', url: 'https://www.youtube.com/@Figma', type: 'YouTube' },
        { title: 'Nielsen Norman Group', url: 'https://www.nngroup.com/', type: 'Blog' },
        { title: 'Interaction Design Foundation', url: 'https://www.interaction-design.org/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Redesign a Local Business Website', description: 'Improve the UI/UX of a real-world website.', difficulty: 'Beginner' },
        { title: 'Design a Mobile Banking App', description: 'Create a full design system and user flow for a new app.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Figma', description: 'Collaborative interface design tool.' },
        { name: 'Adobe XD', description: 'Vector-based UI/UX design tool.' },
        { name: 'UserTesting.com', description: 'Platform for user research.' },
    ],
    tips: ['Build a strong portfolio.', 'Ask for feedback constantly.', 'Think from the user\'s perspective.'],
  },
  {
    name: 'Video Editing',
    slug: 'video-editing',
    description: 'Tell compelling stories through video with professional editing techniques.',
    icon: Film,
    roadmap: [
        { title: 'Master an Editing Software', description: 'Learn Adobe Premiere Pro, Final Cut Pro, or DaVinci Resolve.'},
        { title: 'Understand Storytelling', description: 'Learn pacing, cuts, and transitions to tell a story.' },
        { title: 'Color Correction & Grading', description: 'Master the art of color to set the mood.' },
        { title: 'Audio Editing', description: 'Clean up audio and add sound effects and music.' },
    ],
    resources: [
        { title: 'Peter McKinnon', url: 'https://www.youtube.com/@PeterMcKinnon', type: 'YouTube' },
        { title: 'No Film School', url: 'https://nofilmschool.com/', type: 'Blog' },
        { title: 'Skillshare', url: 'https://www.skillshare.com/browse/video-editing', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Create a Travel Vlog', description: 'Edit footage from a trip into a short, engaging video.', difficulty: 'Beginner' },
        { title: 'Short Film', description: 'Plan, shoot, and edit a narrative short film.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Adobe Premiere Pro', description: 'Industry-standard video editor.' },
        { name: 'DaVinci Resolve', description: 'Professional editing, color, effects and audio post production.' },
        { name: 'Artlist.io / Epidemic Sound', description: 'For royalty-free music.' },
    ],
    tips: ['Practice makes perfect.', 'Watch tutorials and analyze other editors\' work.', 'A good story is more important than fancy effects.'],
  },
  {
    name: 'Content Creation',
    slug: 'content-creation',
    description: 'Build an audience by creating valuable content on platforms like YouTube, blogs, or podcasts.',
    icon: Megaphone,
    roadmap: [
        { title: 'Find Your Niche', description: 'Choose a topic you are passionate and knowledgeable about.'},
        { title: 'Choose Your Platform', description: 'Focus on one platform initially (e.g., YouTube, blog, TikTok).' },
        { title: 'Create a Content Calendar', description: 'Plan your content in advance to stay consistent.' },
        { title: 'Engage with Your Audience', description: 'Build a community around your content.' },
    ],
    resources: [
        { title: 'Think Media', url: 'https://www.youtube.com/@ThinkMediaTV', type: 'YouTube' },
        { title: 'Copyblogger', url: 'https://copyblogger.com/', type: 'Blog' },
        { title: 'HubSpot Academy', url: 'https://academy.hubspot.com/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Start a Blog', description: 'Write and publish 10 articles on a topic of your choice.', difficulty: 'Beginner' },
        { title: 'Launch a YouTube Channel', description: 'Create and upload your first 5 videos.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Canva', description: 'For creating graphics and thumbnails.' },
        { name: 'Notion', description: 'For content planning and organization.' },
        { name: 'TubeBuddy / VidIQ', description: 'For YouTube SEO and analytics.' },
    ],
    tips: ['Consistency is key.', 'Provide value to your audience.', 'Be authentic.'],
  },
  {
    name: 'Graphic Design',
    slug: 'graphic-design',
    description: 'Communicate visually through typography, photography, and illustration.',
    icon: Paintbrush,
    roadmap: [
        { title: 'Learn Design Fundamentals', description: 'Master hierarchy, contrast, balance, and other core principles.'},
        { title: 'Master Adobe Suite', description: 'Learn Photoshop, Illustrator, and InDesign.' },
        { title: 'Develop a Portfolio', description: 'Showcase your best work in a professional portfolio.' },
        { title: 'Find Your Specialization', description: 'Focus on branding, illustration, or another area.' },
    ],
    resources: [
        { title: 'The Futur', url: 'https://www.youtube.com/@TheFutur', type: 'YouTube' },
        { title: 'AIGA Eye on Design', url: 'https://eyeondesign.aiga.org/', type: 'Blog' },
        { title: 'Domestika', url: 'https://www.domestika.org/en/courses/category/3-illustration', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Design a Logo', description: 'Create a brand identity for a fictional company.', difficulty: 'Beginner' },
        { title: 'Magazine Layout', description: 'Design a professional two-page spread for a magazine.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Adobe Photoshop', description: 'For photo editing and raster graphics.' },
        { name: 'Adobe Illustrator', description: 'For vector graphics and illustration.' },
        { name: 'Procreate', description: 'For digital painting on iPad.' },
    ],
    tips: ['Study the work of great designers.', 'Don\'t be afraid to experiment.', 'Understand the client\'s goals.'],
  },
  {
    name: 'Blockchain',
    slug: 'blockchain',
    description: 'Explore decentralized technology, cryptocurrencies, and smart contracts.',
    icon: Blocks,
    roadmap: [
        { title: 'Understand the Basics', description: 'Learn what blockchain is, how it works, and key concepts like decentralization.'},
        { title: 'Learn Solidity', description: 'Master the primary language for writing smart contracts on Ethereum.' },
        { title: 'Build a DApp', description: 'Create your first decentralized application.' },
        { title: 'Explore Different Chains', description: 'Look into other blockchains like Solana, Polygon, etc.' },
    ],
    resources: [
        { title: 'PatrickAlphaC', url: 'https://www.youtube.com/@PatrickAlphaC', type: 'YouTube' },
        { title: 'Unchained Podcast', url: 'https://unchainedpodcast.com/', type: 'Blog' },
        { title: 'CryptoZombies', url: 'https://cryptozombies.io/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Simple Voting DApp', description: 'Create a smart contract for a decentralized voting system.', difficulty: 'Beginner' },
        { title: 'NFT Minter', description: 'Build a DApp to mint and display your own NFTs.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Remix IDE', description: 'Web-based IDE for Solidity.' },
        { name: 'Hardhat / Truffle', description: 'Development environments for Ethereum.' },
        { name: 'MetaMask', description: 'A crypto wallet & gateway to blockchain apps.' },
    ],
    tips: ['Security is paramount in smart contracts.', 'Join a developer community.', 'The space moves fast; keep learning.'],
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Protect computer systems and networks from digital attacks.',
    icon: ShieldCheck,
    roadmap: [
        { title: 'IT & Networking Fundamentals', description: 'Build a strong foundation in networking, OS, and system administration.'},
        { title: 'Learn Security Concepts', description: 'Understand cryptography, access control, and risk management.' },
        { title: 'Ethical Hacking', description: 'Learn to think like an attacker to find and fix vulnerabilities.' },
        { title: 'Get Certified', description: 'Pursue certifications like CompTIA Security+ or CEH.' },
    ],
    resources: [
        { title: 'The Cyber Mentor', url: 'https://www.youtube.com/@TCMSecurityAcademy', type: 'YouTube' },
        { title: 'Krebs on Security', url: 'https://krebsonsecurity.com/', type: 'Blog' },
        { title: 'TryHackMe', url: 'https://tryhackme.com/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Set up a Secure Home Network', description: 'Configure a firewall and other security measures for your home network.', difficulty: 'Beginner' },
        { title: 'Capture The Flag (CTF)', description: 'Participate in CTF competitions to practice your skills.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Wireshark', description: 'Network protocol analyzer.' },
        { name: 'Nmap', description: 'Network scanner.' },
        { name: 'Metasploit', description: 'Penetration testing framework.' },
    ],
    tips: ['Stay curious and keep learning.', 'Develop a strong ethical code.', 'Think critically and solve problems.'],
  },
  {
    name: 'Kubernetes',
    slug: 'kubernetes',
    description: 'Master container orchestration for deploying, scaling, and managing applications.',
    icon: Box,
    roadmap: [
        { title: 'Learn Docker Fundamentals', description: 'Understand containers and the basics of Docker.' },
        { title: 'Kubernetes Core Concepts', description: 'Learn about Pods, Services, Deployments, and ReplicaSets.' },
        { title: 'Advanced Kubernetes', description: 'Explore StatefulSets, Persistent Volumes, and Helm charts.' },
        { title: 'Managed Kubernetes', description: 'Get hands-on with GKE, EKS, or AKS.' },
    ],
    resources: [
      { title: 'Kubernetes by Example', url: 'https://kubernetesbyexample.com/', type: 'Blog' },
      { title: 'TechWorld with Nana - Kubernetes', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', type: 'YouTube' },
      { title: 'Certified Kubernetes Administrator (CKA)', url: 'https://www.cncf.io/certification/cka/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Deploy a Microservices App', description: 'Deploy a multi-service application on a local Minikube cluster.', difficulty: 'Beginner' },
        { title: 'Build a CI/CD Pipeline with Helm', description: 'Automate the deployment of an application using Helm and a CI/CD tool.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'kubectl', description: 'The command-line tool for Kubernetes.' },
        { name: 'Helm', description: 'The package manager for Kubernetes.' },
        { name: 'Minikube', description: 'For running Kubernetes locally.' },
    ],
    tips: ['Understand the YAML manifests well.', 'Practice with a local cluster before moving to the cloud.', 'Follow the official Kubernetes documentation.'],
  },
  {
    name: 'Apache Kafka',
    slug: 'apache-kafka',
    description: 'Learn the distributed streaming platform for building real-time data pipelines and streaming apps.',
    icon: Waypoints,
    roadmap: [
        { title: 'Core Concepts', description: 'Understand Topics, Partitions, Producers, and Consumers.' },
        { title: 'Kafka Architecture', description: 'Learn about brokers, ZooKeeper/KRaft, and replication.' },
        { title: 'Kafka Streams & Connect', description: 'Build stream processing applications and integrate with other systems.' },
        { title: 'Advanced Topics', description: 'Explore security, monitoring, and performance tuning.' },
    ],
    resources: [
      { title: 'Official Apache Kafka Docs', url: 'https://kafka.apache.org/documentation/', type: 'Blog' },
      { title: 'Confluent Developer', url: 'https://developer.confluent.io/', type: 'Course' },
      { title: 'Stéphane Maarek - Kafka Courses on Udemy', url: 'https://www.udemy.com/user/stephane-maarek/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Real-time Chat Application', description: 'Use Kafka to message between users in real-time.', difficulty: 'Beginner' },
        { title: 'Log Aggregation System', description: 'Build a system to collect and process logs from multiple services.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Kafka CLI tools', description: 'Command-line tools for managing Kafka.' },
        { name: 'Confluent Platform', description: 'A complete event streaming platform built by the original creators of Kafka.' },
        { name: 'Kafdrop/Kadeck', description: 'Web UI for monitoring Kafka clusters.' },
    ],
    tips: ['Understand partitioning and keying strategy.', 'Start with a single broker cluster.', 'Monitor your consumer lag.'],
  },
  {
    name: 'Generative AI',
    slug: 'generative-ai',
    description: 'Create new content, from text and images to music and code, using advanced AI models.',
    icon: Sparkles,
    roadmap: [
        { title: 'Understand Foundational Models', description: 'Learn about models like GPT, DALL-E, and Stable Diffusion.' },
        { title: 'Prompt Engineering', description: 'Master the art of crafting effective prompts to guide AI models.' },
        { title: 'Fine-tuning Models', description: 'Learn to adapt pre-trained models for specific tasks with your own data.' },
        { title: 'Build with GenAI APIs', description: 'Integrate models from providers like OpenAI, Google AI, and Hugging Face into applications.' },
    ],
    resources: [
      { title: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/', type: 'Course' },
      { title: 'Hugging Face', url: 'https://huggingface.co/', type: 'Blog' },
      { title: 'Google AI', url: 'https://www.youtube.com/@GoogleAI', type: 'YouTube' },
    ],
    projectIdeas: [
        { title: 'AI Story Generator', description: 'Build an app that writes short stories based on a user prompt.', difficulty: 'Beginner' },
        { title: 'Image Generation App', description: 'Create an interface for a text-to-image model like Stable Diffusion.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Genkit', description: 'An open source framework from Google to build production-ready AI-powered apps.' },
        { name: 'Hugging Face Transformers', description: 'Provides thousands of pretrained models to perform tasks on different modalities.' },
        { name: 'LangChain', description: 'A framework for developing applications powered by language models.' },
    ],
    tips: ['Experiment with different models and prompts.', 'Stay on top of the latest research papers.', 'Consider the ethical implications of your creations.'],
  },
  {
    name: 'Large Language Models (LLMs)',
    slug: 'llms',
    description: 'Specialize in the architecture, training, and application of large language models.',
    icon: Bot,
    roadmap: [
        { title: 'NLP Fundamentals', description: 'Review basics of Natural Language Processing like tokenization and embeddings.' },
        { title: 'Transformer Architecture', description: 'Deeply understand the "Attention Is All You Need" paper and the Transformer architecture.' },
        { title: 'Model Training & Scaling', description: 'Learn about the challenges of training massive models and distributed computing.' },
        { title: 'Retrieval-Augmented Generation (RAG)', description: 'Understand how to combine LLMs with external knowledge bases.' },
    ],
    resources: [
      { title: 'The Illustrated Transformer', url: 'http://jalammar.github.io/illustrated-transformer/', type: 'Blog' },
      { title: 'Andrej Karpathy - Neural Networks: Zero to Hero', url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ', type: 'YouTube' },
      { title: 'Stanford CS224N', url: 'http://web.stanford.edu/class/cs224n/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Text Summarizer', description: 'Fine-tune a smaller LLM for summarizing long articles.', difficulty: 'Beginner' },
        { title: 'Q&A Bot for Documentation', description: 'Build a RAG system that answers questions about a specific codebase or documentation.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'PyTorch / TensorFlow', description: 'Core deep learning frameworks.' },
        { name: 'Vector Databases (Pinecone, Chroma)', description: 'For storing and retrieving embeddings in RAG systems.' },
        { name: 'Weights & Biases', description: 'For experiment tracking during model training.' },
    ],
    tips: ['Read research papers daily.', 'Start with smaller, open-source models before trying to build your own from scratch.', 'Understanding the data is as important as understanding the model architecture.'],
  },
  {
    name: 'Game Development',
    slug: 'game-development',
    description: 'Create interactive worlds and experiences. Learn game engines, programming, and design principles.',
    icon: Gamepad2,
    roadmap: [
        { title: 'Choose a Game Engine', description: 'Start with a popular engine like Unity or Unreal Engine.' },
        { title: 'Learn C# or C++', description: 'Master the primary language for your chosen engine (C# for Unity, C++ for Unreal).' },
        { title: 'Game Design Basics', description: 'Understand core concepts like game loops, physics, and player input.' },
        { title: 'Asset Creation', description: 'Learn the basics of creating or sourcing 2D/3D models, textures, and sounds.' },
    ],
    resources: [
        { title: 'Brackeys', url: 'https://www.youtube.com/@Brackeys', type: 'YouTube' },
        { title: 'Game Developer', url: 'https://www.gamedeveloper.com/', type: 'Blog' },
        { title: 'GameDev.tv on Udemy', url: 'https://www.udemy.com/user/gamedev-tv/', type: 'Course' },
    ],
    projectIdeas: [
        { title: '2D Platformer', description: 'Create a classic side-scrolling game with a player character, enemies, and collectables.', difficulty: 'Beginner' },
        { title: 'First-Person Puzzle Game', description: 'Build a 3D game focused on solving environmental puzzles.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Unity', description: 'A versatile game engine for 2D, 3D, and VR/AR games.' },
        { name: 'Unreal Engine', description: 'A powerful engine known for high-fidelity graphics.' },
        { name: 'Blender', description: 'Free and open-source 3D creation suite.' },
    ],
    tips: ['Start small and finish your projects.', 'Focus on the core gameplay loop first.', 'Join game jams to build skills quickly.'],
  },
  {
    name: 'Data Engineering',
    slug: 'data-engineering',
    description: 'Build and maintain the systems that allow for large-scale data collection, storage, and analysis.',
    icon: DatabaseZap,
    roadmap: [
        { title: 'Master Python & SQL', description: 'These are the foundational languages for data engineering.' },
        { title: 'Learn Data Warehousing', description: 'Understand concepts like star schemas and data lakes (e.g., BigQuery, Snowflake).' },
        { title: 'ETL/ELT Pipelines', description: 'Learn to build pipelines using tools like Apache Airflow.' },
        { title: 'Big Data Technologies', description: 'Get familiar with distributed systems like Apache Spark.' },
    ],
    resources: [
      { title: 'SeattleDataGuy', url: 'https://www.youtube.com/@SeattleDataGuy', type: 'YouTube' },
      { title: 'The Data Engineering Podcast', url: 'https://www.dataengineeringpodcast.com/', type: 'Blog' },
      { title: 'DataCamp', url: 'https://www.datacamp.com/tracks/data-engineer-with-python', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Automated Data Scraper', description: 'Build a pipeline that scrapes data from a website daily and stores it in a database.', difficulty: 'Beginner' },
        { title: 'Batch Processing with Spark', description: 'Set up a Spark job to process large CSV files and generate an aggregated report.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Apache Airflow', description: 'A platform to programmatically author, schedule, and monitor workflows.' },
        { name: 'Apache Spark', description: 'A unified analytics engine for large-scale data processing.' },
        { name: 'dbt (data build tool)', description: 'A transformation workflow that lets teams quickly and collaboratively deploy analytics code.' },
    ],
    tips: ['Understand data modeling concepts.', 'Think about data quality and reliability.', 'Learn cloud platform data services.'],
  },
  {
    name: 'AR/VR Development',
    slug: 'ar-vr-development',
    description: 'Build immersive and interactive experiences for augmented and virtual reality devices.',
    icon: View,
    roadmap: [
        { title: 'Learn a Game Engine', description: 'Unity and Unreal Engine are the most common choices for AR/VR.' },
        { title: 'Understand 3D Math', description: 'Get comfortable with vectors, matrices, and quaternions for 3D space.' },
        { title: 'Choose a Target Platform', description: 'Focus on a specific headset or SDK like Meta Quest, Apple VisionOS, or ARCore.' },
        { title: 'Interaction Design for XR', description: 'Learn how to design intuitive user interactions in 3D space.' },
    ],
    resources: [
        { title: 'Valem', url: 'https://www.youtube.com/@ValemVR', type: 'YouTube' },
        { title: 'Road to VR', url: 'https://www.roadtovr.com/', type: 'Blog' },
        { title: 'Unity VR Development Pathway', url: 'https://learn.unity.com/pathway/vr-development', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Simple AR Business Card', description: 'Create an app that shows a 3D model when pointing the camera at a business card.', difficulty: 'Beginner' },
        { title: 'VR Escape Room', description: 'Design a single room where the player has to find clues and solve puzzles to escape.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Unity with AR Foundation / OpenXR', description: 'Engine and frameworks for building cross-platform AR/VR apps.' },
        { name: 'Unreal Engine', description: 'Powerful engine for high-fidelity VR experiences.' },
        { name: 'Meta Quest SDK', description: 'Tools and libraries for developing for Meta Quest headsets.' },
    ],
    tips: ['Prioritize performance to avoid motion sickness.', 'Design for comfort.', 'Test on your target hardware frequently.'],
  },
  {
    name: 'Internet of Things (IoT)',
    slug: 'internet-of-things',
    description: 'Connect the physical world to the internet by building smart devices and networks.',
    icon: Cpu,
    roadmap: [
        { title: 'Learn Basic Electronics', description: 'Understand circuits, sensors, and microcontrollers.' },
        { title: 'Choose a Microcontroller', description: 'Start with Arduino for simplicity or Raspberry Pi for more power.' },
        { title: 'Learn C/C++ or Python', description: 'Learn the language for your chosen hardware (C/C++ for Arduino, Python for Raspberry Pi).' },
        { title: 'Networking Protocols', description: 'Understand MQTT, CoAP, and HTTP for device communication.' },
    ],
    resources: [
        { title: 'GreatScott!', url: 'https://www.youtube.com/@greatscottlab', type: 'YouTube' },
        { title: 'Hackaday', url: 'https://hackaday.com/', type: 'Blog' },
        { title: 'Arduino Documentation', url: 'https://docs.arduino.cc/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Smart Plant Watering System', description: 'Use a soil moisture sensor to automatically water a plant.', difficulty: 'Beginner' },
        { title: 'Home Weather Station', description: 'Build a device that collects temperature/humidity data and sends it to a web server.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Arduino IDE', description: 'Software to write and upload code to Arduino boards.' },
        { name: 'PlatformIO', description: 'A professional IDE for IoT development.' },
        { name: 'MQTT Broker (e.g., Mosquitto)', description: 'For publish/subscribe messaging between devices.' },
    ],
    tips: ['Start with a pre-made kit to ease into hardware.', 'Learn how to read datasheets for components.', 'Power management is a key challenge in many IoT projects.'],
  },
  {
    name: 'Quality Assurance (QA)',
    slug: 'quality-assurance',
    description: 'Ensure software quality through manual and automated testing strategies.',
    icon: ClipboardCheck,
    roadmap: [
        { title: 'Learn Testing Fundamentals', description: 'Understand different types of testing (unit, integration, E2E, etc.) and the STLC.' },
        { title: 'Manual Testing Practice', description: 'Learn how to write test cases, report bugs, and perform exploratory testing.' },
        { title: 'Learn a Programming Language', description: 'Python or JavaScript are great choices for automation.' },
        { title: 'Master an Automation Framework', description: 'Learn Selenium for web browsers, or Cypress/Playwright for modern web apps.' },
    ],
    resources: [
        { title: 'The Testing Academy', url: 'https://www.youtube.com/@TheTestingAcademy', type: 'YouTube' },
        { title: 'Ministry of Testing', url: 'https://www.ministryoftesting.com/', type: 'Blog' },
        { title: 'Test Automation University', url: 'https://testautomationu.applitools.com/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Write Test Cases for an App', description: 'Choose a simple application and write a comprehensive suite of manual test cases for it.', difficulty: 'Beginner' },
        { title: 'Automate a Login Flow', description: 'Use Cypress or Selenium to write an automated test for the login functionality of a website.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Cypress', description: 'A fast, easy, and reliable testing framework for anything that runs in a browser.' },
        { name: 'Selenium', description: 'A popular open-source framework for automating web browsers.' },
        { name: 'Jira / Xray', description: 'For bug tracking and test case management.' },
    ],
    tips: ['Develop a mindset for breaking things.', 'Communication skills are as important as technical skills.', 'Automation is a tool, not a replacement for good testing.'],
  },
  {
    name: 'Product Management',
    slug: 'product-management',
    description: 'Guide the success of a product and lead the cross-functional team that is responsible for improving it.',
    icon: GanttChartSquare,
    roadmap: [
        { title: 'Understand the Product Lifecycle', description: 'Learn the stages from ideation and development to launch and iteration.' },
        { title: 'User Research & Validation', description: 'Master techniques for understanding user needs and validating ideas.' },
        { title: 'Prioritization Frameworks', description: 'Learn methods like RICE or MoSCoW to decide what to build next.' },
        { title: 'Agile & Scrum Methodologies', description: 'Understand how development teams work to deliver value iteratively.' },
    ],
    resources: [
        { title: 'Product School', url: 'https://www.youtube.com/@ProductSchool', type: 'YouTube' },
        { title: 'SVPG Insights Blog', url: 'https://www.svpg.com/articles/', type: 'Blog' },
        { title: 'Reforge', url: 'https://www.reforge.com/', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Feature Proposal for an Existing App', description: 'Identify a user problem in a popular app and write a detailed Product Requirements Document (PRD) for a new feature.', difficulty: 'Beginner' },
        { title: 'Develop a Product Roadmap', description: 'Create a 6-month roadmap for a fictional product, including key initiatives and metrics.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Jira', description: 'For tracking development work and managing backlogs.' },
        { name: 'Aha! / Productboard', description: 'For roadmap planning and idea management.' },
        { name: 'Figma / Miro', description: 'For wireframing, brainstorming, and collaborative workshops.' },
    ],
    tips: ['Be ruthlessly data-informed, but not data-led.', 'Master the art of saying "no".', 'Develop deep empathy for your users and your team.'],
  },
  {
    name: 'Data Analytics',
    slug: 'data-analytics',
    description: 'Turn raw data into actionable insights using statistical analysis and data visualization.',
    icon: BarChart,
    roadmap: [
        { title: 'Master Excel & SQL', description: 'Learn the essential tools for data manipulation and querying.' },
        { title: 'Learn a BI Tool', description: 'Become proficient in Tableau, Power BI, or Looker Studio.' },
        { title: 'Statistical Foundations', description: 'Understand key concepts like A/B testing, regression, and statistical significance.' },
        { title: 'Python or R for Analysis', description: 'Learn libraries like Pandas and Matplotlib/Seaborn for more advanced analysis.' },
    ],
    resources: [
        { title: 'Alex The Analyst', url: 'https://www.youtube.com/@AlexTheAnalyst', type: 'YouTube' },
        { title: 'Storytelling with Data', url: 'https://www.storytellingwithdata.com/blog', type: 'Blog' },
        { title: 'Google Data Analytics Professional Certificate', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Analyze a Public Dataset', description: 'Download a dataset from Kaggle and create a dashboard in a BI tool to present your findings.', difficulty: 'Beginner' },
        { title: 'Sales Dashboard', description: 'Build an interactive dashboard to track sales KPIs like revenue, units sold, and customer growth.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Tableau / Power BI', description: 'Leading business intelligence and data visualization tools.' },
        { name: 'SQL', description: 'The standard language for relational database management systems.' },
        { name: 'Python (Pandas, Matplotlib)', description: 'For data cleaning, analysis, and visualization.' },
    ],
    tips: ['The goal is insight, not just charts.', 'Understand the business context behind the data.', 'Communication and storytelling are crucial skills.'],
  },
  {
    name: 'Technical Writing',
    slug: 'technical-writing',
    description: 'Create clear, concise, and accurate documentation for technical products and services.',
    icon: FileText,
    roadmap: [
        { title: 'Learn the Principles of Tech Writing', description: 'Focus on clarity, accuracy, conciseness, and audience awareness.' },
        { title: 'Docs-as-Code', description: 'Learn to use Markdown, Git, and static site generators like Docusaurus or MkDocs.' },
        { title: 'API Documentation', description: 'Understand how to document REST or GraphQL APIs using standards like OpenAPI.' },
        { title: 'Build a Portfolio', description: 'Create writing samples to showcase your skills to potential employers.' },
    ],
    resources: [
        { title: 'Write the Docs', url: 'https://www.youtube.com/@WritetheDocs', type: 'YouTube' },
        { title: 'I\'d Rather Be Writing', url: 'https://idratherbewriting.com/', type: 'Blog' },
        { title: 'Google Technical Writing Courses', url: 'https://developers.google.com/tech-writing', type: 'Course' },
    ],
    projectIdeas: [
        { title: 'Document an Open Source Project', description: 'Find a small open-source project with poor documentation and write a getting-started guide for it.', difficulty: 'Beginner' },
        { title: 'Create API Reference Docs', description: 'Write comprehensive API documentation for a public API, including endpoints, parameters, and example responses.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Markdown', description: 'A lightweight markup language for creating formatted text.' },
        { name: 'Static Site Generators', description: 'Tools like Docusaurus, Hugo, or MkDocs for building documentation websites.' },
        { name: 'Postman / Insomnia', description: 'For testing APIs and understanding their behavior.' },
    ],
    tips: ['Treat your documentation as a product.', 'Be an advocate for the user experience.', 'Get comfortable reading code, even if you don\'t write it.'],
  },
  {
    name: 'Linux',
    slug: 'linux',
    description: 'Master the open-source operating system that powers a vast majority of the world\'s servers and devices.',
    icon: Terminal,
    roadmap: [
        { title: 'Learn the Command Line (CLI)', description: 'Understand how to navigate and manage the system using terminal commands.'},
        { title: 'File Systems and Permissions', description: 'Learn how files are organized and how to manage user access.' },
        { title: 'Shell Scripting with Bash', description: 'Automate repetitive tasks by writing your own scripts.' },
        { title: 'System Administration Basics', description: 'Explore user management, package installation, and service configuration.' },
    ],
    resources: [
      { title: 'Linux Journey', url: 'https://linuxjourney.com/', type: 'Course' },
      { title: 'The Linux Command Line (Book)', url: 'http://linuxcommand.org/tlcl.php', type: 'Blog' },
      { title: 'CS Dojo', url: 'https://www.youtube.com/@CSDojo', type: 'YouTube' },
    ],
    projectIdeas: [
        { title: 'Set up a LAMP/LEMP Stack', description: 'Configure a web server from scratch on a Linux machine to host a website.', difficulty: 'Beginner' },
        { title: 'Automated Backup Script', description: 'Write a Bash script that automatically backs up important files to another directory or drive.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Bash / Zsh', description: 'Powerful command-line shells.' },
        { name: 'Vim / Nano', description: 'Terminal-based text editors for configuration files and scripting.' },
        { name: 'grep, awk, sed', description: 'Essential text-processing utilities for the command line.' },
    ],
    tips: ['Live in the terminal to build muscle memory.', 'Use `man` pages (e.g., `man ls`) to learn about any command.', 'Use a virtual machine to experiment without fear of breaking your main OS.'],
  },
  {
    name: 'AWS',
    slug: 'aws',
    description: 'Explore Amazon Web Services, the world\'s most comprehensive and broadly adopted cloud platform.',
    icon: Cloud,
    roadmap: [
        { title: 'Core Services', description: 'Learn about EC2 (virtual servers), S3 (storage), and VPC (networking).' },
        { title: 'Databases', description: 'Explore RDS for relational databases and DynamoDB for NoSQL.' },
        { title: 'Serverless Computing', description: 'Understand AWS Lambda for running code without provisioning servers and API Gateway.' },
        { title: 'Get Certified', description: 'Start with the AWS Certified Cloud Practitioner certification to validate your knowledge.' },
    ],
    resources: [
      { title: 'AWS Free Tier', url: 'https://aws.amazon.com/free/', type: 'Official Docs' },
      { title: 'Adrian Cantrill\'s Courses', url: 'https://learn.cantrill.io/', type: 'Course' },
      { title: 'freeCodeCamp - AWS Practitioner Course', url: 'https://www.youtube.com/watch?v=JIbIYCM48to', type: 'YouTube' },
    ],
    projectIdeas: [
        { title: 'Host a Static Website on S3', description: 'Configure an S3 bucket to serve a static HTML/CSS/JS website.', difficulty: 'Beginner' },
        { title: 'Build a Serverless API', description: 'Create a simple API using Lambda and API Gateway that can be called from a web app.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'AWS Management Console', description: 'The web-based user interface for managing AWS services.' },
        { name: 'AWS CLI', description: 'A command-line tool for interacting with AWS services.' },
        { name: 'AWS SDKs', description: 'Language-specific APIs for calling AWS services from your applications.' },
    ],
    tips: ['Understand the pricing models to avoid surprise bills.', 'Use IAM (Identity and Access Management) to securely control access to resources.', 'Tag all of your resources for better organization and cost tracking.'],
  },
  {
    name: 'Microsoft Azure',
    slug: 'azure',
    description: 'Leverage Microsoft\'s cloud computing service for building, testing, deploying, and managing applications.',
    icon: Cloud,
    roadmap: [
        { title: 'Core Services', description: 'Learn about Virtual Machines, Blob Storage, and Virtual Networks.' },
        { title: 'Databases', description: 'Explore Azure SQL Database and Cosmos DB for your data needs.' },
        { title: 'Serverless Computing', description: 'Learn Azure Functions for event-driven serverless architecture.' },
        { title: 'Get Certified', description: 'Start with the Azure Fundamentals (AZ-900) certification.' },
    ],
    resources: [
      { title: 'Microsoft Learn for Azure', url: 'https://learn.microsoft.com/en-us/azure/', type: 'Course' },
      { title: 'Azure Free Account', url: 'https://azure.microsoft.com/en-us/free/', type: 'Official Docs' },
      { title: 'John Savill\'s Technical Training', url: 'https://www.youtube.com/@NTFAQGuy', type: 'YouTube' },
    ],
    projectIdeas: [
        { title: 'Deploy a Web App to Azure App Service', description: 'Deploy a simple web application directly from your code repository.', difficulty: 'Beginner' },
        { title: 'Create a Serverless Function', description: 'Build an Azure Function that is triggered by an HTTP request or a message queue.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Azure Portal', description: 'The web-based UI for managing Azure resources.' },
        { name: 'Azure CLI', description: 'Cross-platform command-line tool for managing Azure resources.' },
        { name: 'Azure PowerShell', description: 'A set of cmdlets for managing Azure resources directly from PowerShell.' },
    ],
    tips: ['Use Resource Groups to organize and manage the lifecycle of your application assets.', 'Understand Azure Active Directory for robust identity and access management.', 'Take advantage of the free services to experiment.'],
  },
  {
    name: 'Google Cloud Platform',
    slug: 'gcp',
    description: 'Utilize Google\'s suite of cloud computing services that runs on the same infrastructure as its own products.',
    icon: Cloud,
    roadmap: [
        { title: 'Core Services', description: 'Learn about Compute Engine (VMs), Cloud Storage, and VPC networks.' },
        { title: 'Data & Analytics', description: 'Explore the power of BigQuery for analytics and Cloud SQL for managed databases.' },
        { title: 'Modern App Deployment', description: 'Understand Cloud Run for deploying containerized applications easily.' },
        { title: 'Get Certified', description: 'Start with the Cloud Digital Leader or Associate Cloud Engineer certification.' },
    ],
    resources: [
      { title: 'Google Cloud Skills Boost (Qwiklabs)', url: 'https://www.cloudskillsboost.google/', type: 'Course' },
      { title: 'Google Cloud Free Tier', url: 'https://cloud.google.com/free', type: 'Official Docs' },
      { title: 'Google Cloud Tech on YouTube', url: 'https://www.youtube.com/@GoogleCloudTech', type: 'YouTube' },
    ],
    projectIdeas: [
        { title: 'Deploy a Container to Cloud Run', description: 'Package an application in a Docker container and deploy it to the fully managed Cloud Run service.', difficulty: 'Beginner' },
        { title: 'Analyze a Large Public Dataset with BigQuery', description: 'Use BigQuery to run SQL queries against one of the many available public datasets.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Google Cloud Console', description: 'The web-based UI for managing GCP projects and resources.' },
        { name: 'gcloud CLI', description: 'The primary command-line tool for Google Cloud.' },
        { name: 'Cloud Shell', description: 'An interactive shell environment for Google Cloud with the gcloud CLI pre-installed.' },
    ],
    tips: ['Organize all of your resources under Projects.', 'Master IAM roles to follow the principle of least privilege.', 'Leverage Cloud Shell for quick command-line access without local setup.'],
  },
  {
    name: 'Data Structures & Algorithms',
    slug: 'data-structures-algorithms',
    description: 'Understand the fundamental building blocks of efficient software and problem-solving.',
    icon: Component,
    roadmap: [
        { title: 'Learn Big O Notation', description: 'Analyze the time and space complexity of algorithms.' },
        { title: 'Master Core Structures', description: 'Implement and understand Arrays, Linked Lists, Stacks, and Queues.' },
        { title: 'Advanced Structures', description: 'Explore Trees, Heaps, Hash Tables, and Graphs.' },
        { title: 'Key Algorithm Paradigms', description: 'Learn searching, sorting, recursion, and dynamic programming.' },
    ],
    resources: [
      { title: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/data-structures/', type: 'Blog' },
      { title: 'LeetCode', url: 'https://leetcode.com/explore/', type: 'Course' },
      { title: 'Introduction to Algorithms (CLRS)', url: 'https://mitpress.mit.edu/books/introduction-algorithms', type: 'Blog' },
      { title: 'CS Dojo on YouTube', url: 'https://www.youtube.com/@CSDojo', type: 'YouTube' },
    ],
    projectIdeas: [
        { title: 'Implement a Pathfinding Visualizer', description: 'Create a visual tool for algorithms like A* or Dijkstra\'s on a grid.', difficulty: 'Intermediate' },
        { title: 'Build a File Compressor', description: 'Use Huffman coding to compress and decompress text files.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'A Whiteboard', description: 'Essential for visualizing problems and solutions.' },
        { name: 'An IDE with a Debugger', description: 'Step through your code to understand how it works.' },
        { name: 'Online Judges (LeetCode, HackerRank)', description: 'Platforms for practicing coding problems.' },
    ],
    tips: ['Draw out the data structures.', 'Practice consistently, even just one problem a day.', 'Explain a concept to someone else to solidify your understanding.'],
  },
  {
    name: 'AI Automations',
    slug: 'ai-automations',
    description: 'Build intelligent agents and automated workflows powered by AI models.',
    icon: Workflow,
    roadmap: [
      { title: 'Understand AI Agents', description: 'Learn the core concepts of autonomous agents and how they differ from simple models.' },
      { title: 'Master an AI Framework', description: 'Get hands-on with a framework like Genkit or LangChain to build agents.' },
      { title: 'Tool Use and Function Calling', description: 'Teach your agents to use external tools and APIs to perform actions.' },
      { title: 'Planning and Reasoning', description: 'Explore advanced concepts like ReAct (Reason+Act) for complex multi-step tasks.' },
    ],
    resources: [
      { title: 'Genkit Documentation', url: 'https://firebase.google.com/docs/genkit', type: 'Official Docs' },
      { title: 'LangChain Docs', url: 'https://js.langchain.com/docs/get_started/introduction', type: 'Official Docs' },
      { title: 'What are AI Agents?', url: 'https://youtu.be/2GZ2SNXWK-c?si=NTeJUClYUjTK0nDk', type: 'YouTube' },
    ],
    projectIdeas: [
        { title: 'Customer Support Email Responder', description: 'Build an agent that can read incoming support emails, categorize them, and draft a response.', difficulty: 'Beginner' },
        { title: 'Automated Research Assistant', description: 'Create an agent that can browse the web to gather information on a given topic and summarize its findings.', difficulty: 'Intermediate' },
    ],
    tools: [
        { name: 'Genkit', description: 'An open source framework from Google to build production-ready AI-powered apps.' },
        { name: 'LangChain', description: 'A framework for developing applications powered by language models and agents.' },
        { name: 'Vector Databases', description: 'For giving agents long-term memory or knowledge bases.' },
    ],
    tips: ['Clearly define the agent\'s goal and the tools it can use.', 'Start simple and add complexity iteratively.', 'Implement robust error handling and logging.'],
  },
];
