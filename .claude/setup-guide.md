# Claude Subagents Setup Guide

This guide explains how to implement the analyzer and executor subagent system for your GitHub workflows.

## 🏗️ Architecture Overview

The Claude Subagents system creates specialized AI agents for different aspects of code development:

- **🔍 Analyzer Agent**: Code analysis, security scanning, task planning
- **⚡ Executor Agent**: Implementation, testing, quality assurance
- **🛡️ Security Specialist**: Deep security analysis and vulnerability assessment
- **⚡ Performance Optimizer**: Performance analysis and optimization
- **🧪 Test Generator**: Comprehensive test creation
- **📚 Documentation Specialist**: Documentation maintenance and creation

## 📁 File Structure

```
.claude/
├── subagents-config.yaml           # Central configuration
├── workflow-templates/             # GitHub Actions templates
│   ├── analyzer-agent.yml         # Analyzer workflow
│   ├── executor-agent.yml         # Executor workflow
│   ├── orchestrator.yml           # Workflow coordination
│   └── specialized-agents.yml     # Specialized subagents
└── setup-guide.md                 # This guide
```

## 🚀 Installation Steps

### Step 1: Copy Workflow Templates

Copy the workflow templates to your `.github/workflows/` directory:

```bash
# Copy core subagent workflows
cp .claude/workflow-templates/analyzer-agent.yml .github/workflows/
cp .claude/workflow-templates/executor-agent.yml .github/workflows/
cp .claude/workflow-templates/orchestrator.yml .github/workflows/
cp .claude/workflow-templates/specialized-agents.yml .github/workflows/
```

### Step 2: Configure GitHub Repository

