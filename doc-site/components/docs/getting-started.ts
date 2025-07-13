export const gettingStartedMarkdown = `# Getting Started with Puffinflow

Welcome to **Puffinflow** - the modern Python framework for building reliable, scalable workflows and multi-agent systems! Whether you're orchestrating microservices, building AI pipelines, or managing complex data processing workflows, Puffinflow makes it simple and robust.

## Why Puffinflow?

- **⚡ Simple**: Start with 3 lines of code, scale to production
- **🔄 Reliable**: Built-in retries, circuit breakers, and error handling
- **📊 Observable**: Complete monitoring, metrics, and tracing out of the box
- **⚖️ Scalable**: Resource management, rate limiting, and coordination primitives
- **🤖 AI-Ready**: Perfect for LLM workflows, RAG systems, and agent orchestration

## Prerequisites

- **Python 3.9+** (3.9, 3.10, 3.11, 3.12, 3.13 supported)
- Basic familiarity with \`async/await\` in Python
- 5 minutes to get your first workflow running! ⏱️

## Quick Installation

\`\`\`bash
pip install puffinflow
\`\`\`

## Your First Workflow

Create a complete workflow in just **3 simple steps**:

\`\`\`python
import asyncio
from puffinflow import Agent

# 1. Create an agent
agent = Agent("my-first-workflow")

# 2. Define a state (just a regular async function)
async def hello_world(context):
    print("Hello, Puffinflow! 🐧")
    print(f"Agent name: {agent.name}")
    context.set_variable("greeting", "Hello from PuffinFlow!")
    return None

# 3. Add state and run it
agent.add_state("hello_world", hello_world)

async def main():
    result = await agent.run()
    print(f"Result: {result.get_variable('greeting')}")

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

**Output:**
\`\`\`
Hello, Puffinflow! 🐧
Agent name: my-first-workflow
Result: Hello from PuffinFlow!
\`\`\`

🎉 **Congratulations!** You just ran your first Puffinflow workflow!

## Core Concepts

Before diving deeper, let's understand the key concepts:

### 🏗️ **Agent**: Your Workflow Container
An Agent is like a container that holds and executes your workflow states. Think of it as your workflow's "brain" that coordinates everything.

### 🎯 **State**: Individual Steps  
States are async functions that represent individual steps in your workflow. They receive a \`context\` parameter to share data and can return the next state to run.

### 📦 **Context**: Shared Memory
The context is how states communicate - it's like a shared memory space where you can store and retrieve variables throughout your workflow.

## Two Ways to Define States

For simple workflows, both approaches work identically:

### Plain Functions (Start Here!)
\`\`\`python
async def process_data(context):
    context.set_variable("result", "Hello!")
    return None  # Continue to next state, or end workflow
\`\`\`

### With Decorator (For Production Features)
\`\`\`python
from puffinflow import state

@state(cpu=2.0, memory=1024, timeout=30.0, max_retries=3)
async def process_data(context):
    context.set_variable("result", "Hello!")
    return None
\`\`\`

> **When to use decorators?** Start with plain functions. Add the \`@state\` decorator when you need resource limits, timeouts, retries, or priority control. Perfect for production workloads!

## Sharing Data Between States

The **context** is how states communicate with each other. Think of it as a shared memory that persists throughout your workflow:

\`\`\`python
import asyncio
from puffinflow import Agent

agent = Agent("data-pipeline")

async def fetch_data(context):
    # Simulate fetching data from an API
    print("📊 Fetching user data...")
    
    # Store data in context - available to all future states
    context.set_variable("user_count", 1250)
    context.set_variable("revenue", 45000)
    print("✅ Data fetched successfully")

async def calculate_metrics(context):
    # Get data from previous state
    users = context.get_variable("user_count")
    revenue = context.get_variable("revenue")
    
    # Calculate and store result
    revenue_per_user = revenue / users
    context.set_variable("revenue_per_user", revenue_per_user)
    
    print(f"💰 Revenue per user: \${revenue_per_user:.2f}")
    print("✅ Metrics calculated")

async def send_report(context):
    # Use the calculated metric
    rpu = context.get_variable("revenue_per_user")
    user_count = context.get_variable("user_count")
    
    print(f"📧 Sending report: {user_count} users, RPU is \${rpu:.2f}")
    context.set_variable("report_sent", True)
    print("✅ Report sent!")

# Add states to workflow - they'll run sequentially by default
agent.add_state("fetch_data", fetch_data)
agent.add_state("calculate_metrics", calculate_metrics, dependencies=["fetch_data"])
agent.add_state("send_report", send_report, dependencies=["calculate_metrics"])

# Run the complete pipeline
async def main():
    result = await agent.run()
    print(f"\\nWorkflow completed! Report sent: {result.get_variable('report_sent')}")

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

**Output:**
\`\`\`
📊 Fetching user data...
✅ Data fetched successfully
💰 Revenue per user: $36.00
✅ Metrics calculated
📧 Sending report: 1250 users, RPU is $36.00
✅ Report sent!

Workflow completed! Report sent: True
\`\`\`

### 💡 Context Methods You'll Use Most

\`\`\`python
# Store any Python object
context.set_variable("user_data", {"name": "Alice", "age": 30})
context.set_variable("score", 95.5)
context.set_variable("items", [1, 2, 3, 4, 5])

# Retrieve with optional defaults
user_data = context.get_variable("user_data")
score = context.get_variable("score", 0.0)  # Default to 0.0 if not found
missing = context.get_variable("nonexistent", "default_value")
\`\`\`

## Workflow Control: Make It Smart

Puffinflow gives you powerful ways to control how your workflow executes. Let's see the most practical patterns:

### 1. 🔗 Dependencies: "Wait for X before doing Y"

Use dependencies when some states need others to complete first:

\`\`\`python
agent = Agent("smart-workflow")

async def fetch_user_data(context):
    print("👥 Fetching users...")
    await asyncio.sleep(0.5)  # Simulate API call
    context.set_variable("users", ["Alice", "Bob", "Charlie"])

async def fetch_sales_data(context):
    print("💰 Fetching sales...")
    await asyncio.sleep(0.3)  # Simulate API call  
    context.set_variable("sales", [100, 200, 150])

async def generate_report(context):
    # This waits for BOTH fetch operations to complete
    users = context.get_variable("users")
    sales = context.get_variable("sales")
    
    print(f"📊 Report: {len(users)} users, {sum(sales)} total sales")
    context.set_variable("report", "Generated!")

# fetch_user_data and fetch_sales_data run in PARALLEL
# generate_report waits for BOTH to complete
agent.add_state("fetch_user_data", fetch_user_data)
agent.add_state("fetch_sales_data", fetch_sales_data)
agent.add_state("generate_report", generate_report, 
               dependencies=["fetch_user_data", "fetch_sales_data"])

# Runs: fetch_user_data + fetch_sales_data → generate_report
\`\`\`

### 2. 🤔 Dynamic Routing: "Decide what to do next"

Return state names to dynamically route your workflow:

\`\`\`python
agent = Agent("smart-routing")

async def check_user_type(context):
    # Could come from database, API, etc.
    user_type = context.get_variable("user_type", "basic")
    print(f"🔍 User type: {user_type}")
    
    # Dynamic routing based on data
    if user_type == "premium":
        return "premium_workflow"
    elif user_type == "enterprise":
        return "enterprise_workflow" 
    else:
        return "basic_workflow"

async def premium_workflow(context):
    print("⭐ Premium features enabled")
    context.set_variable("features", ["advanced_analytics", "priority_support", "custom_reports"])
    return "send_welcome"

async def enterprise_workflow(context):
    print("🏢 Enterprise features enabled")
    context.set_variable("features", ["all_premium", "dedicated_support", "custom_integrations"])
    return "send_welcome"

async def basic_workflow(context):
    print("👋 Basic features enabled")
    context.set_variable("features", ["basic_analytics"])
    return "send_welcome"

async def send_welcome(context):
    features = context.get_variable("features")
    print(f"✉️ Welcome! Your features: {', '.join(features)}")

# Only check_user_type runs first, then routing happens
agent.add_state("check_user_type", check_user_type)
agent.add_state("premium_workflow", premium_workflow)
agent.add_state("enterprise_workflow", enterprise_workflow) 
agent.add_state("basic_workflow", basic_workflow)
agent.add_state("send_welcome", send_welcome)

# Set user type before running
agent.set_variable("user_type", "premium")
\`\`\`

### 3. ⚡ Parallel Execution: "Do multiple things at once"

Return a list of state names to run multiple states simultaneously:

\`\`\`python
agent = Agent("parallel-processing")

async def process_order(context):
    print("📦 Processing order...")
    order_id = "ORD-123"
    context.set_variable("order_id", order_id)
    
    # Run these three states in parallel - much faster!
    return ["send_confirmation", "update_inventory", "charge_payment"]

async def send_confirmation(context):
    order_id = context.get_variable("order_id")
    print(f"📧 Confirmation sent for {order_id}")
    context.set_variable("confirmation_sent", True)

async def update_inventory(context):
    print("📋 Inventory updated")
    context.set_variable("inventory_updated", True)

async def charge_payment(context):
    order_id = context.get_variable("order_id")
    print(f"💳 Payment processed for {order_id}")
    context.set_variable("payment_charged", True)

agent.add_state("process_order", process_order)
agent.add_state("send_confirmation", send_confirmation)
agent.add_state("update_inventory", update_inventory)
agent.add_state("charge_payment", charge_payment)

# Runs: process_order → [send_confirmation + update_inventory + charge_payment]
\`\`\`

### 🎯 Quick Reference: Return Values

\`\`\`python
async def my_state(context):
    # Control what happens next:
    return None                    # End workflow OR continue to next state
    return "next_state"           # Jump to specific state
    return ["state1", "state2"]   # Run multiple states in parallel
\`\`\`

## 🚀 Real-World Example: Complete ETL Pipeline

Let's build a realistic data processing pipeline that you might use in production:

\`\`\`python
import asyncio
import json
from typing import Dict, List
from puffinflow import Agent, state

# Create our ETL pipeline agent
etl_pipeline = Agent("production-etl")

async def extract_data(context):
    """Extract data from multiple sources."""
    print("🔌 Extracting data from sources...")
    
    # Simulate extracting from different sources
    user_data = [
        {"id": 1, "name": "Alice", "email": "alice@example.com", "purchases": 5},
        {"id": 2, "name": "Bob", "email": "bob@example.com", "purchases": 3},
        {"id": 3, "name": "Charlie", "email": "charlie@example.com", "purchases": 8}
    ]
    
    sales_data = [
        {"user_id": 1, "amount": 120.50, "product": "Widget A"},
        {"user_id": 2, "amount": 75.25, "product": "Widget B"},
        {"user_id": 1, "amount": 200.00, "product": "Widget C"},
        {"user_id": 3, "amount": 99.99, "product": "Widget A"}
    ]
    
    # Store extracted data
    context.set_variable("user_data", user_data)
    context.set_variable("sales_data", sales_data)
    
    print(f"✅ Extracted {len(user_data)} users and {len(sales_data)} sales records")

@state(cpu=2.0, memory=1024)  # This transformation needs more resources
async def transform_data(context):
    """Transform and enrich the data."""
    print("🔄 Transforming data...")
    
    users = context.get_variable("user_data")
    sales = context.get_variable("sales_data")
    
    # Transform: Calculate total revenue per user
    user_revenue = {}
    for sale in sales:
        user_id = sale["user_id"]
        user_revenue[user_id] = user_revenue.get(user_id, 0) + sale["amount"]
    
    # Enrich: Combine user data with their revenue
    enriched_users = []
    for user in users:
        enriched_user = {
            **user,
            "total_revenue": user_revenue.get(user["id"], 0),
            "avg_purchase_value": user_revenue.get(user["id"], 0) / max(user["purchases"], 1)
        }
        enriched_users.append(enriched_user)
    
    # Calculate summary metrics
    summary = {
        "total_users": len(enriched_users),
        "total_revenue": sum(user_revenue.values()),
        "avg_revenue_per_user": sum(user_revenue.values()) / len(enriched_users),
        "top_customer": max(enriched_users, key=lambda x: x["total_revenue"])["name"]
    }
    
    context.set_variable("enriched_users", enriched_users)
    context.set_variable("summary_metrics", summary)
    
    print(f"✅ Transformed data: {summary['total_users']} users, \${summary['total_revenue']:.2f} total revenue")

async def validate_data(context):
    """Validate the transformed data meets quality standards."""
    print("🔍 Validating data quality...")
    
    enriched_users = context.get_variable("enriched_users")
    
    # Quality checks
    issues = []
    
    for user in enriched_users:
        if not user.get("email") or "@" not in user["email"]:
            issues.append(f"Invalid email for user {user['name']}")
        
        if user["total_revenue"] < 0:
            issues.append(f"Negative revenue for user {user['name']}")
    
    if issues:
        print(f"❌ Data quality issues found: {issues}")
        context.set_variable("validation_errors", issues)
        return "handle_errors"
    
    context.set_variable("data_validated", True)
    print("✅ Data validation passed!")
    return "load_data"

async def load_data(context):
    """Load data to destination (database, warehouse, etc.)."""
    print("💾 Loading data to destination...")
    
    enriched_users = context.get_variable("enriched_users")
    summary = context.get_variable("summary_metrics")
    
    # Simulate loading to database/data warehouse
    # In real life, this would connect to your actual data store
    print(f"Saving {len(enriched_users)} enriched user records...")
    print(f"Saving summary metrics: {summary}")
    
    context.set_variable("load_completed", True)
    context.set_variable("records_loaded", len(enriched_users))
    
    print("✅ Data loading completed successfully!")

async def handle_errors(context):
    """Handle any data quality issues."""
    errors = context.get_variable("validation_errors", [])
    print(f"🚨 Handling {len(errors)} data quality issues:")
    
    for error in errors:
        print(f"  - {error}")
    
    # In production, you might:
    # - Send alerts to data team
    # - Log to monitoring system  
    # - Attempt data repair
    # - Skip problematic records
    
    context.set_variable("errors_handled", True)
    print("⚠️ Error handling completed")

# Wire up the ETL pipeline
etl_pipeline.add_state("extract_data", extract_data)
etl_pipeline.add_state("transform_data", transform_data, dependencies=["extract_data"])
etl_pipeline.add_state("validate_data", validate_data, dependencies=["transform_data"])
etl_pipeline.add_state("load_data", load_data)
etl_pipeline.add_state("handle_errors", handle_errors)

async def run_etl():
    """Run the complete ETL pipeline."""
    print("🚀 Starting ETL Pipeline")
    print("=" * 50)
    
    result = await etl_pipeline.run()
    
    print("=" * 50)
    if result.get_variable("load_completed"):
        records = result.get_variable("records_loaded")
        print(f"✨ ETL Pipeline completed successfully! Loaded {records} records.")
    else:
        print("❌ ETL Pipeline failed - check errors above")
    
    return result

if __name__ == "__main__":
    result = asyncio.run(run_etl())
\`\`\`

**Expected Output:**
\`\`\`
🚀 Starting ETL Pipeline
==================================================
🔌 Extracting data from sources...
✅ Extracted 3 users and 4 sales records
🔄 Transforming data...
✅ Transformed data: 3 users, $495.74 total revenue
🔍 Validating data quality...
✅ Data validation passed!
💾 Loading data to destination...
Saving 3 enriched user records...
Saving summary metrics: {'total_users': 3, 'total_revenue': 495.74, ...}
✅ Data loading completed successfully!
==================================================
✨ ETL Pipeline completed successfully! Loaded 3 records.
\`\`\`

## Production Features with @state Decorator

When you're ready for production, add the \`@state\` decorator for advanced features:

\`\`\`python
from puffinflow import state

@state(
    cpu=2.0,           # Reserve 2 CPU cores
    memory=1024,       # Reserve 1GB memory  
    timeout=60.0,      # Timeout after 60 seconds
    max_retries=3,     # Retry up to 3 times on failure
    priority="high"    # High priority execution
)
async def production_task(context):
    # This state gets guaranteed resources and reliability features
    # Perfect for critical production workloads
    pass
\`\`\`

## 📋 Quick Reference Guide

### 🔧 Adding States
\`\`\`python
# Simple: states run in order added
agent.add_state("first", first_function)
agent.add_state("second", second_function)

# With dependencies: wait for others to complete
agent.add_state("reporter", generate_report, 
               dependencies=["fetch_users", "fetch_sales"])
\`\`\`

### 📦 Context Operations
\`\`\`python
# Store data (any Python object)
context.set_variable("users", user_list)
context.set_variable("total", 42.5)

# Retrieve data (with optional defaults)
users = context.get_variable("users")
total = context.get_variable("total", 0.0)
\`\`\`

### 🎯 State Return Values
\`\`\`python
async def my_state(context):
    return None                    # Continue to next state or end
    return "specific_state"        # Jump to named state
    return ["state1", "state2"]    # Run multiple states in parallel
\`\`\`

## 🤖 Real-World AI Example: Smart Document Processor

Here's a production-ready AI workflow that processes documents with modern LLM integration:

\`\`\`python
import asyncio
from typing import Dict, List
from puffinflow import Agent, state

# Modern AI document processor
ai_processor = Agent("ai-document-processor")

@state(timeout=30.0, max_retries=2)
async def validate_document(context):
    """Validate uploaded document."""
    doc_path = context.get_variable("document_path")
    
    if not doc_path or not doc_path.endswith(('.pdf', '.txt', '.docx')):
        context.set_variable("error", "Invalid document format")
        return "error_handler"
    
    print(f"✅ Document validated: {doc_path}")
    context.set_variable("validated", True)
    return "extract_content"

@state(cpu=2.0, memory=1024, timeout=120.0)
async def extract_content(context):
    """Extract text content from document."""
    doc_path = context.get_variable("document_path")
    
    print(f"📄 Extracting content from {doc_path}...")
    
    # Simulate content extraction (use pypdf, python-docx, etc. in real code)
    if doc_path.endswith('.pdf'):
        content = "This is extracted PDF content about quarterly sales results..."
    elif doc_path.endswith('.txt'):
        content = "This is plain text content about market analysis..."
    else:
        content = "This is Word document content about product roadmap..."
    
    context.set_variable("raw_content", content)
    context.set_variable("word_count", len(content.split()))
    
    print(f"✅ Extracted {len(content.split())} words")
    return "analyze_with_ai"

@state(cpu=1.0, memory=512, timeout=60.0, max_retries=3)
async def analyze_with_ai(context):
    """Analyze content using LLM."""
    content = context.get_variable("raw_content")
    
    print("🧠 Analyzing content with AI...")
    
    # Simulate LLM API call (use OpenAI, Anthropic, etc. in real code)
    # In production, you'd send content to your preferred LLM
    await asyncio.sleep(1)  # Simulate API latency
    
    # Mock AI analysis results
    ai_analysis = {
        "summary": "Document discusses Q3 sales performance with focus on regional growth.",
        "key_topics": ["sales", "quarterly results", "regional performance", "growth metrics"],
        "sentiment": "positive",
        "confidence": 0.92,
        "word_count": context.get_variable("word_count"),
        "reading_time": context.get_variable("word_count") // 200  # ~200 words per minute
    }
    
    context.set_variable("ai_analysis", ai_analysis)
    print(f"✅ AI analysis complete - {ai_analysis['sentiment']} sentiment")
    
    # Route based on content type
    if "sales" in ai_analysis["key_topics"]:
        return "process_sales_document"
    elif "roadmap" in ai_analysis["key_topics"]:
        return "process_roadmap_document"
    else:
        return "process_general_document"

async def process_sales_document(context):
    """Specialized processing for sales documents."""
    analysis = context.get_variable("ai_analysis")
    
    print("📊 Processing sales document...")
    
    # Sales-specific processing
    sales_insights = {
        "document_type": "sales_report",
        "key_metrics": ["revenue", "growth_rate", "regional_performance"],
        "stakeholders": ["sales_team", "executives", "finance"],
        "action_items": ["Follow up on regional growth", "Prepare executive summary"]
    }
    
    context.set_variable("specialized_insights", sales_insights)
    print("✅ Sales document processing complete")
    return "generate_final_report"

async def process_roadmap_document(context):
    """Specialized processing for roadmap documents."""
    print("🗺️ Processing roadmap document...")
    
    roadmap_insights = {
        "document_type": "product_roadmap",
        "key_metrics": ["timeline", "features", "milestones"],
        "stakeholders": ["product_team", "engineering", "design"],
        "action_items": ["Review feature priorities", "Update timeline estimates"]
    }
    
    context.set_variable("specialized_insights", roadmap_insights)
    print("✅ Roadmap document processing complete")
    return "generate_final_report"

async def process_general_document(context):
    """General processing for other document types."""
    print("📋 Processing general document...")
    
    general_insights = {
        "document_type": "general",
        "key_metrics": ["content_quality", "readability"],
        "stakeholders": ["general_audience"],
        "action_items": ["Review content", "Categorize document"]
    }
    
    context.set_variable("specialized_insights", general_insights)
    print("✅ General document processing complete")
    return "generate_final_report"

async def generate_final_report(context):
    """Generate comprehensive analysis report."""
    print("📑 Generating final report...")
    
    ai_analysis = context.get_variable("ai_analysis")
    specialized = context.get_variable("specialized_insights")
    doc_path = context.get_variable("document_path")
    
    final_report = {
        "document": doc_path,
        "processing_timestamp": "2024-01-15T10:30:00Z",
        "ai_analysis": ai_analysis,
        "specialized_processing": specialized,
        "recommendations": [
            f"Document type: {specialized['document_type']}",
            f"Estimated reading time: {ai_analysis['reading_time']} minutes",
            f"Confidence score: {ai_analysis['confidence']:.2%}"
        ]
    }
    
    context.set_variable("final_report", final_report)
    
    print("🎉 Document processing complete!")
    print(f"📄 Type: {specialized['document_type']}")
    print(f"🎯 Confidence: {ai_analysis['confidence']:.2%}")
    print(f"⏱️ Reading time: {ai_analysis['reading_time']} minutes")

async def error_handler(context):
    """Handle processing errors gracefully."""
    error = context.get_variable("error", "Unknown error")
    print(f"❌ Error: {error}")
    
    context.set_variable("processing_failed", True)
    # In production: log error, send alerts, cleanup resources

# Wire up the AI workflow
ai_processor.add_state("validate_document", validate_document)
ai_processor.add_state("extract_content", extract_content)
ai_processor.add_state("analyze_with_ai", analyze_with_ai)
ai_processor.add_state("process_sales_document", process_sales_document)
ai_processor.add_state("process_roadmap_document", process_roadmap_document)
ai_processor.add_state("process_general_document", process_general_document)
ai_processor.add_state("generate_final_report", generate_final_report)
ai_processor.add_state("error_handler", error_handler)

async def process_document(doc_path: str):
    """Process a document with AI analysis."""
    print(f"🚀 Processing document: {doc_path}")
    print("=" * 60)
    
    # Set initial context
    ai_processor.set_variable("document_path", doc_path)
    
    result = await ai_processor.run()
    
    print("=" * 60)
    
    if result.get_variable("processing_failed"):
        print("❌ Document processing failed")
        return None
    else:
        print("✨ Document processing successful!")
        return result.get_variable("final_report")

# Example usage
if __name__ == "__main__":
    # Process different document types
    documents = [
        "quarterly_sales_report.pdf",
        "product_roadmap_2024.docx", 
        "meeting_notes.txt"
    ]
    
    async def main():
        for doc in documents:
            report = await process_document(doc)
            if report:
                print(f"✅ {doc} processed successfully\\n")
            else:
                print(f"❌ {doc} processing failed\\n")
    
    asyncio.run(main())
\`\`\`

This example shows:
- **🔄 Smart routing** based on AI analysis results  
- **⚡ Resource management** with CPU/memory limits
- **🛡️ Error handling** with retries and timeouts
- **🎯 Specialized processing** for different document types
- **📊 Real-world patterns** you'd use in production

## 🎯 What's Next?

You now have the fundamentals to build powerful workflows! Here's your learning path:

### 🚀 **Keep Building**
- Start with simple workflows and gradually add complexity
- Use dependencies for parallel processing where possible  
- Add the \`@state\` decorator when you need production features

### 📚 **Explore Advanced Features**
- **[Error Handling & Retries →](/docs/error-handling)** - Make your workflows bulletproof
- **[Resource Management →](/docs/resource-management)** - Control CPU, memory, and priorities  
- **[Observability →](/docs/observability)** - Monitor and debug with metrics and tracing
- **[Multi-Agent Coordination →](/docs/coordination)** - Build distributed systems

### 🔧 **Production Ready**
- **[Deployment Guide →](/docs/deployment)** - Deploy to cloud platforms
- **[Best Practices →](/docs/best-practices)** - Patterns for production workflows
- **[Troubleshooting →](/docs/troubleshooting)** - Debug common issues

### 💡 **Need Help?**
- Check out the **[Examples](https://github.com/puffinflow/examples)** repository
- Join our **[Community Discord](https://discord.gg/puffinflow)**
- Read the **[API Reference →](/docs/api-reference)** for complete documentation

## 🌟 Common Use Cases

**Perfect for:**
- 🤖 **AI/LLM workflows** - RAG systems, document processing, chatbots
- 📊 **Data pipelines** - ETL, analytics, reporting workflows
- 🔄 **Microservice orchestration** - Service coordination, saga patterns
- 🏗️ **DevOps automation** - CI/CD pipelines, infrastructure workflows
- 🎯 **Business processes** - Approval workflows, order processing

Ready to build something amazing? Start with the examples above and adapt them to your needs! 🚀
`.trim();
