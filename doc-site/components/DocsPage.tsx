
import React, { useState, useEffect, useRef } from 'react';
import {
    SunIcon,
    MoonIcon,
    ClipboardIcon,
    ClipboardCheckIcon,
    BookOpenIcon,
    RocketLaunchIcon,
    DatabaseIcon,
    BoltIcon,
    ShieldIcon,
    ArchiveBoxIcon,
    CogIcon,
    ChartBarIcon,
    UsersIcon,
    CpuChipIcon,
    LinkIcon,
    AcademicCapIcon,
    MagnifyingGlassIcon
} from './Icons';
import CodeWindow from './CodeWindow';
import { introductionMarkdown } from './docs/introduction';
import { gettingStartedMarkdown } from './docs/getting-started';
import { contextAndDataMarkdown } from './docs/context-and-data';
import { resourceManagementMarkdown } from './docs/resource-management';
import { errorHandlingMarkdown } from './docs/error-handling';
import { checkpointingMarkdown } from './docs/checkpointing';
import { ragRecipeMarkdown } from './docs/rag-recipe';
import { reliabilityMarkdown } from './docs/reliability';
import { observabilityMarkdown } from './docs/observability';
import { coordinationMarkdown } from './docs/coordination';
import { multiagentMarkdown } from './docs/multiagent';
import { resourcesMarkdown } from './docs/resources';
import { troubleshootingMarkdown } from './docs/troubleshooting';
import { apiReferenceMarkdown } from './docs/api-reference';
import { deploymentMarkdown } from './docs/deployment';

const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code className="font-mono text-sm">{children}</code>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<div class="code-block"><pre><code>$2</code></pre></div>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^\| (.+) \|$/gm, (match, content) => {
            const cells = content.split('|').map(cell => cell.trim());
            return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
        })
        .replace(/^\|[-\s\|]+\|$/gm, '') // Remove table separator lines
        .replace(/(<tr>.*<\/tr>)/gs, '<table class="docs-table-wrapper"><tbody>$1</tbody></table>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    return <div dangerouslySetInnerHTML={{ __html: `<p>${htmlContent}</p>` }} />;
};

interface DocsLayoutProps {
    children: React.ReactNode;
    sidebarLinks: { id: string; label: string }[];
    pageMarkdown: string;
    currentPage: 'introduction' | 'getting-started' | 'context-and-data' | 'resource-management' | 'error-handling' | 'checkpointing' | 'rag-recipe' | 'reliability' | 'observability' | 'coordination' | 'multiagent' | 'resources' | 'troubleshooting' | 'api-reference' | 'deployment';
    pageKey: 'docs' | 'docs/getting-started' | 'docs/context-and-data' | 'docs/resource-management' | 'docs/error-handling' | 'docs/checkpointing' | 'docs/rag-recipe' | 'docs/reliability' | 'docs/observability' | 'docs/coordination' | 'docs/multiagent' | 'docs/resources' | 'docs/troubleshooting' | 'docs/api-reference' | 'docs/deployment';
}

const DocsLayout: React.FC<DocsLayoutProps> = ({ children, sidebarLinks, pageMarkdown, currentPage, pageKey }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [activeSection, setActiveSection] = useState(sidebarLinks[0]?.id || '');
    const [copyText, setCopyText] = useState('Copy as Markdown');
    const articleRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('puffin-docs-theme') as 'light' | 'dark';
        const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        document.body.classList.add('docs-view');
        if (theme === 'light') {
            document.body.classList.add('docs-view-light');
            document.body.classList.remove('docs-view-dark');
        } else {
            document.body.classList.add('docs-view-dark');
            document.body.classList.remove('docs-view-light');
        }
        localStorage.setItem('puffin-docs-theme', theme);

        return () => {
            document.body.classList.remove('docs-view', 'docs-view-light', 'docs-view-dark');
        };
    }, [theme]);

    useEffect(() => {
        if (!articleRef.current) return;
        const sections = Array.from(articleRef.current.querySelectorAll('section[id]'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: `-80px 0px -70% 0px` }
        );

        sections.forEach((section) => observer.observe(section));
        return () => sections.forEach((section) => observer.unobserve(section));
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(pageMarkdown).then(() => {
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy as Markdown'), 2000);
        });
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault();
        window.location.hash = hash;
    };

    const docsNavLinks = [
        { href: '#docs', label: 'Introduction', page: 'introduction', icon: BookOpenIcon },
        { href: '#docs/getting-started', label: 'Getting Started', page: 'getting-started', icon: RocketLaunchIcon },
        { href: '#docs/context-and-data', label: 'Context and Data', page: 'context-and-data', icon: DatabaseIcon },
        { href: '#docs/resource-management', label: 'Resource Management', page: 'resource-management', icon: BoltIcon },
        { href: '#docs/error-handling', label: 'Error Handling', page: 'error-handling', icon: ShieldIcon },
        { href: '#docs/checkpointing', label: 'Checkpointing', page: 'checkpointing', icon: ArchiveBoxIcon },
        { href: '#docs/reliability', label: 'Reliability', page: 'reliability', icon: CogIcon },
        { href: '#docs/observability', label: 'Observability', page: 'observability', icon: ChartBarIcon },
        { href: '#docs/coordination', label: 'Coordination', page: 'coordination', icon: LinkIcon },
        { href: '#docs/multiagent', label: 'Multi-Agent', page: 'multiagent', icon: UsersIcon },
        { href: '#docs/resources', label: 'Resources', page: 'resources', icon: AcademicCapIcon },
        { href: '#docs/troubleshooting', label: 'Troubleshooting', page: 'troubleshooting', icon: MagnifyingGlassIcon },
        { href: '#docs/api-reference', label: 'API Reference', page: 'api-reference', icon: BookOpenIcon }
    ];

    const recipesNavLinks = [
        { href: '#docs/rag-recipe', label: 'Production RAG', page: 'rag-recipe', icon: MagnifyingGlassIcon },
    ];

    return (
        <div className="container mx-auto px-6 py-16 md:py-24">
            <div className="lg:flex lg:gap-16">
                <aside className="lg:w-64 flex-shrink-0 mb-12 lg:mb-0">
                    <nav className="sticky top-28 docs-sidebar">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Documentation</h3>
                        <ul className="space-y-2 mb-4">
                            {docsNavLinks.map(link => {
                                const IconComponent = link.icon;
                                return (
                                    <li key={link.page}>
                                        <a
                                            href={link.href}
                                            onClick={(e) => handleNavClick(e, link.href)}
                                            className={`flex items-center gap-2 transition-colors duration-200 text-base font-medium ${currentPage === link.page ? 'active' : ''}`}
                                        >
                                            <IconComponent className="h-4 w-4 flex-shrink-0" />
                                            {link.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Recipes</h3>
                        <ul className="space-y-2 mb-8 border-b dark:border-white/10 pb-6">
                             {recipesNavLinks.map(link => {
                                const IconComponent = link.icon;
                                return (
                                    <li key={link.page}>
                                        <a
                                            href={link.href}
                                            onClick={(e) => handleNavClick(e, link.href)}
                                            className={`flex items-center gap-2 transition-colors duration-200 text-base font-medium ${currentPage === link.page ? 'active' : ''}`}
                                        >
                                            <IconComponent className="h-4 w-4 flex-shrink-0" />
                                            {link.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">On this page</h3>
                        <ul className="space-y-2">
                            {sidebarLinks.map(link => (
                                <li key={link.id}>
                                    <a
                                        href={`#${pageKey}#${link.id}`}
                                        onClick={(e) => handleNavClick(e, `#${pageKey}#${link.id}`)}
                                        className={`block transition-colors duration-200 font-medium ${activeSection === link.id ? 'active' : ''}`}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                <div className="w-full min-w-0">
                    <div className="flex justify-end items-center gap-4 mb-8 pb-4 border-b dark:border-white/10">
                        <button onClick={handleCopy} className="docs-control-button text-sm gap-2 px-3">
                            {copyText === 'Copied!' ? (
                                <ClipboardCheckIcon className="h-5 w-5 text-green-500" />
                            ) : (
                                <ClipboardIcon className="h-5 w-5" />
                            )}
                            {copyText}
                        </button>
                        <button onClick={toggleTheme} aria-label="Toggle theme" className="docs-control-button">
                            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                        </button>
                    </div>

                    <article ref={articleRef} className="prose-puffin w-full max-w-none">
                        {children}
                    </article>
                </div>
            </div>
        </div>
    );
};

export const DocsPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'introduction', label: 'Introduction' },
        { id: 'what-is-puffinflow', label: 'What is Puffinflow?' },
        { id: 'why-another-tool', label: 'Why Another Tool?' },
        { id: 'when-to-choose', label: 'When to Choose' },
        { id: 'documentation-sections', label: 'Documentation Sections' },
    ];


    return (
        <DocsLayout sidebarLinks={sidebarLinks} pageMarkdown={introductionMarkdown} currentPage="introduction" pageKey="docs">
            <MarkdownRenderer content={introductionMarkdown} />
        </DocsLayout>
    );
};

export const GettingStartedPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'installation', label: 'Installation' },
        { id: 'first-workflow', label: 'Your First Workflow' },
        { id: 'defining-states', label: 'Two Ways to Define States' },
        { id: 'sharing-data', label: 'Sharing Data' },
        { id: 'flow-control', label: 'Three Ways to Control Flow' },
        { id: 'complete-example', label: 'Complete Example' },
        { id: 'when-to-use-decorator', label: 'When to Use the Decorator' },
        { id: 'quick-reference', label: 'Quick Reference' },
    ];

    return (
        <DocsLayout sidebarLinks={sidebarLinks} pageMarkdown={gettingStartedMarkdown} currentPage="getting-started" pageKey="docs/getting-started">
            <MarkdownRenderer content={gettingStartedMarkdown} />
        </DocsLayout>
    );
};

export const ContextAndDataPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'quick-overview', label: 'Quick Overview' },
        { id: 'general-variables', label: 'General Variables' },
        { id: 'type-safe-variables', label: 'Type-Safe Variables' },
        { id: 'validated-data', label: 'Validated Data (Pydantic)' },
        { id: 'constants', label: 'Constants' },
        { id: 'secrets', label: 'Secrets Management' },
        { id: 'cached-data', label: 'Cached Data (TTL)' },
        { id: 'per-state-data', label: 'Per-State Data' },
        { id: 'output-data', label: 'Output Data' },
        { id: 'complete-example', label: 'Complete Example' },
        { id: 'best-practices', label: 'Best Practices' },
    ];


    return (
        <DocsLayout
            sidebarLinks={sidebarLinks}
            pageMarkdown={contextAndDataMarkdown}
            currentPage="context-and-data"
            pageKey="docs/context-and-data"
        >
            <MarkdownRenderer content={contextAndDataMarkdown} />
        </DocsLayout>
    );
};

export const ResourceManagementPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'understanding', label: 'Understanding' },
        { id: 'thinking-about-needs', label: 'Thinking About Needs' },
        { id: 'config-guide', label: 'Configuration Guide' },
        { id: 'common-patterns', label: 'Common Patterns' },
        { id: 'advanced-coordination', label: 'Advanced Coordination' },
        { id: 'quota-management', label: 'Quota Management' },
        { id: 'best-practices', label: 'Best Practices' },
        { id: 'when-to-use', label: 'When to Use' },
        { id: 'quick-reference', label: 'Quick Reference' },
    ];

    return (
        <DocsLayout
            sidebarLinks={sidebarLinks}
            pageMarkdown={resourceManagementMarkdown}
            currentPage="resource-management"
            pageKey="docs/resource-management"
        >
            <MarkdownRenderer content={resourceManagementMarkdown} />
        </DocsLayout>
    );
};


export const ErrorHandlingPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'understanding-needs', label: 'Understanding Needs' },
        { id: 'basic-retry', label: 'Basic Retry' },
        { id: 'custom-retry', label: 'Custom Retry Policies' },
        { id: 'timeout-config', label: 'Timeout Configuration' },
        { id: 'priority-handling', label: 'Priority-Based Handling' },
        { id: 'circuit-breaker', label: 'Circuit Breaker Pattern' },
        { id: 'bulkhead-isolation', label: 'Bulkhead Isolation' },
        { id: 'dlq-handling', label: 'Dead Letter Queues' },
        { id: 'comprehensive-patterns', label: 'Comprehensive Patterns' },
        { id: 'decision-framework', label: 'Decision Framework' },
        { id: 'monitoring', label: 'Monitoring' },
        { id: 'best-practices-summary', label: 'Best Practices' },
        { id: 'quick-reference', label: 'Quick Reference' },
    ];


    return (
        <DocsLayout sidebarLinks={sidebarLinks} pageMarkdown={errorHandlingMarkdown} currentPage="error-handling" pageKey="docs/error-handling">
            <MarkdownRenderer content={errorHandlingMarkdown} />
        </DocsLayout>
    );
};