1. **Ensure Claude Code OAuth Token exists:**
   - Go to Settings → Secrets and Variables → Actions
   - Verify `CLAUDE_CODE_OAUTH_TOKEN` is configured
   - If missing, follow the [Claude Code GitHub Actions guide](https://docs.anthropic.com/en/docs/claude-code/github-actions)

2. **Set required permissions:**
   ```yaml
   permissions:
     contents: write          # For making code changes
     pull-requests: write     # For PR comments and labels
     issues: write           # For issue comments  
     actions: read           # For reading workflow results
     security-events: write  # For security scanning
   ```

3. **Create workflow labels** (optional but recommended):
   - `🔍 analyzed` - Analysis complete
   - `⚡ ready-to-execute` - Ready for execution
   - `🛡️ security-review` - Security review required
   - `✅ executed` - Execution complete
   - `🎯 ready-to-merge` - All checks passed

### Step 3: Customize Configuration

Edit `.claude/subagents-config.yaml` to match your project needs:

```yaml
# Adjust allowed tools for your project
analyzer:
  allowed_tools:
    - "Bash(npm run lint)"           # Your linting command
    - "Bash(npm run typecheck)"      # Your type checking
    - "Bash(npm run test)"           # Your test command

executor:  
  allowed_tools:
    - "Bash(npm run build)"          # Your build command
    - "Bash(npm run lint --fix)"     # Your auto-fix command
```

### Step 4: Environment-Specific Setup

For **Development Environment:**
```yaml
environments:
  development:
    auto_execute_safe_fixes: true      # Enable auto-execution of safe fixes
    require_approval_for_destructive: true
```

For **Production Environment:**
```yaml  
environments:
  production:
    auto_execute_safe_fixes: false    # Require manual approval
    require_approval_for_all: true
    require_security_review: true
```

## 🎯 Usage Examples

### Basic Analysis
```bash
# Trigger code analysis
@claude-analyze

# Trigger with specific focus
@claude-analyze security performance
```

### Execution with Approval
```bash
# Execute approved changes
@claude-execute approved

# Execute with conditions
@claude-execute approved low-risk-only
```

### Specialized Subagents
```bash
# Deep security analysis
@claude-security

# Performance optimization
@claude-optimize

# Generate comprehensive tests  
@claude-test

# Update documentation
@claude-docs
```

### Emergency Controls
```bash
# Stop all running workflows
@claude-stop

# Cancel specific workflow
@claude-cancel analyzer
```

## 🔄 Workflow Orchestration

### Automatic Analysis Cycle
1. **PR opened** → Analyzer Agent triggered automatically
2. **Analysis complete** → Results posted as comment
3. **Human approval** → `@claude-execute approved` 
4. **Execution complete** → Quality checks and build verification

### Manual Override Flow
```
@claude-analyze → Review Results → @claude-execute approved → Done
```

### Specialized Review Flow
```
@claude-security → Security Report → Manual Review → @claude-execute approved
```

## 🛡️ Security Considerations

### Approval Requirements
- **Always Required:** Security-sensitive changes, authentication modifications
- **Sometimes Required:** Database schema changes, API endpoint changes  
- **Auto-Approved:** Linting fixes, formatting, minor type fixes

### Tool Restrictions
- **Analyzer:** Read-only tools (Grep, Read, LS, audit commands)
- **Executor:** Full implementation tools with safety checks
- **Security:** Specialized security scanning tools only

### Safety Mechanisms
- Pre-execution approval verification
- Security-sensitive change detection
- Comprehensive test execution requirement
- Build success validation
- Emergency stop functionality

## 📊 Monitoring and Maintenance

### Workflow Health Checks
- Daily automated maintenance analysis
- Weekly dependency security audits
- Monthly performance reviews
- Quarterly configuration updates

### Key Metrics to Monitor
- Analysis completion rate
- Execution success rate  
- Test pass rates after changes
- Security issue detection and resolution
- Performance improvement trends

## 🔧 Customization for Your Project

### Tenant Management Specific Features

The subagents are pre-configured for this tenant management system with:

1. **Business Logic Validation:**
   - Property/unit/tenant relationship integrity
   - Billing calculation accuracy
   - Multi-tenant data isolation

2. **Technology Stack Integration:**
   - NestJS API patterns
   - React component optimization
   - Drizzle ORM query patterns  
   - TypeScript strict mode compliance

3. **Internationalization Support:**
   - English/French translation validation
   - i18n key generation for new UI text

### Extending for Other Projects

To adapt for different projects:

1. **Update Technology Stack References:**
   ```yaml
   custom_instructions: |
     - Follow [your-framework] patterns
     - Use [your-orm] for database operations
     - Implement [your-ui-library] components
   ```

2. **Modify Allowed Tools:**
   ```yaml
   allowed_tools:
     - "Bash(your-build-command)"
     - "Bash(your-test-command)"
     - "Bash(your-lint-command)"
   ```

3. **Adjust Business Logic Focus:**
   ```yaml
   role_prompt: |
     Focus on [your-domain] specific analysis:
     - [Domain-specific rule 1]
     - [Domain-specific rule 2]
   ```

## 🆘 Troubleshooting

### Common Issues

**Workflow Not Triggering:**
- Check trigger phrase spelling (`@claude-analyze`, `@claude-execute`)
- Verify GitHub token permissions
- Check workflow file syntax with GitHub Actions validator

**Analysis Failing:**
- Ensure dependencies install successfully  
- Check allowed tools are appropriate for your project
- Verify file paths in configuration match your structure

**Execution Blocked:**
- Review approval requirements in comments
- Check security-sensitive change detection
- Verify no conflicting workflow runs

**Permission Errors:**
- Ensure `contents: write` permission for executor
- Check `security-events: write` for security scanning
- Verify token has appropriate repository access

### Getting Help

1. **Check workflow logs** in GitHub Actions tab
2. **Review configuration** in `.claude/subagents-config.yaml`
3. **Test with simple changes** first (like formatting fixes)
4. **Use emergency stop** (`@claude-stop`) if needed

## 🔄 Updates and Maintenance

### Keeping Subagents Updated

1. **Monthly Configuration Review:**
   - Update allowed tools based on project changes
   - Adjust approval requirements
   - Review and update custom instructions

2. **Quarterly Template Updates:**
   - Check for new Claude Code Action versions
   - Update workflow templates with new features
   - Review and optimize orchestration logic

3. **Continuous Improvement:**
   - Monitor subagent effectiveness
   - Gather team feedback on workflow efficiency
   - Adjust automation levels based on team comfort

## 📈 Success Metrics

Track these metrics to measure subagent system effectiveness:

- **Code Quality:** Reduced bugs in production, improved test coverage
- **Security:** Faster vulnerability detection and resolution
- **Productivity:** Reduced manual review time, faster feature delivery
- **Team Satisfaction:** Developer experience improvements, reduced toil

---

*This subagent system transforms your development workflow by providing specialized AI assistance for analysis, execution, and quality assurance while maintaining safety and human oversight.*