/**
 * Demo data generators for Workforce Module
 */

import type { Department, Employee, Schedule, ScheduleAssignment, LaborMetric, EmployeeSentiment } from './types';

export function generateDepartments(orgId: string): Department[] {
  return [
    {
      id: 'dept-1',
      organizationId: orgId,
      name: 'Emergency Department',
      code: 'ED',
      costCenter: 'CC-ED-001',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dept-2',
      organizationId: orgId,
      name: 'Intensive Care Unit',
      code: 'ICU',
      costCenter: 'CC-ICU-001',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dept-3',
      organizationId: orgId,
      name: 'Medical/Surgical',
      code: 'MEDSURG',
      costCenter: 'CC-MS-001',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dept-4',
      organizationId: orgId,
      name: 'Surgery',
      code: 'SURG',
      costCenter: 'CC-SURG-001',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dept-5',
      organizationId: orgId,
      name: 'Outpatient Clinics',
      code: 'OUTPT',
      costCenter: 'CC-OUTPT-001',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function generateEmployees(orgId: string, departmentId?: string): Employee[] {
  const departments = departmentId ? [departmentId] : ['dept-1', 'dept-2', 'dept-3', 'dept-4', 'dept-5'];
  const roles = ['RN', 'LPN', 'CNA', 'Physician', 'Nurse Practitioner', 'Medical Tech', 'Admin'];
  const employees: Employee[] = [];

  departments.forEach((deptId, deptIdx) => {
    const deptSize = [145, 98, 287, 156, 218][deptIdx] || 100;
    const numEmployees = departmentId ? deptSize : 20; // Limit for demo

    for (let i = 0; i < numEmployees; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const baseRate = role === 'Physician' ? 125 : role.includes('Nurse') ? 45 : 28;
      const fte = Math.random() > 0.8 ? 0.5 : 1.0;

      employees.push({
        id: `emp-${deptId}-${i}`,
        organizationId: orgId,
        departmentId: deptId,
        employeeId: `E${String(deptIdx * 1000 + i).padStart(5, '0')}`,
        firstName: `Employee${i}`,
        lastName: `Dept${deptIdx}`,
        email: `employee${i}.dept${deptIdx}@hospital.com`,
        hireDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), 1).toISOString().split('T')[0],
        fte,
        hourlyRate: Math.round((baseRate * (0.9 + Math.random() * 0.4)) * 100) / 100,
        employmentStatus: Math.random() > 0.95 ? 'terminated' : 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return employees;
}

export function generateSchedules(orgId: string, departmentId?: string): Schedule[] {
  const schedules: Schedule[] = [];
  const departments = departmentId ? [departmentId] : ['dept-1', 'dept-2', 'dept-3'];

  departments.forEach((deptId, _idx) => {
    // Generate schedules for next 4 weeks
    for (let week = 0; week < 4; week++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + week * 7);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      schedules.push({
        id: `schedule-${deptId}-week${week}`,
        organizationId: orgId,
        departmentId: deptId,
        periodStart: startDate.toISOString().split('T')[0],
        periodEnd: endDate.toISOString().split('T')[0],
        status: week === 0 ? 'published' : week === 1 ? 'draft' : 'draft',
        createdBy: `emp-${deptId}-manager`,
        approvedAt: week === 0 ? new Date().toISOString() : undefined,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return schedules;
}

export function generateScheduleAssignments(scheduleId: string): ScheduleAssignment[] {
  const assignments: ScheduleAssignment[] = [];
  const shifts = ['Day', 'Evening', 'Night'];
  const days = 7;

  for (let day = 0; day < days; day++) {
    shifts.forEach((_shift, shiftIdx) => {
      for (let emp = 0; emp < 5; emp++) {
        const date = new Date();
        date.setDate(date.getDate() + day);

        const startHour = shiftIdx === 0 ? 7 : shiftIdx === 1 ? 15 : 23;
        const shiftStart = new Date(date);
        shiftStart.setHours(startHour, 0, 0, 0);
        const shiftEnd = new Date(shiftStart);
        shiftEnd.setHours(shiftStart.getHours() + 8);

        assignments.push({
          id: `assign-${day}-${shiftIdx}-${emp}`,
          scheduleId,
          employeeId: `emp-dept-1-${emp}`,
          shiftDate: date.toISOString().split('T')[0],
          shiftStart: shiftStart.toISOString(),
          shiftEnd: shiftEnd.toISOString(),
          hoursWorked: 8,
          overtimeHours: 0,
          shiftType: 'regular',
          breakMinutes: 30,
          createdAt: new Date().toISOString(),
        });
      }
    });
  }

  return assignments;
}

export function generateLaborMetrics(orgId: string, departmentId?: string, _periodId?: string): LaborMetric[] {
  const departments = departmentId ? [departmentId] : ['dept-1', 'dept-2', 'dept-3', 'dept-4', 'dept-5'];
  const metrics: LaborMetric[] = [];

  departments.forEach((deptId) => {
    // Generate last 12 months of metrics
    for (let month = 0; month < 12; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() - month);

      const patientDays = Math.floor(Math.random() * 500) + 400;
      const regularHours = Math.floor(Math.random() * 5000) + 8000;
      const overtimeHours = Math.floor(regularHours * (0.08 + Math.random() * 0.15));
      const productiveHours = regularHours + overtimeHours;
      const nonproductiveHours = Math.floor(productiveHours * 0.15);
      const agencyHours = Math.floor(Math.random() * 200);

      metrics.push({
        id: `metric-${deptId}-${month}`,
        organizationId: orgId,
        departmentId: deptId,
        metricDate: date.toISOString().split('T')[0],
        patientDays,
        productiveHours,
        nonProductiveHours: nonproductiveHours,
        overtimeHours,
        agencyHours,
        totalHours: productiveHours + nonproductiveHours,
        hoursPerPatientDay: Math.round((productiveHours / patientDays) * 100) / 100,
        laborCost: Math.round(productiveHours * 45 + overtimeHours * 22.5 + agencyHours * 85),
        costPerPatientDay: Math.round((productiveHours * 45 + overtimeHours * 22.5) / patientDays * 100) / 100,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return metrics;
}

export function generateEmployeeSentiment(orgId: string, employeeId?: string): EmployeeSentiment[] {
  const sentiments: EmployeeSentiment[] = [];
  const employees = employeeId ? [employeeId] : Array.from({ length: 50 }, (_, i) => `emp-dept-1-${i}`);

  employees.forEach((empId, idx) => {
    const satisfactionScore = Math.floor(Math.random() * 6) + 5; // 5-10
    const burnoutScore = satisfactionScore <= 6 ? Math.floor(Math.random() * 5) + 6 : Math.floor(Math.random() * 4) + 3;
    const engagementScore = satisfactionScore <= 6 ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 3) + 7;

    sentiments.push({
      id: `sentiment-${idx}`,
      organizationId: orgId,
      employeeId: empId,
      surveyDate: new Date().toISOString().split('T')[0],
      burnoutScore,
      engagementScore,
      satisfactionScore,
      feedbackText: burnoutScore > 7 ? 'Feeling overwhelmed with current workload' : undefined,
      createdAt: new Date().toISOString(),
    });
  });

  return sentiments;
}

