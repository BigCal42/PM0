# PM0 Healthcare Finance & Operations Platform - Deployment Guide

## 🚀 Deployment Overview

This guide covers the complete deployment process for the PM0 Healthcare Finance & Operations Platform, including infrastructure setup, database migrations, security configuration, and production deployment.

---

## Prerequisites

### Required Tools
- Node.js 18+ and npm
- Supabase CLI
- Git
- PostgreSQL 14+ (for local development)

### Required Accounts
- Supabase Project
- Vercel Account (for frontend deployment)
- Domain and SSL Certificate (for production)

---

## Phase 1: Environment Setup

### 1.1 Clone and Install

```bash
git clone <repository-url>
cd PM0
npm install
```

### 1.2 Environment Configuration

Create `.env` file:

```env
# Demo Mode (for testing)
VITE_USE_DEMO_DATA=false

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Monitoring
VITE_SENTRY_DSN=your-sentry-dsn

# Integration Endpoints (Production Only)
EPIC_FHIR_ENDPOINT=https://epic.hospital.org/api/FHIR/R4
WORKDAY_API_ENDPOINT=https://wd2-impl-services1.workday.com/ccx/service
UKG_API_ENDPOINT=https://api.ukg.com/v1
```

---

## Phase 2: Database Setup

### 2.1 Initialize Supabase Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 2.2 Apply Migrations

The platform includes three core migration files:

1. **001_base_schema.sql** - Base tables (projects, scenarios, users)
2. **002_financial_module.sql** - Financial data models
3. **003_workforce_module.sql** - Workforce management

Run migrations:

```bash
# Apply all migrations
cd supabase/migrations
psql $DATABASE_URL -f 002_financial_module.sql
psql $DATABASE_URL -f 003_workforce_module.sql
```

### 2.3 Seed Demo Data (Optional)

```bash
supabase db seed --file supabase/seed/000_demo_seed.sql
```

---

## Phase 3: Security Configuration

### 3.1 Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- Create RLS policies based on org_id
CREATE POLICY "Users can view their org's data" ON cost_centers
  FOR SELECT USING (org_id = auth.jwt() ->> 'org_id');

CREATE POLICY "Admins can manage their org's data" ON cost_centers
  FOR ALL USING (
    org_id = auth.jwt() ->> 'org_id' AND
    auth.jwt() ->> 'role' IN ('admin', 'cfo', 'coo')
  );
```

### 3.2 Configure Authentication

Enable auth providers in Supabase dashboard:
- Email/Password
- OAuth (Google, Microsoft Azure AD for enterprise)
- SAML SSO (for large healthcare systems)

### 3.3 HIPAA Compliance Setup

```bash
# Enable audit logging
npm run setup-audit-logging

# Configure encryption
npm run setup-encryption

# Generate BAA documentation
npm run generate-baa
```

---

## Phase 4: Integration Configuration

### 4.1 EHR Integration (Epic)

```typescript
// Configure Epic FHIR integration
import { EHRIntegration } from '@/lib/integrations/IntegrationHub';

const epicConfig = {
  type: 'EHR',
  provider: 'Epic',
  endpoint: process.env.EPIC_FHIR_ENDPOINT,
  authType: 'oauth',
  clientId: process.env.EPIC_CLIENT_ID,
  clientSecret: process.env.EPIC_CLIENT_SECRET,
  isActive: true,
};

const epicIntegration = new EHRIntegration(epicConfig);
integrationManager.registerIntegration('Epic', epicIntegration);
```

### 4.2 ERP Integration (Workday)

```typescript
// Configure Workday Financial Management
const workdayConfig = {
  type: 'ERP',
  provider: 'Workday',
  endpoint: process.env.WORKDAY_API_ENDPOINT,
  authType: 'basic',
  clientId: process.env.WORKDAY_USERNAME,
  clientSecret: process.env.WORKDAY_PASSWORD,
  isActive: true,
};
```

### 4.3 HRIS Integration (UKG)

```typescript
// Configure UKG Pro
const ukgConfig = {
  type: 'HRIS',
  provider: 'UKG',
  endpoint: process.env.UKG_API_ENDPOINT,
  authType: 'apikey',
  apiKey: process.env.UKG_API_KEY,
  isActive: true,
};
```

### 4.4 Schedule Automated Syncs

```typescript
// Setup cron jobs for data syncs
// Run every hour
cron.schedule('0 * * * *', async () => {
  await integrationManager.runScheduledSyncs();
});
```

---

## Phase 5: Testing

### 5.1 Run Unit Tests

```bash
npm run test
```

### 5.2 Run E2E Tests

```bash
npm run test:e2e
```

### 5.3 Security Testing

```bash
# Check for vulnerabilities
npm audit

# Run security scan
npm run security-scan
```

### 5.4 Performance Testing

```bash
# Run lighthouse audit
npm run lighthouse

