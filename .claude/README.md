# Claude Subagents for GitHub Workflows

A comprehensive configuration system that integrates analyzer and executor subagents into every GitHub workflow created by Claude.

## 🎯 Overview

This system creates specialized AI agents that work together to provide comprehensive code analysis, implementation, and quality assurance:

### 🔍 **Analyzer Agent**
- **Purpose:** Code analysis, security scanning, planning
- **Triggers:** `@claude-analyze`, automatic PR analysis
- **Focus:** Read-only analysis with structured reporting
- **Tools:** Grep, Read, Lint, Type checking, Security audits

### ⚡ **Executor Agent**  
- **Purpose:** Implementation, testing, deployment prep
- **Triggers:** `@claude-execute approved`
- **Focus:** Safe code changes with comprehensive quality checks
- **Tools:** Edit, Write, Build, Test, Commit

### 🛡️ **Specialized Subagents**
- **Security:** `@claude-security` - Deep vulnerability analysis
- **Performance:** `@claude-optimize` - Performance optimization 
- **Testing:** `@claude-test` - Comprehensive test generation
- **Docs:** `@claude-docs` - Documentation maintenance

## 🚀 Quick Start

1. **Copy workflows to your repository:**
   ```bash
   cp .claude/workflow-templates/*.yml .github/workflows/
   ```

2. **Ensure Claude Code OAuth token is configured:**
   - Repository Settings → Secrets → `CLAUDE_CODE_OAUTH_TOKEN`

3. **Try it out:**
   ```bash
   # Open a PR or create an issue and comment:
   @claude-analyze
   
   # After review:
   @claude-execute approved
   ```

## 📋 Available Commands

| Command | Purpose | Agent | Approval Required |
|---------|---------|--------|-------------------|
| `@claude-analyze` | Full code analysis | Analyzer | No |
| `@claude-execute approved` | Implement changes | Executor | Yes |
| `@claude-security` | Security analysis | Security | No |
| `@claude-optimize` | Performance optimization | Performance | No |
| `@claude-test` | Generate tests | Testing | No |
| `@claude-docs` | Update documentation | Documentation | No |
| `@claude-stop` | Emergency stop all | Orchestrator | No |

## 🔄 Workflow Examples

### Complete Review Cycle
```mermaid
graph LR
    A[PR Opened] --> B[Auto-Analysis]
    B --> C[Human Review]
    C --> D[@claude-execute approved]
    D --> E[Quality Checks]
    E --> F[Ready to Merge]
```

### Specialized Analysis
```bash
# Security-focused review
@claude-security

# Performance optimization
@claude-optimize

# Test generation
@claude-test
```

### Emergency Controls
```bash
# Stop all running workflows
@claude-stop

# Cancel and restart
@claude-analyze
```

## 🏢 Tenant Management Integration

Pre-configured for this tenant management system:

### Business Logic Validation
- ✅ Property/Unit/Tenant relationship integrity
- ✅ Billing calculation accuracy  
- ✅ Multi-tenant data isolation
- ✅ Authentication flow security

### Technology Stack Support
- ✅ **Backend:** NestJS, Drizzle ORM, SQLite
- ✅ **Frontend:** React, TypeScript, Tailwind
- ✅ **Testing:** Jest, Playwright, Supertest
- ✅ **I18n:** English/French translation support

### Quality Standards
- ✅ TypeScript strict mode compliance
- ✅ ESLint and Prettier formatting
- ✅ Comprehensive test coverage
- ✅ Security best practices

## 🛡️ Safety Features

### Approval System
- **Auto-approved:** Linting, formatting, minor fixes
- **Manual approval:** Feature changes, bug fixes  
- **Security review:** Auth changes, sensitive operations

### Quality Gates
- ✅ All tests must pass
- ✅ Build must succeed  
- ✅ Type checking must pass
- ✅ Linting rules must be satisfied

### Emergency Controls
- 🛑 Emergency stop functionality
- 🔄 Workflow state management
- 🚨 Security issue escalation
- 📊 Comprehensive logging

## 📊 Monitoring Dashboard

Track subagent effectiveness:

```bash
# View recent workflow activity
@claude-analyze stats

# Check system health  
@claude-analyze health

# Review security status
@claude-security dashboard
```

## ⚙️ Configuration

### Core Configuration
Located in `.claude/subagents-config.yaml`:
- Agent role definitions
- Tool restrictions
- Approval requirements
- Environment settings

### Workflow Templates
Located in `.claude/workflow-templates/`:
- `analyzer-agent.yml` - Analysis workflows
- `executor-agent.yml` - Execution workflows  
- `orchestrator.yml` - Coordination logic
- `specialized-agents.yml` - Specialized subagents

## 🔧 Customization

### For Different Projects
1. **Update technology stack references** in configuration
2. **Modify allowed tools** for your build system
3. **Adjust business logic focus** for your domain
4. **Configure approval requirements** for your team

### Environment-Specific Settings
```yaml
development:
  auto_execute_safe_fixes: true
  
production:  
  require_approval_for_all: true
  require_security_review: true
```

## 🆘 Troubleshooting

### Common Issues
- **Workflow not triggering:** Check trigger phrase spelling
- **Permission errors:** Verify GitHub token permissions  
- **Analysis failing:** Check dependency installation
- **Execution blocked:** Review approval requirements

### Getting Help
1. Check workflow logs in GitHub Actions
2. Review configuration in `.claude/subagents-config.yaml`
3. Use `@claude-stop` for emergency situations
4. Test with simple changes first

## 📚 Documentation

- **[Setup Guide](setup-guide.md)** - Detailed installation instructions
- **[Configuration Reference](subagents-config.yaml)** - Complete configuration options
- **[Workflow Templates](workflow-templates/)** - Ready-to-use GitHub Actions

## 🎉 Benefits

### For Developers
- 🚀 **Faster Reviews** - Automated analysis and quality checks
- 🛡️ **Better Security** - Comprehensive security scanning  
- 🧪 **Improved Testing** - Automatic test generation
- 📚 **Better Docs** - Automated documentation updates

### For Teams  
- 📈 **Higher Quality** - Consistent code standards
- 🔒 **Enhanced Security** - Proactive vulnerability detection
- ⚡ **Faster Delivery** - Streamlined development workflow
- 🎯 **Focused Reviews** - Human review for strategic decisions

### For Projects
- 🏗️ **Better Architecture** - Continuous architecture review
- 📊 **Performance Monitoring** - Regular performance optimization
- 🧪 **Test Coverage** - Comprehensive testing strategies
- 📝 **Documentation** - Always up-to-date documentation

---

*Transform your development workflow with AI-powered subagents that provide specialized analysis, implementation, and quality assurance while maintaining human oversight and safety.*