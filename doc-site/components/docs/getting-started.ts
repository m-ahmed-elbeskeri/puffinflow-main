export const gettingStartedMarkdown = `# Getting Started with Puffinflow

Welcome to **Puffinflow** - the modern Python framework that makes building reliable, scalable workflows and multi-agent systems incredibly simple! Whether you're orchestrating microservices, building AI pipelines, managing complex data processing workflows, or creating sophisticated automation systems, Puffinflow provides the tools you need to build robust, production-ready applications.

## Why Choose Puffinflow?

Puffinflow was designed from the ground up to solve the common pain points developers face when building complex workflows:

### **⚡ Simple Yet Powerful**
- Start with just 3 lines of code for basic workflows
- Scale seamlessly to production-grade systems with thousands of concurrent operations
- Intuitive API that feels natural to Python developers
- Zero-configuration setup - works out of the box

### **🔄 Built for Reliability**
- **Automatic retries** with configurable backoff strategies
- **Circuit breakers** to prevent cascade failures
- **Timeout protection** to avoid stuck processes
- **Dead letter queues** for handling failed operations
- **Graceful degradation** when services are unavailable

### **📊 Complete Observability**
- **Real-time metrics** and performance monitoring
- **Distributed tracing** across your entire workflow
- **Structured logging** with correlation IDs
- **Health checks** and alerting
- **Performance insights** and bottleneck detection

### **⚖️ Enterprise-Grade Scalability**
- **Resource management** with CPU and memory controls
- **Rate limiting** to protect downstream services  
- **Priority queues** for critical operations
- **Horizontal scaling** across multiple machines
- **Load balancing** and traffic distribution

### **🤖 AI and ML Ready**
- Perfect for **LLM workflows** and prompt chains
- Built-in support for **RAG (Retrieval Augmented Generation)** systems
- **Multi-agent orchestration** for complex AI systems
- **Vector database** integration
- **Model serving** and inference pipelines

## Prerequisites

Before we start, make sure you have:

- **Python 3.9 or higher** (we support 3.9, 3.10, 3.11, 3.12, and 3.13)
- **Basic understanding of async/await** in Python (don't worry, we'll explain as we go!)
- **5 minutes** to get your first workflow running ⏱️

> **New to async/await?** No problem! Puffinflow makes it easy. Just remember that \`async def\` creates an asynchronous function, and \`await\` is used to wait for operations to complete.

## Installation

Install Puffinflow using pip:

\`\`\`bash
pip install puffinflow
\`\`\`

That's it! No complex setup, no configuration files, no additional dependencies to manage.

## Your First Workflow: Hello World

Let's create your first Puffinflow workflow. This example demonstrates the three core concepts you'll use in every workflow:

\`\`\`python
import asyncio
from puffinflow import Agent

# Step 1: Create an Agent (your workflow container)
# The Agent manages the execution of your workflow states
agent = Agent("my-first-workflow")

# Step 2: Define a State (an individual step in your workflow)  
# States are just regular async functions that receive a 'context' parameter
async def hello_world(context):
    # Print a friendly message
    print("Hello, Puffinflow! 🐧")
    print(f"Agent name: {agent.name}")
    
    # Store data in context for other states to use
    context.set_variable("greeting", "Hello from PuffinFlow!")
    context.set_variable("timestamp", "2024-01-15 10:30:00")
    
    # Return None to end the workflow, or return a state name to continue
    return None

# Step 3: Register the state with your agent and run the workflow
agent.add_state("hello_world", hello_world)

async def main():
    # Run the workflow and get the results
    result = await agent.run()
    
    # Access data that was stored in the context
    greeting = result.get_variable("greeting")
    timestamp = result.get_variable("timestamp")
    
    print(f"Result: {greeting}")
    print(f"Generated at: {timestamp}")
    print(f"Workflow status: {result.status}")

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

**When you run this code, you'll see:**

\`\`\`
Hello, Puffinflow! 🐧
Agent name: my-first-workflow
Result: Hello from PuffinFlow!
Generated at: 2024-01-15 10:30:00
Workflow status: AgentStatus.COMPLETED
\`\`\`

🎉 **Congratulations!** You just ran your first Puffinflow workflow!

### **What Just Happened?**

Let's break down what happened in this simple example:

1. **Agent Creation**: \`Agent("my-first-workflow")\` creates a workflow container with a unique name
2. **State Definition**: The \`hello_world\` function is a state that performs work and stores results
3. **Context Usage**: The \`context\` parameter lets states share data with each other
4. **State Registration**: \`add_state()\` tells the agent about your state function
5. **Execution**: \`agent.run()\` executes the workflow and returns results
6. **Result Access**: \`result.get_variable()\` retrieves data stored during execution

## Understanding the Core Concepts

Now that you've seen Puffinflow in action, let's dive deeper into the three fundamental concepts that power every workflow:

### 🏗️ **Agent: Your Workflow Orchestrator**

An **Agent** is the central coordinator of your workflow. Think of it as a smart container that:

- **Manages state execution** - Decides which states to run and when
- **Handles dependencies** - Ensures states run in the correct order
- **Provides coordination** - Manages parallel execution and synchronization
- **Tracks progress** - Monitors workflow status and handles errors
- **Manages resources** - Controls CPU, memory, and other system resources

**Key Agent capabilities:**
- Execute states sequentially or in parallel
- Handle complex dependency graphs
- Provide checkpointing for long-running workflows
- Support distributed execution across multiple machines
- Offer built-in monitoring and observability

\`\`\`python
# Creating agents with different configurations
basic_agent = Agent("data-processor")
production_agent = Agent("prod-workflow", max_concurrent_states=10)
distributed_agent = Agent("distributed-ml", enable_checkpointing=True)
\`\`\`

### 🎯 **States: The Building Blocks of Your Workflow**

**States** are the individual steps that make up your workflow. Each state is an async function that:

- **Performs specific work** - Data processing, API calls, computations, etc.
- **Receives context** - Gets access to shared data and configuration
- **Can store results** - Saves output for other states to use
- **Controls flow** - Decides what happens next in the workflow
- **Handles errors** - Can retry operations or route to error handlers

**State characteristics:**
- Always async functions (\`async def\`)
- Always receive a \`context\` parameter as the first argument
- Can return state names to control workflow routing
- Can run independently or depend on other states
- Support timeouts, retries, and resource limits

\`\`\`python
async def fetch_user_data(context):
    """Fetch user information from an API."""
    user_id = context.get_variable("user_id")
    
    # Simulate API call
    user_data = await api_client.get_user(user_id)
    
    # Store result for other states
    context.set_variable("user_data", user_data)
    
    # Return the next state to execute
    return "process_user_data"
\`\`\`

### 📦 **Context: Your Workflow's Shared Memory**

The **Context** is how states communicate with each other. It's a powerful, type-safe data store that:

- **Shares data** between states throughout the workflow
- **Maintains state** across the entire workflow execution
- **Provides type safety** with optional validation
- **Supports complex data** - Objects, lists, dictionaries, custom classes
- **Offers caching** with TTL support for expensive operations

**Context features:**
- Store any Python object (strings, numbers, lists, dictionaries, custom classes)
- Retrieve data with optional default values
- Type hints and validation support
- Built-in caching with expiration
- Thread-safe for concurrent access

\`\`\`python
async def example_context_usage(context):
    # Store different types of data
    context.set_variable("user_count", 1250)                    # Numbers
    context.set_variable("user_names", ["Alice", "Bob"])        # Lists  
    context.set_variable("config", {"timeout": 30, "retries": 3})  # Dictionaries
    context.set_variable("processed_at", datetime.now())        # Objects
    
    # Retrieve data with defaults
    count = context.get_variable("user_count", 0)
    names = context.get_variable("user_names", [])
    timeout = context.get_variable("config", {}).get("timeout", 10)
    
    # Data persists throughout the entire workflow
    return "next_state"
\`\`\`

## Two Approaches to Defining States

Puffinflow gives you flexibility in how you define states. Both approaches work identically for basic use cases:

### **Approach 1: Plain Functions (Perfect for Getting Started)**

Start with simple async functions when you're learning or building basic workflows:

\`\`\`python
async def process_data(context):
    """A simple state function that processes some data."""
    
    # Get input data from context
    raw_data = context.get_variable("raw_data", [])
    
    # Process the data
    processed_data = [item.upper() for item in raw_data]
    
    # Store the result
    context.set_variable("processed_data", processed_data)
    
    # Return None to end workflow, or state name to continue
    return None
\`\`\`

**When to use plain functions:**
- Learning Puffinflow basics
- Simple workflows with basic requirements
- Prototyping and experimentation
- States that don't need special resource controls

### **Approach 2: Decorated States (Production-Ready Features)**

Use the \`@state\` decorator when you need advanced production features:

\`\`\`python
from puffinflow import state

@state(
    cpu=2.0,           # Reserve 2 CPU cores for this state
    memory=1024,       # Reserve 1GB of memory
    timeout=30.0,      # Timeout after 30 seconds
    max_retries=3,     # Retry up to 3 times on failure
    priority="high"    # Execute with high priority
)
async def process_data(context):
    """A production-ready state with resource controls."""
    
    # This state is guaranteed the requested resources
    # and will automatically retry on failure
    
    raw_data = context.get_variable("raw_data", [])
    
    # Simulate CPU-intensive processing
    processed_data = await expensive_processing(raw_data)
    
    context.set_variable("processed_data", processed_data)
    return None
\`\`\`

**When to use decorated states:**
- Production workloads
- Resource-intensive operations
- States that need retry logic
- Operations with timeout requirements
- High-priority or critical states

### **Decorator Options Explained**

The \`@state\` decorator supports many options for fine-tuning behavior:

\`\`\`python
@state(
    # Resource Management
    cpu=2.0,                    # CPU cores to reserve
    memory=1024,                # Memory in MB to reserve
    
    # Reliability
    timeout=60.0,               # Timeout in seconds
    max_retries=3,              # Number of retry attempts
    retry_delay=1.0,            # Delay between retries (seconds)
    
    # Priority and Scheduling  
    priority="high",            # Execution priority (low/normal/high)
    
    # Advanced Options
    bulkhead="critical",        # Isolate critical operations
    circuit_breaker=True,       # Enable circuit breaker protection
    cache_results=True          # Cache results for repeated calls
)
async def production_state(context):
    # Your state logic here
    pass
\`\`\`

**Comparison at a glance:**

| Feature | Plain Functions | Decorated States |
|---------|----------------|------------------|
| **Simplicity** | ✅ Very simple | ⚠️ Slightly more complex |
| **Resource Control** | ❌ No | ✅ Full control |
| **Retry Logic** | ❌ Manual | ✅ Automatic |
| **Timeouts** | ❌ Manual | ✅ Built-in |
| **Priority Control** | ❌ No | ✅ Yes |
| **Production Ready** | ⚠️ Basic | ✅ Enterprise-grade |

**Our recommendation:** Start with plain functions to learn the concepts, then add decorators when you need production features!

## Mastering Data Flow: How States Communicate

One of Puffinflow's most powerful features is seamless data sharing between states. The **Context** acts as your workflow's shared memory, allowing states to pass data, results, and configuration throughout the entire execution.

### **Understanding Context: Your Workflow's Data Hub**

Think of the context as a persistent, intelligent data store that travels with your workflow:

- **Persistent**: Data stored in one state is available to all subsequent states
- **Type-Safe**: Supports any Python object with optional type validation
- **Thread-Safe**: Multiple states can safely access context concurrently
- **Efficient**: Built-in caching and optimization for large datasets
- **Flexible**: Store simple values or complex objects

### **Complete Data Pipeline Example**

Let's build a realistic business intelligence pipeline that demonstrates how data flows through multiple states:

\`\`\`python
import asyncio
from datetime import datetime
from puffinflow import Agent

# Create our business intelligence agent
bi_agent = Agent("business-intelligence-pipeline")

async def fetch_user_data(context):
    """Step 1: Fetch user information from our database."""
    print("📊 Fetching user data from database...")
    
    # Simulate database query - in real life, this would connect to your DB
    await asyncio.sleep(0.5)  # Simulate network delay
    
    # Store raw user data in context
    user_data = {
        "total_users": 1250,
        "active_users": 890,
        "new_signups_today": 45,
        "countries": ["US", "UK", "DE", "FR", "JP"],
        "avg_session_time": 342  # seconds
    }
    
    context.set_variable("user_data", user_data)
    context.set_variable("data_fetch_time", datetime.now())
    
    print(f"✅ Fetched data for {user_data['total_users']} users")
    print(f"   Active users: {user_data['active_users']}")
    print(f"   New signups today: {user_data['new_signups_today']}")

async def fetch_revenue_data(context):
    """Step 2: Fetch financial data from our payments system.""" 
    print("💰 Fetching revenue data from payments API...")
    
    # Simulate API call to payment processor
    await asyncio.sleep(0.3)
    
    # Store revenue data in context
    revenue_data = {
        "total_revenue": 145000,
        "revenue_today": 3200,
        "avg_order_value": 67.50,
        "subscription_revenue": 98000,
        "one_time_revenue": 47000
    }
    
    context.set_variable("revenue_data", revenue_data)
    
    print(f"✅ Total revenue: ${revenue_data['total_revenue']:,}")
    print(f"   Today's revenue: ${revenue_data['revenue_today']:,}")
    print(f"   Average order: ${revenue_data['avg_order_value']}")

async def calculate_business_metrics(context):
    """Step 3: Calculate key business metrics using fetched data."""
    print("🧮 Calculating business metrics...")
    
    # Retrieve data from previous states
    user_data = context.get_variable("user_data")
    revenue_data = context.get_variable("revenue_data")
    
    # Calculate important business metrics
    revenue_per_user = revenue_data["total_revenue"] / user_data["total_users"]
    user_engagement_rate = user_data["active_users"] / user_data["total_users"]
    daily_growth_rate = user_data["new_signups_today"] / user_data["total_users"]
    
    # Create comprehensive metrics object
    business_metrics = {
        "revenue_per_user": round(revenue_per_user, 2),
        "user_engagement_rate": round(user_engagement_rate * 100, 1),  # Convert to percentage
        "daily_growth_rate": round(daily_growth_rate * 100, 3),  # Convert to percentage
        "subscription_ratio": round((revenue_data["subscription_revenue"] / revenue_data["total_revenue"]) * 100, 1),
        "avg_session_minutes": round(user_data["avg_session_time"] / 60, 1)
    }
    
    # Store calculated metrics for other states to use
    context.set_variable("business_metrics", business_metrics)
    context.set_variable("calculation_time", datetime.now())
    
    print(f"✅ Key metrics calculated:")
    print(f"   Revenue per user: ${business_metrics['revenue_per_user']}")
    print(f"   User engagement: {business_metrics['user_engagement_rate']}%")
    print(f"   Daily growth: {business_metrics['daily_growth_rate']}%")

async def generate_executive_report(context):
    """Step 4: Generate a comprehensive executive summary."""
    print("📈 Generating executive report...")
    
    # Gather all data from previous states
    user_data = context.get_variable("user_data")
    revenue_data = context.get_variable("revenue_data") 
    metrics = context.get_variable("business_metrics")
    fetch_time = context.get_variable("data_fetch_time")
    
    # Create executive summary
    executive_report = {
        "report_title": "Daily Business Intelligence Summary",
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "data_as_of": fetch_time.strftime("%Y-%m-%d %H:%M:%S"),
        
        # Key Performance Indicators
        "kpis": {
            "total_users": user_data["total_users"],
            "active_users": user_data["active_users"],
            "total_revenue": revenue_data["total_revenue"],
            "revenue_per_user": metrics["revenue_per_user"]
        },
        
        # Growth Metrics
        "growth": {
            "new_signups_today": user_data["new_signups_today"],
            "daily_growth_rate": f"{metrics['daily_growth_rate']}%",
            "revenue_today": revenue_data["revenue_today"]
        },
        
        # Engagement Metrics
        "engagement": {
            "user_engagement_rate": f"{metrics['user_engagement_rate']}%",
            "avg_session_minutes": metrics["avg_session_minutes"],
            "countries_active": len(user_data["countries"])
        },
        
        # Revenue Breakdown
        "revenue_analysis": {
            "subscription_revenue": revenue_data["subscription_revenue"],
            "one_time_revenue": revenue_data["one_time_revenue"],
            "subscription_ratio": f"{metrics['subscription_ratio']}%",
            "avg_order_value": revenue_data["avg_order_value"]
        }
    }
    
    # Store the final report
    context.set_variable("executive_report", executive_report)
    context.set_variable("report_ready", True)
    
    print("🎉 Executive report generated!")
    print(f"📊 Summary: {executive_report['kpis']['total_users']} users, ${executive_report['kpis']['total_revenue']:,} revenue")
    print(f"📈 Growth: {executive_report['growth']['new_signups_today']} new users today")

# Configure the workflow with proper dependencies
# Each state depends on the previous ones to ensure correct data flow
bi_agent.add_state("fetch_user_data", fetch_user_data)
bi_agent.add_state("fetch_revenue_data", fetch_revenue_data, dependencies=["fetch_user_data"])
bi_agent.add_state("calculate_business_metrics", calculate_business_metrics, 
                   dependencies=["fetch_user_data", "fetch_revenue_data"])
bi_agent.add_state("generate_executive_report", generate_executive_report,
                   dependencies=["calculate_business_metrics"])

# Run the complete business intelligence pipeline
async def main():
    print("🚀 Starting Business Intelligence Pipeline")
    print("=" * 55)
    
    # Execute the workflow
    result = await bi_agent.run()
    
    print("=" * 55)
    
    # Check if the report was generated successfully
    if result.get_variable("report_ready"):
        print("✅ Business Intelligence Pipeline completed successfully!")
        
        # Access the final report
        report = result.get_variable("executive_report")
        print(f"📋 Report: {report['report_title']}")
        print(f"⏰ Generated: {report['generated_at']}")
        
        # Show key metrics
        kpis = report['kpis']
        print(f"👥 Users: {kpis['total_users']} total, {kpis['active_users']} active")
        print(f"💰 Revenue: ${kpis['total_revenue']:,} (${kpis['revenue_per_user']} per user)")
    else:
        print("❌ Pipeline failed - check logs above")

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

**When you run this pipeline, you'll see:**

\`\`\`
🚀 Starting Business Intelligence Pipeline
=======================================================
📊 Fetching user data from database...
✅ Fetched data for 1250 users
   Active users: 890
   New signups today: 45
💰 Fetching revenue data from payments API...
✅ Total revenue: $145,000
   Today's revenue: $3,200
   Average order: $67.5
🧮 Calculating business metrics...
✅ Key metrics calculated:
   Revenue per user: $116.0
   User engagement: 71.2%
   Daily growth: 3.6%
📈 Generating executive report...
🎉 Executive report generated!
📊 Summary: 1250 users, $145,000 revenue
📈 Growth: 45 new users today
=======================================================
✅ Business Intelligence Pipeline completed successfully!
📋 Report: Daily Business Intelligence Summary
⏰ Generated: 2024-01-15 10:30:45
👥 Users: 1250 total, 890 active
💰 Revenue: $145,000 ($116.0 per user)
\`\`\`

### **Key Data Flow Patterns Demonstrated**

This example shows several important patterns:

1. **Sequential Data Building**: Each state adds more data to the context
2. **Data Transformation**: Raw data becomes processed metrics
3. **Data Aggregation**: Multiple data sources combine into comprehensive reports
4. **Data Persistence**: All data remains available throughout the workflow
5. **Complex Objects**: Store and retrieve dictionaries, lists, and custom objects

### **Essential Context Methods**

Here are the context methods you'll use most frequently:

\`\`\`python
async def context_examples(context):
    # === STORING DATA ===
    
    # Store simple values
    context.set_variable("user_count", 1250)
    context.set_variable("is_premium", True)
    context.set_variable("rating", 4.7)
    
    # Store complex objects
    context.set_variable("user_profile", {
        "name": "Alice Johnson",
        "email": "alice@example.com", 
        "preferences": {"theme": "dark", "notifications": True}
    })
    
    # Store lists and arrays
    context.set_variable("product_ids", [101, 205, 308, 412])
    context.set_variable("tags", ["urgent", "customer-service", "billing"])
    
    # Store custom objects (like datetime, dataframes, etc.)
    context.set_variable("created_at", datetime.now())
    context.set_variable("processed_data", pandas_dataframe)  # If using pandas
    
    # === RETRIEVING DATA ===
    
    # Get data with no default (returns None if not found)
    user_count = context.get_variable("user_count")
    
    # Get data with default values (safer approach)
    count = context.get_variable("user_count", 0)  # Default to 0
    profile = context.get_variable("user_profile", {})  # Default to empty dict
    tags = context.get_variable("tags", [])  # Default to empty list
    
    # === CHECKING IF DATA EXISTS ===
    
    # Check if a variable exists before using it
    if context.has_variable("user_profile"):
        profile = context.get_variable("user_profile")
        print(f"User: {profile['name']}")
    
    # === WORKING WITH NESTED DATA ===
    
    # Safely access nested dictionary data
    preferences = context.get_variable("user_profile", {}).get("preferences", {})
    theme = preferences.get("theme", "light")
    
    # Or use helper methods for complex access patterns
    def safe_get_nested(context, key, *nested_keys, default=None):
        data = context.get_variable(key, {})
        for nested_key in nested_keys:
            if isinstance(data, dict) and nested_key in data:
                data = data[nested_key]
            else:
                return default
        return data
    
    # Usage: get user.preferences.theme with fallback
    theme = safe_get_nested(context, "user_profile", "preferences", "theme", default="light")
\`\`\`

### **Best Practices for Data Flow**

1. **Use Descriptive Names**: \`user_count\` instead of \`count\`, \`processed_orders\` instead of \`data\`

2. **Provide Defaults**: Always use defaults when retrieving data to avoid errors

3. **Document Data Contracts**: Comment what each state expects and provides

4. **Validate Critical Data**: Check that required data exists before processing

5. **Keep Data Flat When Possible**: Avoid deeply nested structures for better performance

6. **Use Type Hints**: Help other developers understand your data structures

\`\`\`python
async def well_documented_state(context):
    """
    Processes user orders and calculates shipping costs.
    
    Expected context variables:
    - user_orders: List[Dict] - List of order dictionaries
    - shipping_rules: Dict - Shipping calculation rules
    - user_location: str - User's country code
    
    Sets context variables:
    - total_shipping_cost: float - Total shipping for all orders
    - shipping_breakdown: Dict - Per-order shipping costs
    - estimated_delivery: str - Estimated delivery date
    """
    
    # Validate required inputs exist
    orders = context.get_variable("user_orders", [])
    if not orders:
        context.set_variable("error", "No orders found")
        return "error_handler"
    
    # Your processing logic here...
    # Always document what you're storing!
\`\`\`

This comprehensive approach to data sharing ensures your workflows are robust, maintainable, and easy to understand!

## Mastering Workflow Control: Building Smart, Efficient Workflows

One of Puffinflow's greatest strengths is its flexible workflow control system. You can build everything from simple linear pipelines to complex, branching workflows that adapt to data and conditions. Let's explore the three main patterns you'll use to control workflow execution.

### **Understanding Workflow Execution Models**

Before diving into specific patterns, it's important to understand how Puffinflow executes workflows:

- **Entry Points**: States with no dependencies run first (automatically determined)
- **Dependency Resolution**: States wait for their dependencies before executing
- **Dynamic Routing**: States can control what runs next via return values
- **Parallel Execution**: Multiple states can run simultaneously for efficiency
- **Completion**: Workflow ends when no more states can execute

### **Pattern 1: 🔗 Dependency-Based Execution - "Wait for Prerequisites"**

Dependencies are perfect when you need guaranteed execution order and want states to run in parallel when possible.

**When to use dependencies:**
- Data must be fetched before processing
- Multiple independent data sources can be fetched simultaneously
- Complex workflows with clear prerequisite relationships
- Maximum parallelization while maintaining correctness

\`\`\`python
import asyncio
from puffinflow import Agent

# Create an intelligent workflow that maximizes parallel execution
intelligence_agent = Agent("parallel-intelligence-workflow")

async def fetch_user_data(context):
    """Fetch user data - can run immediately (no dependencies)."""
    print("👥 Fetching user data from database...")
    
    # Simulate database query with realistic delay
    await asyncio.sleep(0.8)  # Typical database query time
    
    # Store comprehensive user data
    user_data = {
        "total_users": 15000,
        "active_users": 12500,
        "premium_users": 3200,
        "countries": ["US", "UK", "DE", "FR", "JP", "CA", "AU"],
        "avg_session_time": 425,  # seconds
        "churn_rate": 0.05
    }
    
    context.set_variable("user_data", user_data)
    print(f"✅ User data fetched: {user_data['total_users']:,} total users")

async def fetch_sales_data(context):
    """Fetch sales data - can run in parallel with user data."""
    print("💰 Fetching sales data from payment processor...")
    
    # Simulate API call to payment system
    await asyncio.sleep(0.6)  # Typical API response time
    
    # Store detailed sales information
    sales_data = {
        "total_revenue": 2450000,
        "monthly_revenue": 425000,
        "daily_revenue": 14200,
        "avg_order_value": 127.50,
        "total_orders": 19215,
        "refund_rate": 0.03
    }
    
    context.set_variable("sales_data", sales_data)
    print(f"✅ Sales data fetched: ${sales_data['total_revenue']:,} total revenue")

async def fetch_product_data(context):
    """Fetch product catalog - can also run in parallel."""
    print("📦 Fetching product catalog from inventory...")
    
    # Simulate inventory system query
    await asyncio.sleep(0.4)
    
    # Store product information
    product_data = {
        "total_products": 1250,
        "active_products": 980,
        "categories": ["Electronics", "Books", "Clothing", "Home", "Sports"],
        "top_selling": ["iPhone 15", "MacBook Pro", "AirPods", "iPad"],
        "inventory_value": 1850000
    }
    
    context.set_variable("product_data", product_data)
    print(f"✅ Product data fetched: {product_data['total_products']} products")

async def calculate_business_intelligence(context):
    """Process all data - waits for ALL fetch operations to complete."""
    print("🧠 Calculating comprehensive business intelligence...")
    
    # Get all data from previous states
    user_data = context.get_variable("user_data")
    sales_data = context.get_variable("sales_data")
    product_data = context.get_variable("product_data")
    
    # Perform complex calculations using all data sources
    revenue_per_user = sales_data["total_revenue"] / user_data["total_users"]
    premium_conversion_rate = user_data["premium_users"] / user_data["total_users"]
    product_penetration = sales_data["total_orders"] / product_data["active_products"]
    
    # Create comprehensive business intelligence report
    business_intelligence = {
        "financial_metrics": {
            "revenue_per_user": round(revenue_per_user, 2),
            "premium_conversion_rate": round(premium_conversion_rate * 100, 2),
            "average_order_value": sales_data["avg_order_value"],
            "monthly_recurring_revenue": round(sales_data["monthly_revenue"] * 0.7, 2)  # Estimate
        },
        "user_metrics": {
            "user_engagement_rate": round((user_data["active_users"] / user_data["total_users"]) * 100, 1),
            "user_retention_rate": round((1 - user_data["churn_rate"]) * 100, 1),
            "global_presence": len(user_data["countries"]),
            "session_quality_score": min(10, user_data["avg_session_time"] / 60)  # Score out of 10
        },
        "product_metrics": {
            "catalog_utilization": round((product_data["active_products"] / product_data["total_products"]) * 100, 1),
            "product_penetration": round(product_penetration, 2),
            "inventory_turnover": round(sales_data["total_revenue"] / product_data["inventory_value"], 2)
        }
    }
    
    context.set_variable("business_intelligence", business_intelligence)
    
    print("✅ Business intelligence calculated:")
    print(f"   💵 Revenue per user: ${business_intelligence['financial_metrics']['revenue_per_user']}")
    print(f"   👥 User engagement: {business_intelligence['user_metrics']['user_engagement_rate']}%")
    print(f"   📦 Catalog utilization: {business_intelligence['product_metrics']['catalog_utilization']}%")

async def generate_strategic_recommendations(context):
    """Generate actionable recommendations - depends on BI calculations."""
    print("💡 Generating strategic recommendations...")
    
    # Get business intelligence data
    bi_data = context.get_variable("business_intelligence")
    user_data = context.get_variable("user_data")
    sales_data = context.get_variable("sales_data")
    
    # Generate data-driven recommendations
    recommendations = []
    
    # Analyze user engagement
    engagement_rate = bi_data["user_metrics"]["user_engagement_rate"]
    if engagement_rate < 75:
        recommendations.append({
            "priority": "high",
            "category": "user_engagement",
            "recommendation": "Implement user engagement campaigns",
            "rationale": f"Current engagement rate of {engagement_rate}% is below industry standard",
            "expected_impact": "15-25% increase in active users"
        })
    
    # Analyze revenue metrics
    rpu = bi_data["financial_metrics"]["revenue_per_user"]
    if rpu < 150:
        recommendations.append({
            "priority": "medium",
            "category": "revenue_optimization",
            "recommendation": "Introduce premium tier features and upselling",
            "rationale": f"RPU of ${rpu} indicates opportunity for monetization",
            "expected_impact": "20-30% increase in revenue per user"
        })
    
    # Analyze product catalog
    catalog_util = bi_data["product_metrics"]["catalog_utilization"]
    if catalog_util < 85:
        recommendations.append({
            "priority": "medium",
            "category": "product_optimization",
            "recommendation": "Optimize product catalog and improve discoverability",
            "rationale": f"Only {catalog_util}% of products are actively selling",
            "expected_impact": "10-15% increase in order volume"
        })
    
    context.set_variable("strategic_recommendations", recommendations)
    context.set_variable("analysis_complete", True)
    
    print(f"✅ Generated {len(recommendations)} strategic recommendations")
    for rec in recommendations:
        print(f"   🎯 {rec['priority'].upper()}: {rec['recommendation']}")

# Configure the workflow with intelligent dependencies
# Fetch operations run in parallel, then analysis waits for all data
intelligence_agent.add_state("fetch_user_data", fetch_user_data)
intelligence_agent.add_state("fetch_sales_data", fetch_sales_data)
intelligence_agent.add_state("fetch_product_data", fetch_product_data)

# This state waits for ALL three fetch operations to complete
intelligence_agent.add_state("calculate_business_intelligence", calculate_business_intelligence,
                           dependencies=["fetch_user_data", "fetch_sales_data", "fetch_product_data"])

# This state waits for the BI calculations
intelligence_agent.add_state("generate_strategic_recommendations", generate_strategic_recommendations,
                           dependencies=["calculate_business_intelligence"])

# Run the intelligent workflow
async def main():
    print("🚀 Starting Intelligent Business Analysis")
    print("=" * 50)
    
    start_time = asyncio.get_event_loop().time()
    result = await intelligence_agent.run()
    end_time = asyncio.get_event_loop().time()
    
    print("=" * 50)
    
    if result.get_variable("analysis_complete"):
        execution_time = round(end_time - start_time, 2)
        print(f"✅ Analysis completed in {execution_time} seconds")
        
        # Show the power of parallel execution
        print(f"💡 Note: Without parallel execution, this would take ~1.8 seconds")
        print(f"    With parallel execution: {execution_time} seconds")
        print(f"    Time saved: ~{1.8 - execution_time:.1f} seconds ({((1.8 - execution_time) / 1.8) * 100:.0f}% faster)")
        
        # Display recommendations
        recommendations = result.get_variable("strategic_recommendations")
        print(f"\\n📋 Strategic Recommendations Generated: {len(recommendations)}")
        for i, rec in enumerate(recommendations, 1):
            print(f"   {i}. [{rec['priority'].upper()}] {rec['recommendation']}")

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

**Key Benefits of Dependency-Based Control:**

1. **Maximum Parallelization**: Independent states run simultaneously
2. **Guaranteed Order**: Dependent states wait for prerequisites
3. **Automatic Optimization**: Puffinflow optimizes execution automatically
4. **Clear Dependencies**: Easy to understand what depends on what
5. **Robust Execution**: Failed dependencies prevent downstream execution

**Execution Timeline:**
\`\`\`
Time 0.0s: [fetch_user_data] [fetch_sales_data] [fetch_product_data] start in parallel
Time 0.8s: All fetch operations complete
Time 0.8s: [calculate_business_intelligence] starts
Time 0.9s: BI calculation completes
Time 0.9s: [generate_strategic_recommendations] starts  
Time 1.0s: Workflow complete
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
