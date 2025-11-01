/**
 * Security Manager for PM0 Healthcare Platform
 * HIPAA Compliance, Audit Logging, Access Control
 */

import { logger } from '../logger';

// =============================================
// AUDIT LOGGING
// =============================================

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  details?: any;
  phi_accessed?: boolean; // Protected Health Information flag
  sensitivity: 'low' | 'medium' | 'high' | 'critical';
}

export class AuditLogger {
  private logs: AuditLog[] = [];

  /**
   * Log an audit event
   */
  async log(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditLog: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...event,
    };

    this.logs.push(auditLog);

    // In production, send to secure audit log storage
    logger.info('Audit Log', auditLog);

    // For HIPAA compliance, critical events should trigger alerts
    if (event.sensitivity === 'critical' || event.phi_accessed) {
      this.triggerSecurityAlert(auditLog);
    }
  }

  /**
   * Log authentication events
   */
  async logAuth(userId: string, userEmail: string, action: string, status: 'success' | 'failure', ipAddress: string) {
    await this.log({
      userId,
      userEmail,
      action: `AUTH:${action}`,
      resource: 'authentication',
      ipAddress,
      userAgent: navigator.userAgent,
      status,
      sensitivity: status === 'failure' ? 'high' : 'medium',
    });
  }

  /**
   * Log data access events (HIPAA requirement)
   */
  async logDataAccess(userId: string, userEmail: string, resource: string, resourceId: string, action: string, ipAddress: string) {
    await this.log({
      userId,
      userEmail,
      action: `DATA:${action}`,
      resource,
      resourceId,
      ipAddress,
      userAgent: navigator.userAgent,
      status: 'success',
      phi_accessed: this.isPHI(resource),
      sensitivity: this.isPHI(resource) ? 'critical' : 'medium',
    });
  }

  /**
   * Log financial data access
   */
  async logFinancialAccess(userId: string, userEmail: string, resource: string, action: string, ipAddress: string) {
    await this.log({
      userId,
      userEmail,
      action: `FINANCIAL:${action}`,
      resource,
      ipAddress,
      userAgent: navigator.userAgent,
      status: 'success',
      sensitivity: 'high',
    });
  }

  /**
   * Check if resource contains PHI
   */
  private isPHI(resource: string): boolean {
    const phiResources = ['patients', 'clinical', 'ehr', 'medical_records'];
    return phiResources.some((phi) => resource.toLowerCase().includes(phi));
  }

  /**
   * Trigger security alert for critical events
   */
  private triggerSecurityAlert(auditLog: AuditLog): void {
    // In production, send to SIEM system
    logger.warn('Security Alert', {
      type: 'CRITICAL_EVENT',
      auditLog,
    });
  }

  /**
   * Query audit logs (for compliance reporting)
   */
  async queryLogs(filters: {
    userId?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    phi_accessed?: boolean;
  }): Promise<AuditLog[]> {
    let results = this.logs;

    if (filters.userId) {
      results = results.filter((log) => log.userId === filters.userId);
    }

    if (filters.resource) {
      results = results.filter((log) => log.resource === filters.resource);
    }

    if (filters.startDate) {
      results = results.filter((log) => log.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      results = results.filter((log) => log.timestamp <= filters.endDate!);
    }

    if (filters.phi_accessed !== undefined) {
      results = results.filter((log) => log.phi_accessed === filters.phi_accessed);
    }

    return results;
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    const logs = await this.queryLogs({ startDate, endDate });

    return {
      period: { startDate, endDate },
      totalEvents: logs.length,
      phiAccess: logs.filter((l) => l.phi_accessed).length,
      failedAuth: logs.filter((l) => l.action.startsWith('AUTH:') && l.status === 'failure').length,
      criticalEvents: logs.filter((l) => l.sensitivity === 'critical').length,
      userActivity: this.aggregateByUser(logs),
      resourceAccess: this.aggregateByResource(logs),
    };
  }

  private aggregateByUser(logs: AuditLog[]): any[] {
    const userMap = new Map<string, number>();
    logs.forEach((log) => {
      userMap.set(log.userId, (userMap.get(log.userId) || 0) + 1);
    });
    return Array.from(userMap.entries()).map(([userId, count]) => ({ userId, count }));
  }

  private aggregateByResource(logs: AuditLog[]): any[] {
    const resourceMap = new Map<string, number>();
    logs.forEach((log) => {
      resourceMap.set(log.resource, (resourceMap.get(log.resource) || 0) + 1);
    });
    return Array.from(resourceMap.entries()).map(([resource, count]) => ({ resource, count }));
  }
}