export const CheckpointingPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'why-use-checkpoints', label: 'Why Use Checkpoints?' },
        { id: 'overview', label: 'Overview' },
        { id: 'quick-start', label: 'Quick Start' },
        { id: 'basic-checkpoint-usage', label: 'Basic Checkpoint Usage' },
        { id: 'automatic-checkpointing', label: 'Automatic Checkpointing' },
        { id: 'smart-resumption', label: 'Smart Resumption' },
        { id: 'cloud-resilient-workflows', label: 'Cloud-Resilient Workflows' },
        { id: 'best-practices', label: 'Best Practices' },
        { id: 'configuration-options', label: 'Configuration Options' },
        { id: 'quick-reference', label: 'Quick Reference' },
        { id: 'common-patterns', label: 'Common Patterns' },
    ];

    const overviewData = [
        { feature: 'Automatic Checkpoints', useCase: 'System crashes, interruptions', benefit: 'Zero-loss recovery' },
        { feature: 'Manual Checkpoints', useCase: 'Strategic save points', benefit: 'Controlled persistence' },
        { feature: 'State Restoration', useCase: 'Resume after failure', benefit: 'Continue from exact point' },
        { feature: 'Progress Tracking', useCase: 'Long-running workflows', benefit: 'Monitor completion' },
        { feature: 'Cloud Resilience', useCase: 'Preemptible instances', benefit: 'Cost-effective execution' },
    ];

    return (
        <DocsLayout
            sidebarLinks={sidebarLinks}
            pageMarkdown={checkpointingMarkdown}
            currentPage="checkpointing"
            pageKey="docs/checkpointing"
        >
            <MarkdownRenderer content={checkpointingMarkdown} />
        </DocsLayout>
    );
};