# Load testing
npm run load-test
```

---

## Phase 6: Production Deployment

### 6.1 Build for Production

```bash
# Type check
npm run typecheck

# Build application
npm run build

# Preview production build
npm run preview
```

### 6.2 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

### 6.3 Configure Custom Domain

```bash
# Add domain in Vercel dashboard
vercel domains add pm0.yourhospital.com

# Configure DNS
# Add CNAME record: pm0 -> cname.vercel-dns.com
```

### 6.4 SSL Configuration

Vercel automatically provisions SSL certificates via Let's Encrypt.

For custom SSL:
1. Upload certificate in Vercel dashboard
2. Configure intermediate certificates
3. Enable HTTPS redirect

---

## Phase 7: Monitoring & Maintenance

### 7.1 Setup Monitoring

```bash
# Configure Sentry for error tracking
npm install @sentry/react

# Setup application monitoring
npm run setup-monitoring
```

### 7.2 Configure Alerts

Setup alerts for:
- Application errors (>5/minute)
- High response times (>3s)
- Database connection issues
- Integration failures
- Security events

### 7.3 Backup Strategy

```bash
# Configure automated backups
supabase db backup schedule --daily

# Test backup restoration
supabase db backup restore --backup-id <id>
```

### 7.4 Performance Monitoring

```bash
# Setup performance monitoring
npm run setup-performance-monitoring

# Configure metrics:
# - Page load times
# - API response times
# - Database query performance
# - Integration sync duration
```

---

## Phase 8: Post-Deployment Checklist

- [ ] All migrations applied successfully
- [ ] RLS policies enabled and tested
- [ ] Authentication working (email, OAuth, SSO)
- [ ] All integrations tested and syncing
- [ ] Security scanning completed
- [ ] Performance benchmarks met
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Monitoring and alerts configured
- [ ] Backup strategy implemented
- [ ] User training completed
- [ ] Documentation published
- [ ] BAA signed (if applicable)

---

## Phase 9: User Onboarding

### 9.1 Initial Setup

```bash
# Create admin user
npm run create-admin-user

# Import organizational structure
npm run import-org-structure

# Setup cost centers
npm run setup-cost-centers
```

### 9.2 Data Migration

```bash
# Import historical financial data
npm run import-financial-data --file historical_budgets.csv

# Import employee data
npm run import-employees --file employee_master.csv

# Import schedule data
npm run import-schedules --file schedules.csv
```

### 9.3 Training Materials

Provide users with:
- Platform overview video
- Role-specific training guides
- Quick reference cards
- FAQs and troubleshooting guide

---

## Troubleshooting

### Common Issues

**Issue: Supabase connection timeout**
```bash
# Check Supabase status
curl https://status.supabase.com

# Verify environment variables
echo $VITE_SUPABASE_URL

# Test connection
npm run test-supabase-connection
```

**Issue: Integration sync failures**
```bash
# Check integration status
npm run check-integration-health

# View integration logs
npm run view-integration-logs --last 100

# Retry failed syncs
npm run retry-failed-syncs
```

**Issue: Performance degradation**
```bash
# Check database indexes
npm run check-database-indexes

# Optimize queries
npm run optimize-queries

# Clear cache
npm run clear-cache
```

---

## Support & Maintenance

### Regular Maintenance Tasks

**Daily:**
- Monitor error logs
- Check integration sync status
- Review security alerts

**Weekly:**
- Review performance metrics
- Check database growth
- Update dependencies

**Monthly:**
- Security audit
- Backup verification
- Performance optimization
- User feedback review

**Quarterly:**
- Disaster recovery drill
- Compliance audit
- Capacity planning
- Feature review

---

## Security Best Practices

1. **Access Control**
   - Implement role-based access control (RBAC)
   - Use principle of least privilege
   - Regular access reviews

2. **Data Protection**
   - Encrypt data at rest and in transit
   - Regular security updates
   - Vulnerability scanning

3. **Audit Logging**
   - Log all PHI access
   - Regular audit log reviews
   - 7-year retention policy

4. **Compliance**
   - HIPAA compliance monitoring
   - SOC 2 Type II certification
   - Regular compliance audits

---

## Scaling Considerations

### Horizontal Scaling

```bash
# Configure load balancing
# Setup multiple Vercel deployments
# Implement CDN for static assets
```

### Database Scaling

```bash
# Enable Supabase database pooling
# Configure read replicas
# Implement query caching
```

### Integration Scaling

```bash
# Implement queue-based sync processing
# Add integration workers
# Configure retry policies
```

---

## Contact & Support

For deployment assistance:
- Technical Support: support@pm0.com
- Implementation Team: implementation@pm0.com
- Security Team: security@pm0.com

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-30  
**Next Review:** 2025-04-30