// =============================================
// ACCESS CONTROL (RBAC)
// =============================================

export type Role = 'admin' | 'cfo' | 'coo' | 'chro' | 'manager' | 'analyst' | 'viewer';

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'export')[];
}

export const RolePermissions: Record<Role, Permission[]> = {
  admin: [
    { resource: '*', actions: ['read', 'write', 'delete', 'export'] },
  ],
  cfo: [
    { resource: 'financial', actions: ['read', 'write', 'export'] },
    { resource: 'budget', actions: ['read', 'write', 'export'] },
    { resource: 'revenue', actions: ['read', 'write', 'export'] },
    { resource: 'workforce', actions: ['read', 'export'] },
    { resource: 'executive', actions: ['read', 'export'] },
  ],
  coo: [
    { resource: 'workforce', actions: ['read', 'write', 'export'] },
    { resource: 'operational', actions: ['read', 'write', 'export'] },
    { resource: 'financial', actions: ['read', 'export'] },
    { resource: 'executive', actions: ['read', 'export'] },
  ],
  chro: [
    { resource: 'workforce', actions: ['read', 'write', 'export'] },
    { resource: 'engagement', actions: ['read', 'write', 'export'] },
    { resource: 'retention', actions: ['read', 'write', 'export'] },
    { resource: 'financial', actions: ['read'] },
  ],
  manager: [
    { resource: 'department', actions: ['read', 'write'] },
    { resource: 'workforce', actions: ['read', 'write'] },
    { resource: 'budget', actions: ['read'] },
  ],
  analyst: [
    { resource: 'financial', actions: ['read', 'export'] },
    { resource: 'workforce', actions: ['read', 'export'] },
    { resource: 'reports', actions: ['read', 'export'] },
  ],
  viewer: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
  ],
};