export const RAGRecipePage: React.FC = () => {
    const sidebarLinks = [
        { id: 'overview', label: 'Overview' },
        { id: 'basic-rag', label: '1. Basic RAG' },
        { id: 're-ranking', label: '2. Adding Re-ranking' },
        { id: 'error-handling-recipe', label: '3. Error Handling' },
        { id: 'checkpointing-recipe', label: '4. Checkpointing' },
        { id: 'multi-agent', label: '5. Multi-Agent Coordination' },
        { id: 'key-takeaways', label: 'Key Takeaways' },
    ];

    const keyTakeawaysData = [
        ['Security', '❌ Hardcoded keys', '✅ `context.set_secret()`', '✅ Secure storage', '✅ Shared secrets'],
        ['Error Handling', '❌ Basic', '✅ Try/catch', '✅ Retry policies', '✅ Isolated failures'],
        ['Rate Limiting', '❌ None', '❌ None', '✅ `@state(rate_limit)`', '✅ Coordinated limits'],
        ['Checkpointing', '❌ None', '❌ None', '✅ Auto-resume', '✅ Distributed state'],
        ['Scalability', '❌ Single-threaded', '✅ Re-ranking', '✅ Robust processing', '✅ Parallel workers'],
    ];

    return (
        <DocsLayout
            sidebarLinks={sidebarLinks}
            pageMarkdown={ragRecipeMarkdown}
            currentPage="rag-recipe"
            pageKey="docs/rag-recipe"
        >
            <section id="rag-recipe-intro">
                <h1>Building a Production RAG System with Puffinflow</h1>
                <p>Learn how to build a robust Retrieval-Augmented Generation (RAG) system using Puffinflow, progressing from basic functionality to production-ready features with re-ranking, error handling, and multi-agent coordination.</p>
            </section>

            <section id="overview">
                <h2>Overview</h2>
                <p>This tutorial demonstrates how Puffinflow's state management, resource control, and coordination features transform a simple RAG implementation into a scalable, resilient system. We'll build incrementally, adding one feature at a time.</p>
                <p><strong>What you'll learn:</strong></p>
                <ul>
                    <li>Basic RAG workflow orchestration</li>
                    <li>Adding re-ranking for better retrieval quality</li>
                    <li>Implementing rate limiting and retry policies</li>
                    <li>Managing secrets and configuration</li>
                    <li>Checkpointing for long-running processes</li>
                    <li>Multi-agent coordination for parallel processing</li>
                </ul>
            </section>

            <section id="basic-rag">
                <h2>1. Basic RAG Implementation</h2>
                <p>Let's start with a simple document processing and query system:</p>
                <CodeWindow language="python" fileName="basic_rag.py" code={`import asyncio
from pathlib import Path
from typing import List, Dict, Any
from puffinflow import Agent
from puffinflow.decorators import state

# Using LangChain for RAG components
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextFileLoader, PDFLoader

# Create our RAG agent
rag_agent = Agent("basic-rag-agent")

@state
async def initialize_system(context):
    """Initialize the RAG system components"""
    print("🔧 Initializing RAG system...")

    # Store API keys securely using context secrets
    context.set_secret("openai_api_key", "your-openai-api-key")
    context.set_secret("pinecone_api_key", "your-pinecone-api-key")

    # Initialize components with secrets
    openai_key = context.get_secret("openai_api_key")
    embeddings = OpenAIEmbeddings(openai_api_key=openai_key)
    llm = OpenAI(openai_api_key=openai_key, temperature=0.1)

    # Store components in context for later use
    context.set_variable("embeddings", embeddings)
    context.set_variable("llm", llm)
    context.set_constant("index_name", "rag-knowledge-base")

    print("✅ RAG system initialized")

@state
async def load_documents(context):
    """Load documents from specified sources"""
    print("📚 Loading documents...")

    document_paths = [
        "docs/company_handbook.pdf",
        "docs/product_specifications.txt",
        "docs/user_manual.pdf"
    ]

    documents = []
    for doc_path in document_paths:
        if not Path(doc_path).exists():
            print(f"⚠️ Document not found: {doc_path}")
            continue

        print(f"   📄 Loading {doc_path}...")

        # Choose appropriate loader
        if doc_path.endswith('.pdf'):
            loader = PDFLoader(doc_path)
        else:
            loader = TextFileLoader(doc_path)

        doc_data = loader.load()
        documents.extend(doc_data)
        print(f"   ✅ Loaded {len(doc_data)} pages")

    context.set_variable("documents", documents)
    print(f"📖 Total documents loaded: {len(documents)}")

@state
async def create_embeddings(context):
    """Create vector embeddings for documents"""
    print("🔢 Creating vector embeddings...")

    documents = context.get_variable("documents", [])
    embeddings = context.get_variable("embeddings")

    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = []
    for doc in documents:
        doc_chunks = text_splitter.split_documents([doc])
        chunks.extend(doc_chunks)

    # Create vector store
    vectorstore = Pinecone.from_documents(
        chunks,
        embeddings,
        index_name=context.get_constant("index_name")
    )

    context.set_variable("vectorstore", vectorstore)
    context.set_output("total_chunks", len(chunks))
    print(f"✅ Created {len(chunks)} embeddings")

@state
async def setup_qa_chain(context):
    """Set up the question-answering chain"""
    print("🔗 Setting up QA chain...")

    vectorstore = context.get_variable("vectorstore")
    llm = context.get_variable("llm")

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 4}),
        return_source_documents=True
    )

    context.set_variable("qa_chain", qa_chain)
    print("✅ QA chain ready")

@state
async def test_system(context):
    """Test the RAG system with sample queries"""
    print("🧪 Testing RAG system...")

    qa_chain = context.get_variable("qa_chain")
    test_queries = [
        "What is the company's vacation policy?",
        "How do I reset my password?",
        "What are the system requirements?"
    ]

    for query in test_queries:
        print(f"   ❓ {query}")
        result = qa_chain({"query": query})
        answer = result["result"][:100] + "..." if len(result["result"]) > 100 else result["result"]
        print(f"   💭 {answer}")
        print(f"   📚 Sources: {len(result['source_documents'])}")

    print("✅ Testing complete")

# Build the workflow
rag_agent.add_state("initialize_system", initialize_system)
rag_agent.add_state("load_documents", load_documents, dependencies=["initialize_system"])
rag_agent.add_state("create_embeddings", create_embeddings, dependencies=["load_documents"])
rag_agent.add_state("setup_qa_chain", setup_qa_chain, dependencies=["create_embeddings"])
rag_agent.add_state("test_system", test_system, dependencies=["setup_qa_chain"])

async def main():
    print("🚀 Starting basic RAG system...")
    await rag_agent.run()

if __name__ == "__main__":
    asyncio.run(main())`} />
                <p><strong>Key concepts introduced:</strong></p>
                <ul>
                    <li><InlineCode>context.set_secret()</InlineCode> for secure API key storage</li>
                    <li><InlineCode>context.set_constant()</InlineCode> for immutable configuration</li>
                    <li><InlineCode>context.set_output()</InlineCode> for metrics tracking</li>
                    <li>State dependencies for workflow ordering</li>
                </ul>
            </section>

            <section id="re-ranking">
                 <h2>2. Adding Re-ranking for Better Results</h2>
                <p>Now let's enhance our system with re-ranking to improve retrieval quality:</p>
                <CodeWindow language="python" fileName="reranking.py" code={`from sentence_transformers import CrossEncoder

@state
async def setup_reranker(context):
    """Initialize the re-ranking model"""
    print("🔄 Setting up re-ranker...")

    # Use a cross-encoder model for re-ranking
    reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
    context.set_variable("reranker", reranker)

    print("✅ Re-ranker ready")

@state
async def setup_enhanced_qa_chain(context):
    """Set up QA chain with re-ranking"""
    print("🔗 Setting up enhanced QA chain with re-ranking...")

    vectorstore = context.get_variable("vectorstore")
    llm = context.get_variable("llm")
    reranker = context.get_variable("reranker")

    class RerankedRetriever:
        def __init__(self, vectorstore, reranker, k=10, final_k=4):
            self.vectorstore = vectorstore
            self.reranker = reranker
            self.k = k
            self.final_k = final_k

        def get_relevant_documents(self, query):
            # Get more documents than needed
            docs = self.vectorstore.similarity_search(query, k=self.k)

            # Re-rank using cross-encoder
            pairs = [[query, doc.page_content] for doc in docs]
            scores = self.reranker.predict(pairs)

            # Sort by score and take top results
            scored_docs = list(zip(docs, scores))
            scored_docs.sort(key=lambda x: x[1], reverse=True)

            return [doc for doc, score in scored_docs[:self.final_k]]

    # Create retriever with re-ranking
    retriever = RerankedRetriever(vectorstore, reranker)

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )

    context.set_variable("qa_chain", qa_chain)
    print("✅ Enhanced QA chain with re-ranking ready")

@state
async def test_enhanced_system(context):
    """Test the enhanced system and compare results"""
    print("🧪 Testing enhanced RAG system...")

    qa_chain = context.get_variable("qa_chain")
    vectorstore = context.get_variable("vectorstore")

    test_query = "What is the company's vacation policy?"

    print(f"   ❓ Query: {test_query}")

    # Test basic retrieval
    basic_docs = vectorstore.similarity_search(test_query, k=4)
    print(f"   📄 Basic retrieval: {len(basic_docs)} documents")

    # Test enhanced retrieval with re-ranking
    result = qa_chain({"query": test_query})
    enhanced_docs = result["source_documents"]

    print(f"   🔄 Enhanced with re-ranking: {len(enhanced_docs)} documents")
    print(f"   💭 Answer: {result['result'][:120]}...")

    # Store results for comparison
    context.set_output("basic_retrieval_count", len(basic_docs))
    context.set_output("enhanced_retrieval_count", len(enhanced_docs))

    print("✅ Enhanced testing complete")

# Update the workflow
rag_agent_v2 = Agent("enhanced-rag-agent")

rag_agent_v2.add_state("initialize_system", initialize_system)
rag_agent_v2.add_state("load_documents", load_documents, dependencies=["initialize_system"])
rag_agent_v2.add_state("create_embeddings", create_embeddings, dependencies=["load_documents"])
rag_agent_v2.add_state("setup_reranker", setup_reranker, dependencies=["create_embeddings"])
rag_agent_v2.add_state("setup_enhanced_qa_chain", setup_enhanced_qa_chain,
                      dependencies=["setup_reranker"])
rag_agent_v2.add_state("test_enhanced_system", test_enhanced_system,
                      dependencies=["setup_enhanced_qa_chain"])`} />
                 <p><strong>New concepts:</strong></p>
                <ul>
                    <li>Custom retriever classes for enhanced functionality</li>
                    <li>Output metrics for performance comparison</li>
                    <li>Modular state design for easy enhancement</li>
                </ul>
            </section>

            <section id="error-handling-recipe">
                <h2>3. Adding Rate Limiting and Error Handling</h2>
                <p>Now let's make our system production-ready with rate limiting and robust error handling:</p>
                <CodeWindow language="python" fileName="error_handling.py" code={`from puffinflow.core.agent.base import RetryPolicy

# Create custom retry policies
embedding_retry_policy = RetryPolicy(
    max_retries=3,
    initial_delay=2.0,
    exponential_base=2.0,
    jitter=True
)

# Production-ready RAG agent
rag_agent_v3 = Agent("production-rag-agent", retry_policy=embedding_retry_policy)

@state(rate_limit=10.0, burst_limit=20, max_retries=3, timeout=60.0)
async def create_embeddings_robust(context):
    """Create embeddings with rate limiting and error handling"""
    print("🔢 Creating embeddings with rate limiting...")

    documents = context.get_variable("documents", [])
    embeddings = context.get_variable("embeddings")

    if not documents:
        raise Exception("No documents to process")

    # Process in batches to respect rate limits
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    all_chunks = []
    failed_docs = []

    batch_size = 5
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        batch_num = (i // batch_size) + 1
        total_batches = len(documents) // batch_size + 1

        try:
            print(f"   🔄 Processing batch {batch_num}/{total_batches}")

            # Split documents in this batch
            batch_chunks = []
            for doc in batch:
                chunks = text_splitter.split_documents([doc])
                batch_chunks.extend(chunks)

            # Validate chunk content
            valid_chunks = []
            for chunk in batch_chunks:
                if len(chunk.page_content.strip()) >= 10:
                    valid_chunks.append(chunk)
                else:
                    print(f"   ⚠️ Skipping short chunk")

            all_chunks.extend(valid_chunks)
            print(f"   ✅ Batch {batch_num} complete: {len(valid_chunks)} chunks")

        except Exception as e:
            print(f"   ❌ Batch {batch_num} failed: {e}")
            failed_docs.extend([doc.metadata.get('source', 'unknown') for doc in batch])
            continue

    if not all_chunks:
        raise Exception("No valid chunks created")

    # Create vector store with error handling
    try:
        pinecone_key = context.get_secret("pinecone_api_key")

        vectorstore = Pinecone.from_documents(
            all_chunks,
            embeddings,
            index_name=context.get_constant("index_name")
        )

        context.set_variable("vectorstore", vectorstore)
        context.set_output("successful_chunks", len(all_chunks))
        context.set_output("failed_documents", len(failed_docs))

        success_rate = (len(all_chunks) / (len(all_chunks) + len(failed_docs))) * 100
        print(f"✅ Embeddings created: {len(all_chunks)} chunks ({success_rate:.1f}% success rate)")

    except Exception as e:
        print(f"❌ Vector store creation failed: {e}")
        raise

@state(rate_limit=3.0, max_retries=2, timeout=30.0)
async def test_with_error_handling(context):
    """Test system with comprehensive error handling"""
    print("🧪 Testing with error handling...")

    qa_chain = context.get_variable("qa_chain")

    test_queries = [
        "What is the company's vacation policy?",
        "How do I reset my password?",
        "What are the product specifications?",
        "Invalid query with special chars: @#$%^&*()"
    ]

    successful_queries = []
    failed_queries = []

    for query in test_queries:
        try:
            print(f"   ❓ Testing: {query}")

            # Validate query
            if len(query.strip()) < 3:
                print(f"   ⚠️ Query too short, skipping")
                continue

            result = qa_chain({"query": query})

            # Validate result quality
            if len(result["result"].strip()) < 10:
                print(f"   ⚠️ Poor quality answer received")
                failed_queries.append(query)
                continue

            successful_queries.append({
                "query": query,
                "answer_length": len(result["result"]),
                "sources": len(result["source_documents"])
            })

            print(f"   ✅ Success: {len(result['result'])} chars, {len(result['source_documents'])} sources")

        except Exception as e:
            print(f"   ❌ Query failed: {e}")
            failed_queries.append(query)

    # Store comprehensive metrics
    context.set_output("successful_queries", len(successful_queries))
    context.set_output("failed_queries", len(failed_queries))
    context.set_output("success_rate", len(successful_queries) / len(test_queries) * 100)

    if successful_queries:
        avg_sources = sum(q["sources"] for q in successful_queries) / len(successful_queries)
        context.set_output("avg_sources_per_answer", avg_sources)

    print(f"✅ Testing complete: {len(successful_queries)}/{len(test_queries)} successful")

# Build robust workflow
rag_agent_v3.add_state("initialize_system", initialize_system)
rag_agent_v3.add_state("load_documents", load_documents, dependencies=["initialize_system"])
rag_agent_v3.add_state("create_embeddings_robust", create_embeddings_robust,
                      dependencies=["load_documents"])
rag_agent_v3.add_state("setup_reranker", setup_reranker, dependencies=["create_embeddings_robust"])
rag_agent_v3.add_state("setup_enhanced_qa_chain", setup_enhanced_qa_chain,
                      dependencies=["setup_reranker"])
rag_agent_v3.add_state("test_with_error_handling", test_with_error_handling,
                      dependencies=["setup_enhanced_qa_chain"])`} />
                <p><strong>Production features added:</strong></p>
                <ul>
                    <li><InlineCode>@state(rate_limit=10.0)</InlineCode> prevents API quota exhaustion</li>
                    <li><InlineCode>max_retries=3</InlineCode> with exponential backoff</li>
                    <li>Input validation and quality checks</li>
                    <li>Comprehensive error metrics</li>
                    <li>Graceful degradation on failures</li>
                </ul>
            </section>

            <section id="checkpointing-recipe">
                <h2>4. Checkpointing for Long Processes</h2>
                <p>For large document corpora, add checkpointing to resume interrupted processing:</p>
                 <CodeWindow language="python" fileName="checkpointing.py" code={`import json

@state(checkpoint_interval=30.0)  # Auto-checkpoint every 30 seconds
async def process_large_corpus(context):
    """Process large document corpus with checkpointing"""
    print("📚 Processing large corpus with checkpointing...")

    # Check if resuming from checkpoint
    processing_state = context.get_variable("corpus_state")

    if processing_state:
        print("🔄 Resuming from checkpoint...")
        current_index = processing_state["current_index"]
        processed_count = processing_state["processed_count"]
        total_docs = processing_state["total_documents"]

        print(f"   📊 Resume point: {current_index}/{total_docs}")
        print(f"   ✅ Previously processed: {processed_count}")
    else:
        print("🆕 Starting fresh processing...")

        # Discover all documents
        document_dirs = ["docs/", "knowledge_base/", "manuals/"]
        all_documents = []

        for doc_dir in document_dirs:
            dir_path = Path(doc_dir)
            if dir_path.exists():
                for file_path in dir_path.rglob("*"):
                    if file_path.suffix.lower() in ['.pdf', '.txt', '.md']:
                        all_documents.append(str(file_path))

        processing_state = {
            "all_documents": all_documents,
            "total_documents": len(all_documents),
            "current_index": 0,
            "processed_count": 0,
            "failed_count": 0,
            "start_time": asyncio.get_event_loop().time()
        }

        context.set_variable("corpus_state", processing_state)
        print(f"   📁 Found {len(all_documents)} documents to process")

    # Continue processing from current position
    embeddings = context.get_variable("embeddings")
    vectorstore = context.get_variable("vectorstore")

    all_documents = processing_state["all_documents"]
    current_index = processing_state["current_index"]
    total_docs = processing_state["total_documents"]

    for i in range(current_index, total_docs):
        doc_path = all_documents[i]

        try:
            print(f"   📄 Processing {i+1}/{total_docs}: {Path(doc_path).name}")

            # Load and process document
            if doc_path.endswith('.pdf'):
                loader = PDFLoader(doc_path)
            else:
                loader = TextFileLoader(doc_path)

            doc_data = loader.load()

            # Process each page
            for page in doc_data:
                text_splitter = RecursiveCharacterTextSplitter(
                    chunk_size=1000, chunk_overlap=200
                )
                chunks = text_splitter.split_documents([page])

                # Add to vector store
                vectorstore.add_documents(chunks)

            processing_state["processed_count"] += 1

        except Exception as e:
            print(f"   ❌ Failed: {e}")
            processing_state["failed_count"] += 1

        # Update checkpoint state
        processing_state["current_index"] = i + 1
        context.set_variable("corpus_state", processing_state)

        # Manual checkpoint every 10 documents
        if (i + 1) % 10 == 0:
            completion_pct = ((i + 1) / total_docs) * 100
            print(f"   💾 Checkpoint: {completion_pct:.1f}% complete")

    # Final statistics
    total_time = asyncio.get_event_loop().time() - processing_state["start_time"]

    print(f"✅ Corpus processing complete:")
    print(f"   📊 Processed: {processing_state['processed_count']}")
    print(f"   ❌ Failed: {processing_state['failed_count']}")
    print(f"   ⏱️ Time: {total_time:.1f}s")

@state
async def save_progress_report(context):
    """Save processing progress to disk"""
    print("💾 Saving progress report...")

    corpus_state = context.get_variable("corpus_state")
    outputs = context.get_output_keys()

    report = {
        "corpus_processing": corpus_state,
        "metrics": {key: context.get_output(key) for key in outputs},
        "timestamp": asyncio.get_event_loop().time()
    }

    with open("rag_progress_report.json", "w") as f:
        json.dump(report, f, indent=2)

    print("✅ Progress report saved")`} />
                <p><strong>Checkpointing benefits:</strong></p>
                <ul>
                    <li>Resume processing after interruptions</li>
                    <li>Progress tracking for long operations</li>
                    <li>Persistent state management</li>
                    <li>Resource usage optimization</li>
                </ul>
            </section>

            <section id="multi-agent">
                <h2>5. Multi-Agent Coordination</h2>
                <p>Finally, let's scale with multiple coordinated agents for parallel processing:</p>
                <CodeWindow language="python" fileName="multi_agent.py" code={`from puffinflow.core.coordination.primitives import Semaphore, Barrier, Mutex

# Coordination primitives
embedding_semaphore = Semaphore("embedding_api", max_count=3)
vector_store_mutex = Mutex("vector_store_writes")
processing_barrier = Barrier("sync_point", parties=3)

# Specialized agents
coordinator_agent = Agent("document-coordinator")
embedding_agent_1 = Agent("embedding-worker-1")
embedding_agent_2 = Agent("embedding-worker-2")

# Shared workspace
class DocumentWorkspace:
    def __init__(self):
        self.document_queue = []
        self.processed_docs = []
        self.failed_docs = []

    async def add_documents(self, docs):
        self.document_queue.extend(docs)

    async def get_next_batch(self, batch_size=5):
        if len(self.document_queue) >= batch_size:
            batch = self.document_queue[:batch_size]
            self.document_queue = self.document_queue[batch_size:]
            return batch
        return []

workspace = DocumentWorkspace()

@state
async def coordinate_processing(context):
    """Coordinate document distribution"""
    print("📋 Coordinator: Distributing documents...")

    # Discover documents
    docs = []  # Your document discovery logic here
    await workspace.add_documents(docs)

    context.set_output("total_documents", len(docs))
    print(f"📤 Distributed {len(docs)} documents")

@state(rate_limit=8.0, max_retries=3)
async def embedding_worker(context):
    """Worker for processing embeddings"""
    agent_name = context.get_variable("agent_name", "worker")
    print(f"🔢 {agent_name}: Starting...")

    embeddings = context.get_variable("embeddings")
    processed_count = 0

    while True:
        # Get work batch
        doc_batch = await workspace.get_next_batch(batch_size=3)
        if not doc_batch:
            break

        print(f"   📦 {agent_name}: Processing {len(doc_batch)} documents")

        for doc_info in doc_batch:
            try:
                # Rate-limited embedding creation
                print(f"   🔒 {agent_name}: Requesting API access...")
                await embedding_semaphore.acquire(agent_name)

                try:
                    # Process document (your logic here)
                    print(f"   ✅ {agent_name}: Processed document")
                    processed_count += 1

                finally:
                    await embedding_semaphore.release(agent_name)

                # Exclusive vector store access
                await vector_store_mutex.acquire(agent_name)
                try:
                    # Store embeddings (your logic here)
                    pass
                finally:
                    await vector_store_mutex.release(agent_name)

            except Exception as e:
                print(f"   ❌ {agent_name}: Failed: {e}")

    context.set_output(f"{agent_name}_processed", processed_count)
    print(f"🏁 {agent_name}: Completed {processed_count} documents")

    # Wait for other workers
    await processing_barrier.wait(agent_name)
    print(f"🚀 {agent_name}: All workers complete!")

# Build multi-agent workflow
coordinator_agent.add_state("coordinate_processing", coordinate_processing)

embedding_agent_1.add_state("initialize_system", initialize_system)
embedding_agent_1.add_state("embedding_worker",
    lambda ctx: embedding_worker({**ctx.shared_state, "agent_name": "worker-1"}),
    dependencies=["initialize_system"])

embedding_agent_2.add_state("initialize_system", initialize_system)
embedding_agent_2.add_state("embedding_worker",
    lambda ctx: embedding_worker({**ctx.shared_state, "agent_name": "worker-2"}),
    dependencies=["initialize_system"])

async def run_multi_agent_system():
    """Run coordinated multi-agent RAG system"""
    print("🤝 Starting multi-agent RAG system...")

    tasks = [
        asyncio.create_task(coordinator_agent.run()),
        asyncio.create_task(embedding_agent_1.run()),
        asyncio.create_task(embedding_agent_2.run())
    ]

    await asyncio.gather(*tasks)
    print("🎉 Multi-agent processing complete!")`} />
                <p><strong>Multi-agent benefits:</strong></p>
                <ul>
                    <li>Parallel processing for better throughput</li>
                    <li>Coordinated resource access with semaphores/mutexes</li>
                    <li>Load balancing across workers</li>
                    <li>Synchronized completion with barriers</li>
                </ul>
            </section>

            <section id="key-takeaways">
                <h2>Key Takeaways</h2>
                <p>This tutorial showed how Puffinflow transforms a basic RAG system into a production-ready solution:</p>
                <div className="not-prose my-8 docs-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Basic</th>
                                <th>Enhanced</th>
                                <th>Production</th>
                                <th>Multi-Agent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keyTakeawaysData.map((row, i) => (
                                <tr key={i}>
                                    {row.map((cell, j) => (
                                        <td key={j}>{j === 0 ? <strong>{cell}</strong> : cell.replace(/`([^`]+)`/g, '<code class="font-mono text-sm">@state(rate_limit)</code>')}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p><strong>Production-ready features achieved:</strong></p>
                <ul>
                    <li>🔐 Secure API key management with <InlineCode>context.set_secret()</InlineCode></li>
                    <li>🚦 Rate limiting to prevent quota exhaustion</li>
                    <li>🛡️ Comprehensive error handling and retries</li>
                    <li>💾 Checkpointing for long-running processes</li>
                    <li>🤝 Multi-agent coordination for scalability</li>
                    <li>📊 Rich metrics and monitoring</li>
                    <li>🔄 Re-ranking for improved retrieval quality</li>
                </ul>
                <p>Start with the basic implementation and incrementally add these features as your RAG system grows in complexity and scale!</p>
            </section>
        </DocsLayout>
    );
};

export const ReliabilityPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'introduction', label: 'Introduction' },
        { id: 'circuit-breaker', label: 'Circuit Breaker Pattern' },
        { id: 'bulkhead', label: 'Bulkhead Isolation' },
        { id: 'timeout-retry', label: 'Timeout & Retry' },
        { id: 'health-monitoring', label: 'Health Monitoring' },
        { id: 'disaster-recovery', label: 'Disaster Recovery' },
    ];

    return (
        <DocsLayout sidebarLinks={sidebarLinks} pageMarkdown={reliabilityMarkdown} currentPage="reliability" pageKey="docs/reliability">
            <section id="reliability">
                <h1>Reliability & Production Patterns</h1>
                <p>Puffinflow provides comprehensive reliability patterns to ensure your workflows operate consistently in production environments. This guide covers health monitoring, graceful degradation, system resilience, and operational best practices for building bulletproof AI workflows.</p>

                <h2 id="circuit-breaker">Circuit Breaker Pattern</h2>
                <p>Prevent cascading failures by automatically detecting and isolating failing services.</p>
                <CodeWindow language="python" fileName="circuit_breaker.py" code={`from puffinflow import Agent, CircuitBreaker, state

# Create circuit breaker for external service calls
api_breaker = CircuitBreaker(
    failure_threshold=5,  # Trip after 5 failures
    recovery_timeout=60,  # Try again after 60 seconds
    expected_exception=ConnectionError
)

agent = Agent("resilient-workflow")

@state(circuit_breaker=api_breaker)
async def call_external_api(context):
    """Protected API call with circuit breaker"""
    try:
        response = await external_api.get_data()
        context.set_variable("api_response", response)
        return "process_data"
    except ConnectionError:
        # Circuit breaker will handle this
        context.set_variable("api_failed", True)
        return "fallback_handler"

@state
async def fallback_handler(context):
    """Graceful degradation when API fails"""
    print("API unavailable, using cached data")
    cached_data = context.get_variable("cached_data", {})
    context.set_variable("api_response", cached_data)
    return "process_data"`} />

                <h2 id="bulkhead">Bulkhead Isolation</h2>
                <p>Isolate critical resources to prevent resource exhaustion from affecting the entire system.</p>
                <CodeWindow language="python" fileName="bulkhead.py" code={`from puffinflow import Agent, Bulkhead, state

# Separate resource pools for different priorities
critical_pool = Bulkhead("critical", max_concurrent=3)
standard_pool = Bulkhead("standard", max_concurrent=10)

@state(bulkhead=critical_pool, priority="high")
async def critical_operation(context):
    """High-priority operation with dedicated resources"""
    result = await perform_critical_task()
    context.set_variable("critical_result", result)
    return "complete"

@state(bulkhead=standard_pool)
async def standard_operation(context):
    """Standard operation that won't starve critical operations"""
    result = await perform_standard_task()
    context.set_variable("standard_result", result)
    return "complete"`} />

                <h2 id="health-monitoring">Health Monitoring</h2>
                <p>Implement comprehensive health checks and monitoring for proactive issue detection.</p>
                <CodeWindow language="python" fileName="health_monitoring.py" code={`from puffinflow import Agent, state
import asyncio
import time

class HealthMonitor:
    def __init__(self):
        self.checks = {}
        self.last_check = time.time()

    async def register_check(self, name, check_func):
        """Register a health check function"""
        self.checks[name] = check_func

    async def run_health_checks(self):
        """Run all registered health checks"""
        results = {}
        for name, check_func in self.checks.items():
            try:
                result = await check_func()
                results[name] = {"status": "healthy", "result": result}
            except Exception as e:
                results[name] = {"status": "unhealthy", "error": str(e)}

        return results

monitor = HealthMonitor()

@state
async def system_health_check(context):
    """Comprehensive system health monitoring"""

    # Register health checks
    await monitor.register_check("database", check_database_connection)
    await monitor.register_check("external_api", check_api_availability)
    await monitor.register_check("memory", check_memory_usage)
    await monitor.register_check("disk_space", check_disk_space)

    # Run all checks
    health_results = await monitor.run_health_checks()

    # Determine overall health
    unhealthy_services = [name for name, result in health_results.items()
                         if result["status"] == "unhealthy"]

    overall_health = "healthy" if not unhealthy_services else "degraded"

    context.set_variable("health_status", overall_health)
    context.set_variable("health_details", health_results)
    context.set_output("unhealthy_services_count", len(unhealthy_services))

    if unhealthy_services:
        print(f"⚠️ System health degraded. Unhealthy: {unhealthy_services}")
        return "handle_degraded_health"
    else:
        print("✅ All systems healthy")
        return "continue_normal_operation"

async def check_database_connection():
    # Simulate database health check
    await asyncio.sleep(0.1)
    return {"connection_time_ms": 50, "active_connections": 5}

async def check_api_availability():
    # Simulate external API health check
    await asyncio.sleep(0.1)
    return {"response_time_ms": 150, "status": "operational"}

async def check_memory_usage():
    # Simulate memory usage check
    return {"used_percent": 65, "available_gb": 2.1}

async def check_disk_space():
    # Simulate disk space check
    return {"used_percent": 45, "available_gb": 25.8}`} />

                <h2 id="disaster-recovery">Disaster Recovery</h2>
                <p>Implement comprehensive backup and recovery strategies for critical workflow data.</p>
                <CodeWindow language="python" fileName="disaster_recovery.py" code={`from puffinflow import Agent, state
import json
import asyncio
from datetime import datetime

class DisasterRecoveryManager:
    def __init__(self, backup_location):
        self.backup_location = backup_location
        self.recovery_points = []

    async def create_backup(self, context_data, metadata=None):
        """Create a recovery point"""
        timestamp = datetime.now().isoformat()
        backup_data = {
            "timestamp": timestamp,
            "context_data": context_data,
            "metadata": metadata or {},
            "version": "1.0"
        }

        backup_file = f"{self.backup_location}/backup_{timestamp}.json"
        with open(backup_file, 'w') as f:
            json.dump(backup_data, f, indent=2)

        self.recovery_points.append(backup_file)
        return backup_file

    async def restore_from_backup(self, backup_file):
        """Restore system state from backup"""
        with open(backup_file, 'r') as f:
            backup_data = json.load(f)

        return backup_data["context_data"]

recovery_manager = DisasterRecoveryManager("/backups")

@state(checkpoint_interval=30.0)
async def critical_data_processing(context):
    """Critical operation with disaster recovery"""

    # Create recovery point before critical operation
    current_state = {
        "processed_items": context.get_variable("processed_items", []),
        "progress": context.get_variable("progress", 0),
        "configuration": context.get_variable("config", {})
    }

    backup_file = await recovery_manager.create_backup(
        current_state,
        metadata={"operation": "critical_processing", "stage": "pre_operation"}
    )

    context.set_variable("recovery_point", backup_file)
    print(f"🛡️ Recovery point created: {backup_file}")

    try:
        # Perform critical operation
        result = await perform_critical_operation()
        context.set_variable("operation_result", result)

        # Create post-operation backup
        final_state = {**current_state, "operation_result": result}
        final_backup = await recovery_manager.create_backup(
            final_state,
            metadata={"operation": "critical_processing", "stage": "post_operation"}
        )

        print(f"✅ Operation complete. Final backup: {final_backup}")
        return "operation_success"

    except Exception as e:
        print(f"❌ Critical operation failed: {e}")
        print(f"🔄 Recovery point available: {backup_file}")
        context.set_variable("failure_reason", str(e))
        return "disaster_recovery"

@state
async def disaster_recovery(context):
    """Recover from critical failure"""
    recovery_point = context.get_variable("recovery_point")

    if recovery_point:
        print(f"🔄 Initiating disaster recovery from: {recovery_point}")

        # Restore previous state
        restored_state = await recovery_manager.restore_from_backup(recovery_point)

        # Restore context variables
        for key, value in restored_state.items():
            context.set_variable(key, value)

        # Set recovery metadata
        context.set_variable("recovered_from_disaster", True)
        context.set_variable("recovery_timestamp", datetime.now().isoformat())

        print("✅ System state restored from backup")
        return "retry_operation"
    else:
        print("❌ No recovery point available")
        return "manual_intervention_required"

async def perform_critical_operation():
    # Simulate critical operation that might fail
    await asyncio.sleep(1.0)
    # Uncomment to simulate failure
    # raise Exception("Critical operation failed")
    return {"status": "success", "data": "processed_data"}`} />
            </section>
        </DocsLayout>
    );
};

export const ObservabilityPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'introduction', label: 'Introduction' },
        { id: 'metrics', label: 'Metrics Collection' },
        { id: 'tracing', label: 'Distributed Tracing' },
        { id: 'logging', label: 'Structured Logging' },
        { id: 'alerting', label: 'Alerting & Monitoring' },
        { id: 'dashboards', label: 'Dashboards' },
    ];

    return (
        <DocsLayout sidebarLinks={sidebarLinks} pageMarkdown={observabilityMarkdown} currentPage="observability" pageKey="docs/observability">
            <section id="observability">
                <h1>Observability & Monitoring</h1>
                <p>Comprehensive observability stack for monitoring, alerting, and debugging Puffinflow workflows in production.</p>

                <h2 id="metrics">Metrics Collection</h2>
                <p>Collect and track key performance indicators for your workflows.</p>
                <CodeWindow language="python" fileName="metrics.py" code={`from puffinflow import Agent, state
import time
from dataclasses import dataclass
from typing import Dict, List

@dataclass
class MetricsCollector:
    def __init__(self):
        self.counters = {}
        self.histograms = {}
        self.gauges = {}

    def increment_counter(self, name: str, value: int = 1, tags: Dict = None):
        """Increment a counter metric"""
        key = f"{name}:{tags or {}}"
        self.counters[key] = self.counters.get(key, 0) + value

    def record_histogram(self, name: str, value: float, tags: Dict = None):
        """Record a histogram value"""
        key = f"{name}:{tags or {}}"
        if key not in self.histograms:
            self.histograms[key] = []
        self.histograms[key].append(value)

    def set_gauge(self, name: str, value: float, tags: Dict = None):
        """Set a gauge value"""
        key = f"{name}:{tags or {}}"
        self.gauges[key] = value

metrics = MetricsCollector()

@state
async def collect_workflow_metrics(context):
    """Collect comprehensive workflow metrics"""
    start_time = time.time()

    # Counter metrics
    metrics.increment_counter("workflow.started", tags={"workflow": "data_processing"})

    # Process data
    data_size = len(context.get_variable("input_data", []))
    processing_time = await process_data_with_timing(context)

    # Record performance metrics
    metrics.record_histogram("workflow.duration_seconds", processing_time)
    metrics.record_histogram("workflow.data_size_items", data_size)

    # Set current state gauges
    metrics.set_gauge("workflow.active_workers", 5)
    metrics.set_gauge("workflow.memory_usage_mb", 256.5)

    # Success/failure tracking
    if context.get_variable("processing_successful", True):
        metrics.increment_counter("workflow.completed")
    else:
        metrics.increment_counter("workflow.failed")

    # Store metrics in context for reporting
    context.set_output("processing_time", processing_time)
    context.set_output("data_items_processed", data_size)

    return "export_metrics"

async def process_data_with_timing(context):
    """Process data and return timing"""
    start = time.time()
    # Simulate data processing
    await asyncio.sleep(0.5)
    return time.time() - start`} />

                <h2 id="tracing">Distributed Tracing</h2>
                <p>Track requests across multiple services and workflow states.</p>
                <CodeWindow language="python" fileName="tracing.py" code={`from puffinflow import Agent, state
import uuid
import json
from datetime import datetime
from typing import Optional

class TraceSpan:
    def __init__(self, operation_name: str, parent_span: Optional['TraceSpan'] = None):
        self.span_id = str(uuid.uuid4())
        self.trace_id = parent_span.trace_id if parent_span else str(uuid.uuid4())
        self.parent_id = parent_span.span_id if parent_span else None
        self.operation_name = operation_name
        self.start_time = datetime.now().isoformat()
        self.end_time = None
        self.tags = {}
        self.logs = []

    def set_tag(self, key: str, value: str):
        """Add a tag to the span"""
        self.tags[key] = value

    def log(self, message: str, level: str = "info"):
        """Add a log entry to the span"""
        self.logs.append({
            "timestamp": datetime.now().isoformat(),
            "level": level,
            "message": message
        })

    def finish(self):
        """Mark the span as completed"""
        self.end_time = datetime.now().isoformat()

    def to_dict(self):
        """Convert span to dictionary for export"""
        return {
            "span_id": self.span_id,
            "trace_id": self.trace_id,
            "parent_id": self.parent_id,
            "operation_name": self.operation_name,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "tags": self.tags,
            "logs": self.logs
        }

@state
async def traced_workflow_step(context):
    """Execute workflow step with distributed tracing"""

    # Get parent span from context or create root span
    parent_span = context.get_variable("current_span")
    span = TraceSpan("data_processing_step", parent_span)

    # Set span metadata
    span.set_tag("service", "puffinflow")
    span.set_tag("operation", "data_processing")
    span.set_tag("version", "1.0")

    try:
        span.log("Starting data processing step")

        # Store current span in context for child operations
        context.set_variable("current_span", span)

        # Simulate work with child spans
        result = await traced_data_processing(context)

        span.set_tag("status", "success")
        span.log(f"Processing completed. Result: {result}")

        context.set_variable("processing_result", result)

    except Exception as e:
        span.set_tag("status", "error")
        span.set_tag("error.message", str(e))
        span.log(f"Processing failed: {e}", level="error")
        raise

    finally:
        span.finish()

        # Store span for export
        spans = context.get_variable("trace_spans", [])
        spans.append(span.to_dict())
        context.set_variable("trace_spans", spans)

    return "export_traces"

async def traced_data_processing(context):
    """Data processing with child span"""
    parent_span = context.get_variable("current_span")
    child_span = TraceSpan("database_query", parent_span)

    try:
        child_span.set_tag("db.type", "postgresql")
        child_span.set_tag("db.statement", "SELECT * FROM users")
        child_span.log("Executing database query")

        # Simulate database work
        await asyncio.sleep(0.2)

        child_span.log("Query completed successfully")
        return {"status": "success", "rows": 150}

    finally:
        child_span.finish()

        # Add child span to trace
        spans = context.get_variable("trace_spans", [])
        spans.append(child_span.to_dict())
        context.set_variable("trace_spans", spans)`} />

                <h2 id="alerting">Alerting & Monitoring</h2>
                <p>Set up intelligent alerting for workflow health and performance issues.</p>
                <CodeWindow language="python" fileName="alerting.py" code={`from puffinflow import Agent, state
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Callable

class AlertRule:
    def __init__(self, name: str, condition: Callable, threshold: float,
                 duration: int = 60, severity: str = "warning"):
        self.name = name
        self.condition = condition
        self.threshold = threshold
        self.duration = duration  # seconds
        self.severity = severity
        self.triggered_at = None
        self.is_triggered = False

class AlertManager:
    def __init__(self):
        self.rules = []
        self.alerts = []
        self.notification_handlers = []

    def add_rule(self, rule: AlertRule):
        """Add an alerting rule"""
        self.rules.append(rule)

    def add_notification_handler(self, handler: Callable):
        """Add a notification handler (email, slack, etc.)"""
        self.notification_handlers.append(handler)

    async def evaluate_rules(self, metrics: Dict):
        """Evaluate all alerting rules against current metrics"""
        current_time = datetime.now()

        for rule in self.rules:
            try:
                # Check if condition is met
                value = rule.condition(metrics)
                condition_met = value > rule.threshold

                if condition_met and not rule.is_triggered:
                    # Start tracking this potential alert
                    if rule.triggered_at is None:
                        rule.triggered_at = current_time

                    # Check if duration threshold is met
                    elif (current_time - rule.triggered_at).seconds >= rule.duration:
                        await self._trigger_alert(rule, value, metrics)
                        rule.is_triggered = True

                elif not condition_met:
                    # Reset rule state
                    if rule.is_triggered:
                        await self._resolve_alert(rule)
                    rule.triggered_at = None
                    rule.is_triggered = False

            except Exception as e:
                print(f"Error evaluating rule {rule.name}: {e}")

    async def _trigger_alert(self, rule: AlertRule, value: float, metrics: Dict):
        """Trigger an alert"""
        alert = {
            "id": f"alert_{len(self.alerts)}",
            "rule_name": rule.name,
            "severity": rule.severity,
            "value": value,
            "threshold": rule.threshold,
            "triggered_at": datetime.now().isoformat(),
            "status": "active",
            "message": f"{rule.name}: {value} > {rule.threshold}"
        }

        self.alerts.append(alert)

        # Send notifications
        for handler in self.notification_handlers:
            await handler(alert)

    async def _resolve_alert(self, rule: AlertRule):
        """Resolve an alert"""
        for alert in self.alerts:
            if alert["rule_name"] == rule.name and alert["status"] == "active":
                alert["status"] = "resolved"
                alert["resolved_at"] = datetime.now().isoformat()

# Create alert manager and rules
alert_manager = AlertManager()

# Define alerting rules
error_rate_rule = AlertRule(
    name="High Error Rate",
    condition=lambda m: m.get("error_rate", 0) * 100,
    threshold=5.0,  # 5% error rate
    duration=120,   # 2 minutes
    severity="critical"
)

response_time_rule = AlertRule(
    name="High Response Time",
    condition=lambda m: m.get("avg_response_time", 0),
    threshold=2.0,  # 2 seconds
    duration=300,   # 5 minutes
    severity="warning"
)

memory_usage_rule = AlertRule(
    name="High Memory Usage",
    condition=lambda m: m.get("memory_usage_percent", 0),
    threshold=85.0,  # 85%
    duration=60,    # 1 minute
    severity="warning"
)

alert_manager.add_rule(error_rate_rule)
alert_manager.add_rule(response_time_rule)
alert_manager.add_rule(memory_usage_rule)

@state
async def monitor_and_alert(context):
    """Monitor system metrics and trigger alerts"""

    # Collect current metrics
    metrics = {
        "error_rate": context.get_output("error_rate", 0.02),  # 2%
        "avg_response_time": context.get_output("avg_response_time", 1.5),  # 1.5s
        "memory_usage_percent": context.get_output("memory_usage_percent", 75),  # 75%
        "active_connections": context.get_output("active_connections", 100),
        "queue_depth": context.get_output("queue_depth", 50)
    }

    # Evaluate alerting rules
    await alert_manager.evaluate_rules(metrics)

    # Store alert status in context
    active_alerts = [a for a in alert_manager.alerts if a["status"] == "active"]
    context.set_variable("active_alerts", active_alerts)
    context.set_output("alert_count", len(active_alerts))

    # Log current status
    if active_alerts:
        print(f"⚠️ {len(active_alerts)} active alerts")
        for alert in active_alerts:
            print(f"  - {alert['rule_name']}: {alert['message']}")
    else:
        print("✅ All systems normal - no active alerts")

    return "continue_monitoring"

# Notification handlers
async def slack_notification_handler(alert):
    """Send alert to Slack"""
    print(f"📱 Slack Alert: {alert['message']}")
    # Implement actual Slack webhook call

async def email_notification_handler(alert):
    """Send alert via email"""
    print(f"📧 Email Alert: {alert['message']}")
    # Implement actual email sending

# Register notification handlers
alert_manager.add_notification_handler(slack_notification_handler)
alert_manager.add_notification_handler(email_notification_handler)`} />
            </section>
        </DocsLayout>
    );
};

export const CoordinationPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'introduction', label: 'Introduction' },
        { id: 'synchronization', label: 'Synchronization Primitives' },
        { id: 'resource-pools', label: 'Resource Pools' },
        { id: 'distributed-workflows', label: 'Distributed Workflows' },
        { id: 'coordination-patterns', label: 'Coordination Patterns' },
    ];

    return (
        <DocsLayout sidebarLinks={sidebarLinks} pageMarkdown={coordinationMarkdown} currentPage="coordination" pageKey="docs/coordination">
            <section id="coordination">
                <h1>Coordination & Synchronization</h1>
                <p>Advanced patterns for coordinating multiple agents and managing shared resources in distributed workflows.</p>

                <h2 id="synchronization">Synchronization Primitives</h2>
                <p>Use semaphores, mutexes, and barriers to coordinate access to shared resources.</p>
                <CodeWindow language="python" fileName="synchronization.py" code={`from puffinflow import Agent, state
from puffinflow.core.coordination.primitives import Semaphore, Mutex, Barrier

# Create coordination primitives
api_semaphore = Semaphore("api_calls", max_count=5)
file_mutex = Mutex("file_access")
sync_barrier = Barrier("processing_sync", parties=3)

@state
async def coordinated_api_call(context):
    """Make API call with semaphore coordination"""
    agent_id = context.get_variable("agent_id")

    print(f"Agent {agent_id}: Waiting for API semaphore...")
    await api_semaphore.acquire(agent_id)

    try:
        print(f"Agent {agent_id}: Making API call")
        # Simulate API call
        await asyncio.sleep(2.0)
        result = {"status": "success", "data": "api_response"}
        context.set_variable("api_result", result)

    finally:
        await api_semaphore.release(agent_id)
        print(f"Agent {agent_id}: Released API semaphore")

    return "process_result"`} />

                <h2 id="resource-pools">Resource Pools</h2>
                <p>Manage shared resource pools for optimal resource utilization.</p>
                <CodeWindow language="python" fileName="resource_pools.py" code={`from puffinflow import Agent, ResourcePool, state

# Create resource pools
gpu_pool = ResourcePool("gpu", capacity=2)
memory_pool = ResourcePool("memory", capacity=8192)  # 8GB

@state(resources={"gpu": 1, "memory": 2048})
async def gpu_intensive_task(context):
    """Task requiring GPU and memory resources"""
    print("Executing GPU-intensive task...")

    # Simulate GPU computation
    await asyncio.sleep(3.0)

    result = {"model_output": "processed", "accuracy": 0.95}
    context.set_variable("gpu_result", result)

    return "finalize_results"`} />
            </section>
        </DocsLayout>
    );
};

export const MultiAgentPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'introduction', label: 'Introduction' },
        { id: 'agent-communication', label: 'Agent Communication' },
        { id: 'team-structures', label: 'Team Structures' },
        { id: 'swarm-intelligence', label: 'Swarm Intelligence' },
        { id: 'multi-agent-patterns', label: 'Multi-Agent Patterns' },
    ];

    return (
        <DocsLayout sidebarLinks={sidebarLinks} pageMarkdown={multiagentMarkdown} currentPage="multiagent" pageKey="docs/multiagent">
            <section id="multiagent">
                <h1>Multi-Agent Systems & Collaboration</h1>
                <p>Building sophisticated multi-agent systems with coordinated workflows, team structures, and collaborative intelligence.</p>

                <h2 id="agent-communication">Agent Communication</h2>
                <p>Enable agents to communicate and coordinate through message passing and shared state.</p>
                <CodeWindow language="python" fileName="communication.py" code={`from puffinflow import Agent, AgentTeam, EventBus, state

# Create event bus for agent communication
event_bus = EventBus()

# Define multiple coordinated agents
coordinator = Agent("coordinator")
worker_1 = Agent("worker-1")
worker_2 = Agent("worker-2")

@state
async def coordinate_work(context):
    """Coordinator distributes work to workers"""
    tasks = ["task_1", "task_2", "task_3", "task_4"]

    # Send tasks to workers via event bus
    for i, task in enumerate(tasks):
        worker_id = f"worker-{(i % 2) + 1}"
        await event_bus.publish("task_assigned", {
            "task_id": task,
            "worker_id": worker_id,
            "priority": "normal"
        })

    context.set_variable("tasks_distributed", len(tasks))
    return "monitor_progress"

@state
async def process_assigned_task(context):
    """Worker processes assigned tasks"""
    agent_id = context.get_variable("agent_id")

    # Listen for task assignments
    message = await event_bus.subscribe("task_assigned",
                                       filter_fn=lambda msg: msg["worker_id"] == agent_id)

    if message:
        task_id = message["task_id"]
        print(f"{agent_id}: Processing {task_id}")

        # Simulate work
        await asyncio.sleep(1.0)

        # Report completion
        await event_bus.publish("task_completed", {
            "task_id": task_id,
            "worker_id": agent_id,
            "result": f"completed_{task_id}"
        })

        context.set_variable("last_completed_task", task_id)

    return "wait_for_next_task"`} />

                <h2 id="team-structures">Team Structures</h2>
                <p>Organize agents into teams with specialized roles and responsibilities.</p>
                <CodeWindow language="python" fileName="teams.py" code={`from puffinflow import AgentTeam, create_team, state

# Create specialized agent team
processing_team = create_team("data-processing-team", {
    "max_agents": 5,
    "coordination_strategy": "round_robin",
    "load_balancing": True
})

@state
async def team_data_processing(context):
    """Process data using coordinated team"""
    data_batches = context.get_variable("data_batches", [])

    # Distribute work across team members
    results = await processing_team.distribute_work(
        work_items=data_batches,
        work_function=process_data_batch
    )

    # Aggregate results
    total_processed = sum(r["processed_count"] for r in results)
    context.set_variable("total_processed", total_processed)

    return "finalize_processing"

async def process_data_batch(batch_data):
    """Process a single data batch"""
    # Simulate processing
    await asyncio.sleep(0.5)
    return {
        "processed_count": len(batch_data),
        "status": "success"
    }`} />
            </section>
        </DocsLayout>
    );
};

export const ResourcesPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'introduction', label: 'Introduction' },
        { id: 'learning-paths', label: 'Learning Paths' },
        { id: 'installation', label: 'Installation Guide' },
        { id: 'community', label: 'Community & Support' },
        { id: 'troubleshooting', label: 'Troubleshooting' },
        { id: 'examples', label: 'Examples & Recipes' },
    ];

    return (
        <DocsLayout sidebarLinks={sidebarLinks} pageMarkdown={resourcesMarkdown} currentPage="resources" pageKey="docs/resources">
            <section id="resources">
                <h1>Resources & Learning Materials</h1>
                <p>Comprehensive collection of learning materials, examples, and resources to master Puffinflow development.</p>

                <h2 id="learning-paths">Learning Paths</h2>
                <p>Structured learning paths for different experience levels and use cases.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="learning-path-card">
                        <h3>Beginner Path</h3>
                        <ol>
                            <li>Getting Started</li>
                            <li>Context & Data</li>
                            <li>Basic Error Handling</li>
                            <li>Simple Workflows</li>
                        </ol>
                    </div>

                    <div className="learning-path-card">
                        <h3>Production Path</h3>
                        <ol>
                            <li>Resource Management</li>
                            <li>Reliability Patterns</li>
                            <li>Observability</li>
                            <li>Multi-Agent Systems</li>
                        </ol>
                    </div>
                </div>

                <h2 id="installation">Installation Guide</h2>
                <p>Complete installation instructions for different environments.</p>
                <CodeWindow language="bash" fileName="install.sh" code={`# Install Puffinflow
pip install puffinflow

# Install with optional dependencies
pip install puffinflow[observability,coordination]

# Development installation
pip install -e .[dev]

# Verify installation
python -c "import puffinflow; print(puffinflow.get_version())"`} />

                <h2 id="troubleshooting">Common Issues</h2>
                <p>Solutions to frequently encountered problems.</p>
                <div className="space-y-4">
                    <div className="troubleshooting-item">
                        <h4>Import Error: Cannot import 'state'</h4>
                        <p>Solution: Use <code>from puffinflow import state</code> instead of <code>from puffinflow.decorators import state</code></p>
                    </div>
                    <div className="troubleshooting-item">
                        <h4>Context variables not persisting</h4>
                        <p>Solution: Ensure you're using <code>context.set_variable()</code> and <code>context.get_variable()</code> correctly</p>
                    </div>
                </div>

                <style jsx>{`
                    .learning-path-card {
                        padding: 1.5rem;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 0.5rem;
                        background: rgba(255, 255, 255, 0.02);
                    }
                    .troubleshooting-item {
                        padding: 1rem;
                        border-left: 3px solid #fb923c;
                        background: rgba(251, 146, 60, 0.1);
                        border-radius: 0 0.375rem 0.375rem 0;
                    }
                    .troubleshooting-item h4 {
                        margin: 0 0 0.5rem 0;
                        color: #fb923c;
                    }
                    .troubleshooting-item p {
                        margin: 0;
                    }
                `}</style>
            </section>
        </DocsLayout>
    );
};

export const TroubleshootingPage: React.FC = () => {
    const sidebarLinks = [
        { id: 'installation-issues', label: 'Installation Issues' },
        { id: 'runtime-issues', label: 'Runtime Issues' },
        { id: 'performance-issues', label: 'Performance Issues' },
        { id: 'common-error-messages', label: 'Common Error Messages' },
        { id: 'development-and-testing', label: 'Development & Testing' },
        { id: 'production-deployment', label: 'Production Deployment' },
        { id: 'getting-help', label: 'Getting Help' },
        { id: 'advanced-troubleshooting', label: 'Advanced Troubleshooting' },
    ];

    return (
        <DocsLayout sidebarLinks={sidebarLinks} pageMarkdown={troubleshootingMarkdown} currentPage="troubleshooting" pageKey="docs/troubleshooting">
            <section id="troubleshooting">
                <h1>Troubleshooting Guide</h1>
                <p>This guide helps you resolve common issues when working with PuffinFlow. If you don't find your issue here, please check our <a href="https://github.com/m-ahmed-elbeskeri/puffinflow/issues" className="text-orange-400 hover:text-orange-300">GitHub Issues</a> or create a new one.</p>
            </section>

            <section id="installation-issues">
                <h2>Installation Issues</h2>

                <h3>pip install fails</h3>
                <p><strong>Problem:</strong> <InlineCode>pip install puffinflow</InlineCode> fails with dependency conflicts or build errors.</p>
                <p><strong>Solutions:</strong></p>

                <div className="space-y-4 mb-6">
                    <div>
                        <h4>1. Update pip and setuptools:</h4>
                        <CodeWindow language="bash" code={`pip install --upgrade pip setuptools wheel
pip install puffinflow`} fileName="Terminal" />
                    </div>

                    <div>
                        <h4>2. Use virtual environment:</h4>
                        <CodeWindow language="bash" code={`python -m venv puffinflow-env
source puffinflow-env/bin/activate  # On Windows: puffinflow-env\\Scripts\\activate
pip install puffinflow`} fileName="Terminal" />
                    </div>

                    <div>
                        <h4>3. Clear pip cache:</h4>
                        <CodeWindow language="bash" code={`pip cache purge
pip install puffinflow`} fileName="Terminal" />
                    </div>
                </div>

                <h3>Import errors</h3>
                <p><strong>Problem:</strong> <InlineCode>ImportError: cannot import name 'Agent' from 'puffinflow'</InlineCode></p>
                <p><strong>Solutions:</strong></p>

                <div className="space-y-4">
                    <div>
                        <h4>1. Verify installation:</h4>
                        <CodeWindow language="bash" code={`pip show puffinflow
python -c "import puffinflow; print(puffinflow.__version__)"`} fileName="Terminal" />
                    </div>

                    <div>
                        <h4>2. Check Python version compatibility:</h4>
                        <CodeWindow language="bash" code={`python --version  # Should be 3.8+`} fileName="Terminal" />
                    </div>
                </div>
            </section>

            <section id="runtime-issues">
                <h2>Runtime Issues</h2>

                <h3>Agent won't start</h3>
                <p><strong>Problem:</strong> Agent fails to start or hangs during initialization.</p>
                <p><strong>Diagnosis:</strong></p>
                <CodeWindow language="python" code={`import asyncio
import logging
from puffinflow import Agent

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

agent = Agent("debug-agent")

@agent.state
async def test_state(context):
    print("Agent is working!")
    return None

# Test basic functionality
if __name__ == "__main__":
    asyncio.run(agent.run())`} fileName="debug_agent.py" />

                <h3>Context data not persisting</h3>
                <p><strong>Problem:</strong> Data stored in context disappears between states.</p>
                <CodeWindow language="python" code={`async def state_one(context):
    # ✅ Correct - data persists
    context.set_variable("data", {"key": "value"})

    # ❌ Incorrect - local variable, doesn't persist
    local_data = {"key": "value"}

    return "state_two"

async def state_two(context):
    # ✅ This works
    data = context.get_variable("data")

    # ❌ This fails - local_data doesn't exist
    # print(local_data)`} fileName="context_example.py" />
            </section>

            <section id="performance-issues">
                <h2>Performance Issues</h2>

                <h3>Agent running slowly</h3>
                <p><strong>Problem:</strong> Agent operations are slower than expected.</p>
                <p><strong>Solutions:</strong></p>

                <div className="space-y-4">
                    <div>
                        <h4>1. Enable performance monitoring:</h4>
                        <CodeWindow language="python" code={`from puffinflow import Agent
from puffinflow.observability import enable_monitoring

enable_monitoring()
agent = Agent("performance-test")`} fileName="monitoring.py" />
                    </div>

                    <div>
                        <h4>2. Check resource allocation:</h4>
                        <CodeWindow language="python" code={`@agent.state(cpu=2.0, memory=1024)  # Allocate adequate resources
async def resource_intensive_task(context):
    # Your code here
    pass`} fileName="resources.py" />
                    </div>
                </div>
            </section>

            <section id="common-error-messages">
                <h2>Common Error Messages</h2>

                <div className="space-y-6">
                    <div className="error-solution">
                        <h3>"State 'state_name' not found"</h3>
                        <p><strong>Problem:</strong> Agent tries to transition to a non-existent state.</p>
                        <p><strong>Solution:</strong></p>
                        <CodeWindow language="python" code={`# ✅ Ensure state is registered
agent.add_state("target_state", target_function)

async def source_state(context):
    # ✅ Return registered state name
    return "target_state"

    # ❌ Don't return unregistered state names
    # return "nonexistent_state"`} fileName="state_registration.py" />
                    </div>

                    <div className="error-solution">
                        <h3>"Context variable 'key' not found"</h3>
                        <p><strong>Problem:</strong> Trying to access a variable that doesn't exist.</p>
                        <p><strong>Solution:</strong></p>
                        <CodeWindow language="python" code={`async def safe_access(context):
    # ✅ Use get_variable with default
    value = context.get_variable("key", "default_value")

    # ✅ Check if variable exists
    if context.has_variable("key"):
        value = context.get_variable("key")

    # ❌ Direct access without checking
    # value = context.get_variable("key")  # May raise KeyError`} fileName="safe_context.py" />
                    </div>

                    <div className="error-solution">
                        <h3>"Resource allocation failed"</h3>
                        <p><strong>Problem:</strong> Insufficient resources available for state execution.</p>
                        <p><strong>Solutions:</strong></p>
                        <CodeWindow language="python" code={`# 1. Reduce resource requirements
@agent.state(cpu=1.0, memory=512)  # Reduce from higher values
async def lightweight_task(context):
    pass

# 2. Use priority scheduling
from puffinflow import Priority

@agent.state(priority=Priority.HIGH)
async def important_task(context):
    pass

# 3. Implement backoff and retry
@agent.state(max_retries=3, retry_delay=1.0)
async def retry_on_resource_failure(context):
    pass`} fileName="resource_solutions.py" />
                    </div>
                </div>
            </section>

            <section id="development-and-testing">
                <h2>Development and Testing</h2>

                <h3>Testing agent workflows</h3>
                <p><strong>Problem:</strong> How to test agent workflows effectively.</p>
                <p><strong>Solution:</strong></p>
                <CodeWindow language="python" code={`import pytest
from puffinflow import Agent

@pytest.mark.asyncio
async def test_agent_workflow():
    agent = Agent("test-agent")

    @agent.state
    async def test_state(context):
        context.set_variable("test_result", "success")
        return None

    # Run agent with test data
    result = await agent.run(
        initial_context={"input": "test_data"}
    )

    # Assert expected outcomes
    assert result.get_variable("test_result") == "success"`} fileName="test_example.py" />

                <h3>Debugging state transitions</h3>
                <p><strong>Problem:</strong> Hard to track state transitions during development.</p>
                <p><strong>Solution:</strong></p>
                <CodeWindow language="python" code={`import logging
from puffinflow import Agent

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

agent = Agent("debug-agent")

@agent.state
async def debug_state(context):
    logger.debug(f"Executing state with context: {context.get_all_variables()}")

    # Your state logic
    result = await some_operation()

    logger.debug(f"State result: {result}")
    return "next_state"`} fileName="debug_example.py" />
            </section>

            <section id="production-deployment">
                <h2>Production Deployment</h2>

                <h3>Agent performance in production</h3>
                <p><strong>Problem:</strong> Agent performs differently in production vs development.</p>
                <p><strong>Production checklist:</strong></p>

                <div className="space-y-4">
                    <div>
                        <h4>1. Use production-ready configuration:</h4>
                        <CodeWindow language="python" code={`from puffinflow import Agent
from puffinflow.observability import configure_monitoring

# Configure for production
configure_monitoring(
    enable_metrics=True,
    enable_tracing=True,
    sample_rate=0.1  # 10% sampling to reduce overhead
)

agent = Agent("production-agent")`} fileName="production_config.py" />
                    </div>

                    <div>
                        <h4>2. Implement proper error handling:</h4>
                        <CodeWindow language="python" code={`@agent.state(max_retries=3, timeout=30.0)
async def production_state(context):
    try:
        result = await external_api_call()
        context.set_variable("result", result)
    except Exception as e:
        logger.error(f"Production error: {e}")
        context.set_variable("error", str(e))
        return "error_handler"`} fileName="production_error_handling.py" />
                    </div>
                </div>
            </section>

            <section id="getting-help">
                <h2>Getting Help</h2>

                <h3>Community resources</h3>
                <ul>
                    <li><strong><a href="https://github.com/m-ahmed-elbeskeri/puffinflow/issues" className="text-orange-400 hover:text-orange-300">GitHub Issues</a></strong> — Report bugs and request features</li>
                    <li><strong><a href="https://github.com/m-ahmed-elbeskeri/puffinflow/discussions" className="text-orange-400 hover:text-orange-300">Discussions</a></strong> — Ask questions and share experiences</li>
                    <li><strong><a href="https://puffinflow.readthedocs.io/" className="text-orange-400 hover:text-orange-300">Documentation</a></strong> — Complete guides and API reference</li>
                </ul>

                <h3>Creating effective bug reports</h3>
                <p>When reporting issues, include:</p>
                <ol>
                    <li><strong>PuffinFlow version</strong>: <InlineCode>pip show puffinflow</InlineCode></li>
                    <li><strong>Python version</strong>: <InlineCode>python --version</InlineCode></li>
                    <li><strong>Operating system</strong>: Windows/macOS/Linux</li>
                    <li><strong>Minimal reproduction code</strong></li>
                    <li><strong>Expected vs actual behavior</strong></li>
                    <li><strong>Error messages and stack traces</strong></li>
                </ol>
            </section>

            <section id="advanced-troubleshooting">
                <h2>Advanced Troubleshooting</h2>

                <h3>Debugging async issues</h3>
                <p><strong>Problem:</strong> Complex async behavior causing issues.</p>
                <CodeWindow language="python" code={`import asyncio
import traceback

async def debug_async_issue():
    try:
        # Your async code
        await problematic_function()
    except Exception as e:
        # Print full stack trace
        traceback.print_exc()

        # Get event loop info
        loop = asyncio.get_event_loop()
        print(f"Event loop: {loop}")
        print(f"Running: {loop.is_running()}")

        # Check for pending tasks
        tasks = asyncio.all_tasks(loop)
        print(f"Pending tasks: {len(tasks)}")
        for task in tasks:
            print(f"  {task}")`} fileName="async_debugging.py" />

                <h3>Performance profiling</h3>
                <p><strong>Problem:</strong> Need to identify performance bottlenecks.</p>
                <CodeWindow language="python" code={`import cProfile
import pstats
import asyncio

def profile_agent():
    profiler = cProfile.Profile()
    profiler.enable()

    # Run your agent
    asyncio.run(agent.run())

    profiler.disable()

    # Analyze results
    stats = pstats.Stats(profiler)
    stats.sort_stats('cumulative')
    stats.print_stats(20)  # Top 20 functions`} fileName="profiling.py" />
            </section>
        </DocsLayout>
    );
};

export const APIReferencePage: React.FC = () => {
    const sidebarLinks = [
        { id: 'core-classes', label: 'Core Classes' },
        { id: 'agent', label: 'Agent' },
        { id: 'context', label: 'Context' },
        { id: 'decorators', label: 'Decorators' },
        { id: 'enums-and-constants', label: 'Enums & Constants' },
        { id: 'coordination', label: 'Coordination' },
        { id: 'observability', label: 'Observability' },
        { id: 'configuration', label: 'Configuration' },
        { id: 'error-handling', label: 'Error Handling' },
        { id: 'utilities', label: 'Utilities' },
        { id: 'type-hints', label: 'Type Hints' },
    ];

    return (
        <DocsLayout sidebarLinks={sidebarLinks} pageMarkdown={apiReferenceMarkdown} currentPage="api-reference" pageKey="docs/api-reference">
            <section id="api-reference">
                <h1>API Reference</h1>
                <p>Complete reference for all PuffinFlow classes, methods, and functions.</p>
            </section>

            <section id="core-classes">
                <h2>Core Classes</h2>

                <h3 id="agent">Agent</h3>
                <p>The main class for creating and managing workflow agents.</p>

                <CodeWindow language="python" code={`from puffinflow import Agent

class Agent:
    def __init__(self, name: str, config: Optional[AgentConfig] = None)`} fileName="agent_signature.py" />

                <p><strong>Parameters:</strong></p>
                <ul>
                    <li><InlineCode>name</InlineCode> (str): Unique identifier for the agent</li>
                    <li><InlineCode>config</InlineCode> (AgentConfig, optional): Configuration settings</li>
                </ul>

                <h4>Methods</h4>

                <div className="mb-6">
                    <h5><InlineCode>add_state(name: str, func: Callable, dependencies: Optional[List[str]] = None) → None</InlineCode></h5>
                    <p>Registers a state function with the agent.</p>
                    <CodeWindow language="python" code={`async def my_state(context):
    return "next_state"

agent.add_state("my_state", my_state)
agent.add_state("dependent_state", other_func, dependencies=["my_state"])`} fileName="add_state_example.py" />
                </div>

                <div className="mb-6">
                    <h5><InlineCode>run(initial_context: Optional[Dict] = None) → Context</InlineCode></h5>
                    <p>Executes the agent workflow.</p>
                    <CodeWindow language="python" code={`result = await agent.run(initial_context={"input": "data"})
output = result.get_variable("output")`} fileName="run_example.py" />
                </div>

                <div className="mb-6">
                    <h5><InlineCode>state(func: Optional[Callable] = None, **kwargs) → Callable</InlineCode></h5>
                    <p>Decorator to register state functions directly.</p>
                    <CodeWindow language="python" code={`@agent.state(cpu=2.0, memory=1024)
async def my_state(context):
    return "next_state"`} fileName="state_decorator_example.py" />
                </div>
            </section>

            <section id="context">
                <h2>Context</h2>
                <p>Provides data sharing and state management across workflow states.</p>

                <CodeWindow language="python" code={`class Context:
    def __init__(self, workflow_id: str, initial_data: Optional[Dict] = None)`} fileName="context_signature.py" />

                <p><strong>Properties:</strong></p>
                <ul>
                    <li><InlineCode>workflow_id</InlineCode> (str): Unique workflow identifier</li>
                    <li><InlineCode>execution_id</InlineCode> (str): Unique execution identifier</li>
                </ul>

                <h3>Variable Management</h3>

                <div className="mb-6">
                    <h4><InlineCode>set_variable(key: str, value: Any) → None</InlineCode></h4>
                    <p>Stores a variable in the context.</p>
                    <CodeWindow language="python" code={`context.set_variable("user_data", {"id": 123, "name": "Alice"})`} fileName="set_variable_example.py" />
                </div>

                <div className="mb-6">
                    <h4><InlineCode>get_variable(key: str, default: Any = None) → Any</InlineCode></h4>
                    <p>Retrieves a variable from the context.</p>
                    <CodeWindow language="python" code={`user_data = context.get_variable("user_data")
safe_value = context.get_variable("optional_key", "default_value")`} fileName="get_variable_example.py" />
                </div>

                <div className="mb-6">
                    <h4><InlineCode>has_variable(key: str) → bool</InlineCode></h4>
                    <p>Checks if a variable exists in the context.</p>
                    <CodeWindow language="python" code={`if context.has_variable("user_data"):
    user_data = context.get_variable("user_data")`} fileName="has_variable_example.py" />
                </div>

                <h3>Type-Safe Variables</h3>

                <div className="mb-6">
                    <h4><InlineCode>set_typed_variable(key: str, value: T) → None</InlineCode></h4>
                    <p>Stores a type-locked variable.</p>
                    <CodeWindow language="python" code={`context.set_typed_variable("user_count", 100)      # Locked to int
context.set_typed_variable("avg_score", 85.5)      # Locked to float`} fileName="typed_variable_example.py" />
                </div>

                <h3>Validated Data</h3>

                <div className="mb-6">
                    <h4><InlineCode>set_validated_data(key: str, value: BaseModel) → None</InlineCode></h4>
                    <p>Stores Pydantic model data with validation.</p>
                    <CodeWindow language="python" code={`from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str

user = User(id=123, name="Alice", email="alice@example.com")
context.set_validated_data("user", user)`} fileName="validated_data_example.py" />
                </div>

                <h3>Constants and Secrets</h3>

                <div className="mb-6">
                    <h4><InlineCode>set_constant(key: str, value: Any) → None</InlineCode></h4>
                    <p>Stores an immutable constant.</p>
                    <CodeWindow language="python" code={`context.set_constant("api_url", "https://api.example.com")
context.set_constant("max_retries", 3)`} fileName="constant_example.py" />
                </div>

                <div className="mb-6">
                    <h4><InlineCode>set_secret(key: str, value: str) → None</InlineCode></h4>
                    <p>Stores sensitive data securely.</p>
                    <CodeWindow language="python" code={`context.set_secret("api_key", os.getenv("API_KEY"))
api_key = context.get_secret("api_key")`} fileName="secret_example.py" />
                </div>

                <h3>Cached Data</h3>

                <div className="mb-6">
                    <h4><InlineCode>set_cached(key: str, value: Any, ttl: float) → None</InlineCode></h4>
                    <p>Stores data with time-to-live expiration.</p>
                    <CodeWindow language="python" code={`context.set_cached("temp_results", data, ttl=300)  # 5 minutes
cached_data = context.get_cached("temp_results", default=[])`} fileName="cached_example.py" />
                </div>
            </section>

            <section id="decorators">
                <h2>Decorators</h2>

                <h3>@state</h3>
                <p>Decorator for configuring state functions with resource management and behavior options.</p>

                <CodeWindow language="python" code={`from puffinflow import state

@state(
    cpu: float = 1.0,
    memory: int = 512,
    gpu: float = 0.0,
    io: float = 1.0,
    priority: Priority = Priority.NORMAL,
    timeout: float = 300.0,
    max_retries: int = 0,
    retry_delay: float = 1.0,
    rate_limit: float = 0.0,
    burst_limit: int = 0,
    preemptible: bool = False
)
async def my_state(context: Context) -> Optional[Union[str, List[str]]]`} fileName="state_decorator.py" />

                <p><strong>Parameters:</strong></p>

                <h4>Resource Allocation</h4>
                <ul>
                    <li><InlineCode>cpu</InlineCode> (float): CPU units to allocate (default: 1.0)</li>
                    <li><InlineCode>memory</InlineCode> (int): Memory in MB to allocate (default: 512)</li>
                    <li><InlineCode>gpu</InlineCode> (float): GPU units to allocate (default: 0.0)</li>
                    <li><InlineCode>io</InlineCode> (float): I/O bandwidth units (default: 1.0)</li>
                </ul>

                <h4>Execution Control</h4>
                <ul>
                    <li><InlineCode>priority</InlineCode> (Priority): Execution priority (default: Priority.NORMAL)</li>
                    <li><InlineCode>timeout</InlineCode> (float): Maximum execution time in seconds (default: 300.0)</li>
                    <li><InlineCode>preemptible</InlineCode> (bool): Allow preemption for higher priority tasks (default: False)</li>
                </ul>

                <h4>Retry Configuration</h4>
                <ul>
                    <li><InlineCode>max_retries</InlineCode> (int): Maximum retry attempts (default: 0)</li>
                    <li><InlineCode>retry_delay</InlineCode> (float): Delay between retries in seconds (default: 1.0)</li>
                </ul>

                <h4>Rate Limiting</h4>
                <ul>
                    <li><InlineCode>rate_limit</InlineCode> (float): Operations per second limit (default: 0.0 = no limit)</li>
                    <li><InlineCode>burst_limit</InlineCode> (int): Burst capacity above rate limit (default: 0)</li>
                </ul>

                <CodeWindow language="python" code={`@state(
    cpu=2.0,
    memory=1024,
    priority=Priority.HIGH,
    max_retries=3,
    timeout=60.0
)
async def important_task(context):
    # High-priority task with retries
    result = await critical_operation()
    context.set_variable("result", result)
    return "next_state"`} fileName="state_example.py" />
            </section>

            <section id="enums-and-constants">
                <h2>Enums and Constants</h2>

                <h3>Priority</h3>
                <p>Defines execution priority levels for states.</p>

                <CodeWindow language="python" code={`from puffinflow import Priority

class Priority(Enum):
    CRITICAL = 5
    HIGH = 4
    NORMAL = 3
    LOW = 2
    BACKGROUND = 1`} fileName="priority_enum.py" />

                <CodeWindow language="python" code={`@state(priority=Priority.HIGH)
async def high_priority_state(context):
    pass`} fileName="priority_usage.py" />
            </section>

            <section id="coordination">
                <h2>Coordination</h2>

                <h3>AgentTeam</h3>
                <p>Manages coordinated execution of multiple agents.</p>

                <CodeWindow language="python" code={`from puffinflow import AgentTeam

class AgentTeam:
    def __init__(self, agents: List[Agent], name: str = "team")`} fileName="agent_team.py" />

                <h4>Methods</h4>

                <div className="mb-6">
                    <h5><InlineCode>execute_parallel() → Dict[str, Context]</InlineCode></h5>
                    <p>Executes all agents in parallel.</p>
                    <CodeWindow language="python" code={`from puffinflow import Agent, AgentTeam

agent1 = Agent("worker1")
agent2 = Agent("worker2")

team = AgentTeam([agent1, agent2], name="processing_team")
results = await team.execute_parallel()`} fileName="team_parallel.py" />
                </div>

                <div className="mb-6">
                    <h5><InlineCode>execute_sequential() → List[Context]</InlineCode></h5>
                    <p>Executes agents one after another.</p>
                    <CodeWindow language="python" code={`results = await team.execute_sequential()`} fileName="team_sequential.py" />
                </div>

                <h3>AgentPool</h3>
                <p>Manages a pool of identical agents for load balancing.</p>

                <CodeWindow language="python" code={`from puffinflow import AgentPool

class AgentPool:
    def __init__(self, agent_factory: Callable[[], Agent], size: int = 5)`} fileName="agent_pool.py" />

                <div className="mb-6">
                    <h5><InlineCode>submit_task(initial_context: Dict) → Awaitable[Context]</InlineCode></h5>
                    <p>Submits a task to the next available agent.</p>
                    <CodeWindow language="python" code={`def create_worker():
    agent = Agent("worker")

    @agent.state
    async def process_task(context):
        data = context.get_variable("task_data")
        result = await process_data(data)
        context.set_variable("result", result)
        return None

    return agent

pool = AgentPool(create_worker, size=10)
result = await pool.submit_task({"task_data": "work_item"})`} fileName="pool_usage.py" />
                </div>
            </section>

            <section id="observability">
                <h2>Observability</h2>

                <h3>MetricsCollector</h3>
                <p>Collects and tracks performance metrics.</p>

                <CodeWindow language="python" code={`from puffinflow.observability import MetricsCollector

class MetricsCollector:
    def __init__(self, namespace: str = "puffinflow")`} fileName="metrics_collector.py" />

                <h4>Methods</h4>

                <div className="mb-6">
                    <h5><InlineCode>increment(metric_name: str, value: float = 1.0, tags: Optional[Dict] = None) → None</InlineCode></h5>
                    <p>Increments a counter metric.</p>
                </div>

                <div className="mb-6">
                    <h5><InlineCode>gauge(metric_name: str, value: float, tags: Optional[Dict] = None) → None</InlineCode></h5>
                    <p>Sets a gauge metric value.</p>
                </div>

                <div className="mb-6">
                    <h5><InlineCode>timer(metric_name: str, tags: Optional[Dict] = None) → ContextManager</InlineCode></h5>
                    <p>Context manager for timing operations.</p>
                    <CodeWindow language="python" code={`metrics = MetricsCollector()

@state
async def monitored_state(context):
    metrics.increment("state_executions")

    with metrics.timer("processing_time"):
        result = await process_data()

    metrics.gauge("result_size", len(result))
    return "next_state"`} fileName="metrics_usage.py" />
                </div>
            </section>

            <section id="configuration">
                <h2>Configuration</h2>

                <h3>AgentConfig</h3>
                <p>Configuration settings for agent behavior.</p>

                <CodeWindow language="python" code={`from puffinflow import AgentConfig

class AgentConfig:
    def __init__(
        self,
        max_concurrent_states: int = 10,
        default_timeout: float = 300.0,
        enable_checkpointing: bool = True,
        checkpoint_interval: float = 30.0,
        enable_metrics: bool = True,
        enable_tracing: bool = False,
        log_level: str = "INFO"
    )`} fileName="agent_config.py" />

                <CodeWindow language="python" code={`config = AgentConfig(
    max_concurrent_states=20,
    default_timeout=600.0,
    enable_checkpointing=True,
    enable_metrics=True
)

agent = Agent("configured_agent", config=config)`} fileName="config_usage.py" />
            </section>

            <section id="error-handling">
                <h2>Error Handling</h2>

                <h3>Common Exceptions</h3>

                <div className="mb-6">
                    <h4>StateExecutionError</h4>
                    <p>Raised when state execution fails.</p>
                    <CodeWindow language="python" code={`from puffinflow.exceptions import StateExecutionError

try:
    await agent.run()
except StateExecutionError as e:
    print(f"State '{e.state_name}' failed: {e.message}")`} fileName="state_execution_error.py" />
                </div>

                <div className="mb-6">
                    <h4>ResourceAllocationError</h4>
                    <p>Raised when resource allocation fails.</p>
                    <CodeWindow language="python" code={`from puffinflow.exceptions import ResourceAllocationError

try:
    await agent.run()
except ResourceAllocationError as e:
    print(f"Resource allocation failed: {e.message}")`} fileName="resource_allocation_error.py" />
                </div>

                <div className="mb-6">
                    <h4>ContextVariableError</h4>
                    <p>Raised when context variable operations fail.</p>
                    <CodeWindow language="python" code={`from puffinflow.exceptions import ContextVariableError

try:
    value = context.get_variable("nonexistent_key")
except ContextVariableError as e:
    print(f"Context error: {e.message}")`} fileName="context_variable_error.py" />
                </div>
            </section>

            <section id="utilities">
                <h2>Utilities</h2>

                <h3>Checkpoint Management</h3>

                <div className="mb-6">
                    <h4><InlineCode>save_checkpoint(context: Context, filepath: str) → None</InlineCode></h4>
                    <p>Saves workflow state to file.</p>
                </div>

                <div className="mb-6">
                    <h4><InlineCode>load_checkpoint(filepath: str) → Context</InlineCode></h4>
                    <p>Loads workflow state from file.</p>
                    <CodeWindow language="python" code={`from puffinflow.utils import save_checkpoint, load_checkpoint

# Save checkpoint
save_checkpoint(context, "workflow_checkpoint.json")

# Load checkpoint
restored_context = load_checkpoint("workflow_checkpoint.json")`} fileName="checkpoint_utils.py" />
                </div>
            </section>

            <section id="type-hints">
                <h2>Type Hints</h2>
                <p>Complete type definitions for better IDE support:</p>

                <CodeWindow language="python" code={`from typing import Any, Dict, List, Optional, Union, Callable, Awaitable
from puffinflow import Context, Agent, Priority

# State function signature
StateFunction = Callable[[Context], Awaitable[Optional[Union[str, List[str]]]]]

# Agent factory signature
AgentFactory = Callable[[], Agent]

# Context data types
ContextData = Dict[str, Any]
StateResult = Optional[Union[str, List[str]]]`} fileName="type_hints.py" />
            </section>
        </DocsLayout>
    );
};


export const DeploymentPage: React.FC = () => {
    return (
        <DocsLayout
            sidebarLinks={[
                { id: "overview", label: "Overview" },
                { id: "local-development-setup", label: "Local Development" },
                { id: "containerization-with-docker", label: "Containerization" },
                { id: "production-ready-application-structure", label: "Production Structure" },
                { id: "cloud-platform-deployment", label: "Cloud Deployment" },
                { id: "vercel-deployment-for-web-applications", label: "Vercel Deployment" },
                { id: "environment-specific-configurations", label: "Environment Configs" },
                { id: "cicd-pipeline", label: "CI/CD Pipeline" },
                { id: "monitoring-and-logging", label: "Monitoring" },
                { id: "security-best-practices", label: "Security" },
                { id: "troubleshooting-common-issues", label: "Troubleshooting" },
                { id: "production-checklist", label: "Production Checklist" },
            ]}
            pageMarkdown={deploymentMarkdown}
            currentPage="deployment"
            pageKey="docs/deployment"
        >
            <section id="overview">
                <h2>Overview</h2>
                <p>Learn how to deploy your Puffinflow applications to production with containerization, cloud platforms, and CI/CD pipelines.</p>
            </section>
        </DocsLayout>
    );
};