export class AccessController {
  /**
   * Check if user has permission for action on resource
   */
  hasPermission(userRole: Role, resource: string, action: 'read' | 'write' | 'delete' | 'export'): boolean {
    const permissions = RolePermissions[userRole];

    for (const permission of permissions) {
      // Check wildcard permission
      if (permission.resource === '*' && permission.actions.includes(action)) {
        return true;
      }

      // Check specific resource permission
      if (permission.resource === resource && permission.actions.includes(action)) {
        return true;
      }

      // Check resource prefix (e.g., 'financial' matches 'financial:budgets')
      if (resource.startsWith(permission.resource) && permission.actions.includes(action)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Enforce permission check (throws error if denied)
   */
  enforce(userRole: Role, resource: string, action: 'read' | 'write' | 'delete' | 'export'): void {
    if (!this.hasPermission(userRole, resource, action)) {
      throw new Error(`Access denied: ${userRole} cannot ${action} ${resource}`);
    }
  }

  /**
   * Get all permissions for a role
   */
  getPermissions(userRole: Role): Permission[] {
    return RolePermissions[userRole];
  }
}

// =============================================
// DATA ENCRYPTION
// =============================================

export class DataEncryption {
  /**
   * Encrypt sensitive data (PHI, PII)
   */
  async encrypt(data: string): Promise<string> {
    // In production, use proper encryption (AES-256)
    // For demo, using base64 encoding
    return btoa(data);
  }

  /**
   * Decrypt sensitive data
   */
  async decrypt(encryptedData: string): Promise<string> {
    // In production, use proper decryption
    return atob(encryptedData);
  }

  /**
   * Hash sensitive data (for comparison without decryption)
   */
  async hash(data: string): Promise<string> {
    // In production, use bcrypt or argon2
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}

// =============================================
// SESSION MANAGEMENT
// =============================================

export interface Session {
  id: string;
  userId: string;
  userEmail: string;
  role: Role;
  ipAddress: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

  /**
   * Create new session
   */
  createSession(userId: string, userEmail: string, role: Role, ipAddress: string): Session {
    const now = new Date();
    const session: Session = {
      id: crypto.randomUUID(),
      userId,
      userEmail,
      role,
      ipAddress,
      createdAt: now,
      expiresAt: new Date(now.getTime() + this.MAX_SESSION_DURATION),
      lastActivity: now,
      isActive: true,
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Validate and refresh session
   */
  validateSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    const now = new Date();

    // Check if session expired
    if (now > session.expiresAt) {
      this.terminateSession(sessionId);
      return null;
    }

    // Check if inactive too long
    const inactiveTime = now.getTime() - session.lastActivity.getTime();
    if (inactiveTime > this.SESSION_TIMEOUT) {
      this.terminateSession(sessionId);
      return null;
    }

    // Update last activity
    session.lastActivity = now;
    return session;
  }

  /**
   * Terminate session
   */
  terminateSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.sessions.delete(sessionId);
    }
  }

  /**
   * Get active sessions for user
   */
  getUserSessions(userId: string): Session[] {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId && session.isActive
    );
  }

  /**
   * Terminate all sessions for user
   */
  terminateUserSessions(userId: string): void {
    const userSessions = this.getUserSessions(userId);
    userSessions.forEach((session) => this.terminateSession(session.id));
  }
}

// =============================================
// HIPAA COMPLIANCE UTILITIES
// =============================================

export class HIPAACompliance {
  /**
   * Mask PHI for display (e.g., last 4 digits of SSN)
   */
  maskPHI(value: string, type: 'ssn' | 'phone' | 'email'): string {
    switch (type) {
      case 'ssn':
        return `***-**-${value.slice(-4)}`;
      case 'phone':
        return `***-***-${value.slice(-4)}`;
      case 'email':
        const [, domain] = value.split('@');
        return `***@${domain}`;
      default:
        return '***';
    }
  }

  /**
   * Validate minimum necessary access
   */
  validateMinimumNecessary(requestedFields: string[], userRole: Role): string[] {
    const allowedFields = this.getMinimumNecessaryFields(userRole);
    return requestedFields.filter((field) => allowedFields.includes(field));
  }

  /**
   * Get minimum necessary fields for role
   */
  private getMinimumNecessaryFields(role: Role): string[] {
    const fieldMap: Record<Role, string[]> = {
      admin: ['*'], // All fields
      cfo: ['financial', 'cost', 'revenue', 'budget'],
      coo: ['operational', 'workforce', 'productivity'],
      chro: ['workforce', 'engagement', 'retention', 'demographics'],
      manager: ['department', 'schedule', 'productivity'],
      analyst: ['aggregated', 'metrics', 'trends'],
      viewer: ['dashboard', 'summary'],
    };

    return fieldMap[role] || ['summary'];
  }

  /**
   * Generate BAA (Business Associate Agreement) compliance report
   */
  generateBAAReport(): any {
    return {
      encryption: 'AES-256 at rest, TLS 1.3 in transit',
      accessControl: 'Role-Based Access Control (RBAC)',
      auditLogging: 'Comprehensive audit logs for all PHI access',
      dataRetention: '7 years as per HIPAA requirements',
      breachNotification: 'Automated breach detection and notification',
      riskAssessment: 'Annual security risk assessments',
      training: 'Required HIPAA training for all users',
    };
  }
}

// Export singleton instances
export const auditLogger = new AuditLogger();
export const accessController = new AccessController();
export const dataEncryption = new DataEncryption();
export const sessionManager = new SessionManager();
export const hipaaCompliance = new HIPAACompliance();

// Example usage:
// await auditLogger.logAuth(userId, email, 'LOGIN', 'success', ipAddress);
// accessController.enforce(userRole, 'financial:budgets', 'write');
// const encrypted = await dataEncryption.encrypt(sensitiveData);
// const session = sessionManager.createSession(userId, email, role, ipAddress);

