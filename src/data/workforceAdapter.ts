import type { WorkforceAdapter, Department, Employee, Schedule, ScheduleAssignment, LaborMetric, EmployeeSentiment } from './workforceTypes';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { logger } from '@/lib/logger';

/**
 * Supabase workforce data adapter
 */
export const workforceAdapter: WorkforceAdapter = {
  // Departments
  async getDepartments(organizationId: string): Promise<Department[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      logger.error('Failed to fetch departments:', error);
      throw error;
    }

    return (data?.map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      name: row.name,
      code: row.code,
      costCenter: row.cost_center,
      parentDepartmentId: row.parent_department_id,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) || []) as Department[];
  },

  async getDepartment(id: string): Promise<Department | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      logger.error('Failed to fetch department:', error);
      throw error;
    }

    return {
      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      code: data.code,
      costCenter: data.cost_center,
      parentDepartmentId: data.parent_department_id,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createDepartment(data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data: result, error } = await supabase
      .from('departments')
      .insert({
        organization_id: data.organizationId,
        name: data.name,
        code: data.code,
        cost_center: data.costCenter,
        parent_department_id: data.parentDepartmentId,
        is_active: data.isActive,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create department:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      name: result.name,
      code: result.code,
      costCenter: result.cost_center,
      parentDepartmentId: result.parent_department_id,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.costCenter !== undefined) updateData.cost_center = data.costCenter;
    if (data.parentDepartmentId !== undefined) updateData.parent_department_id = data.parentDepartmentId;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    const { data: result, error } = await supabase
      .from('departments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update department:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      name: result.name,
      code: result.code,
      costCenter: result.cost_center,
      parentDepartmentId: result.parent_department_id,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  // Employees
  async getEmployees(organizationId: string, departmentId?: string): Promise<Employee[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    let query = supabase
      .from('employees')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('employment_status', 'active');

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    const { data, error } = await query.order('last_name', { ascending: true });

    if (error) {
      logger.error('Failed to fetch employees:', error);
      throw error;
    }

    return (data?.map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      departmentId: row.department_id,
      roleId: row.role_id,
      resourceId: row.resource_id,
      employeeId: row.employee_id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      hireDate: row.hire_date,
      hourlyRate: row.hourly_rate ? parseFloat(row.hourly_rate) : undefined,
      fte: parseFloat(row.fte) || 1.0,
      employmentStatus: row.employment_status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) || []) as Employee[];
  },

  async getEmployee(id: string): Promise<Employee | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      logger.error('Failed to fetch employee:', error);
      throw error;
    }

    return {
      id: data.id,
      organizationId: data.organization_id,
      departmentId: data.department_id,
      roleId: data.role_id,
      resourceId: data.resource_id,
      employeeId: data.employee_id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      hireDate: data.hire_date,
      hourlyRate: data.hourly_rate ? parseFloat(data.hourly_rate) : undefined,
      fte: parseFloat(data.fte) || 1.0,
      employmentStatus: data.employment_status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data: result, error } = await supabase
      .from('employees')
      .insert({
        organization_id: data.organizationId,
        department_id: data.departmentId,
        role_id: data.roleId,
        resource_id: data.resourceId,
        employee_id: data.employeeId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        hire_date: data.hireDate,
        hourly_rate: data.hourlyRate,
        fte: data.fte,
        employment_status: data.employmentStatus,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create employee:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      departmentId: result.department_id,
      roleId: result.role_id,
      resourceId: result.resource_id,
      employeeId: result.employee_id,
      firstName: result.first_name,
      lastName: result.last_name,
      email: result.email,
      hireDate: result.hire_date,
      hourlyRate: result.hourly_rate ? parseFloat(result.hourly_rate) : undefined,
      fte: parseFloat(result.fte) || 1.0,
      employmentStatus: result.employment_status,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const updateData: Record<string, unknown> = {};
    if (data.departmentId !== undefined) updateData.department_id = data.departmentId;
    if (data.roleId !== undefined) updateData.role_id = data.roleId;
    if (data.resourceId !== undefined) updateData.resource_id = data.resourceId;
    if (data.employeeId !== undefined) updateData.employee_id = data.employeeId;
    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.hireDate !== undefined) updateData.hire_date = data.hireDate;
    if (data.hourlyRate !== undefined) updateData.hourly_rate = data.hourlyRate;
    if (data.fte !== undefined) updateData.fte = data.fte;
    if (data.employmentStatus !== undefined) updateData.employment_status = data.employmentStatus;

    const { data: result, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update employee:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      departmentId: result.department_id,
      roleId: result.role_id,
      resourceId: result.resource_id,
      employeeId: result.employee_id,
      firstName: result.first_name,
      lastName: result.last_name,
      email: result.email,
      hireDate: result.hire_date,
      hourlyRate: result.hourly_rate ? parseFloat(result.hourly_rate) : undefined,
      fte: parseFloat(result.fte) || 1.0,
      employmentStatus: result.employment_status,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  // Schedules
  async getSchedules(organizationId: string, departmentId?: string): Promise<Schedule[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    let query = supabase
      .from('schedules')
      .select('*')
      .eq('organization_id', organizationId);

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    const { data, error } = await query.order('period_start', { ascending: false });

    if (error) {
      logger.error('Failed to fetch schedules:', error);
      throw error;
    }

    return (data?.map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      departmentId: row.department_id,
      periodStart: row.period_start,
      periodEnd: row.period_end,
      status: row.status,
      createdBy: row.created_by,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) || []) as Schedule[];
  },

  async getSchedule(id: string): Promise<Schedule | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      logger.error('Failed to fetch schedule:', error);
      throw error;
    }

    return {
      id: data.id,
      organizationId: data.organization_id,
      departmentId: data.department_id,
      periodStart: data.period_start,
      periodEnd: data.period_end,
      status: data.status,
      createdBy: data.created_by,
      approvedBy: data.approved_by,
      approvedAt: data.approved_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createSchedule(data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data: result, error } = await supabase
      .from('schedules')
      .insert({
        organization_id: data.organizationId,
        department_id: data.departmentId,
        period_start: data.periodStart,
        period_end: data.periodEnd,
        status: data.status,
        created_by: data.createdBy,
        approved_by: data.approvedBy,
        approved_at: data.approvedAt,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create schedule:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      departmentId: result.department_id,
      periodStart: result.period_start,
      periodEnd: result.period_end,
      status: result.status,
      createdBy: result.created_by,
      approvedBy: result.approved_by,
      approvedAt: result.approved_at,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  async updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const updateData: Record<string, unknown> = {};
    if (data.departmentId !== undefined) updateData.department_id = data.departmentId;
    if (data.periodStart !== undefined) updateData.period_start = data.periodStart;
    if (data.periodEnd !== undefined) updateData.period_end = data.periodEnd;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.approvedBy !== undefined) updateData.approved_by = data.approvedBy;
    if (data.approvedAt !== undefined) updateData.approved_at = data.approvedAt;

    const { data: result, error } = await supabase
      .from('schedules')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update schedule:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      departmentId: result.department_id,
      periodStart: result.period_start,
      periodEnd: result.period_end,
      status: result.status,
      createdBy: result.created_by,
      approvedBy: result.approved_by,
      approvedAt: result.approved_at,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  async publishSchedule(id: string): Promise<Schedule> {
    return this.updateSchedule(id, { status: 'published' });
  },

  // Schedule Assignments
  async getScheduleAssignments(scheduleId: string): Promise<ScheduleAssignment[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('schedule_assignments')
      .select('*')
      .eq('schedule_id', scheduleId)
      .order('shift_date', { ascending: true })
      .order('shift_start', { ascending: true });

    if (error) {
      logger.error('Failed to fetch schedule assignments:', error);
      throw error;
    }

    return (data?.map((row) => ({
      id: row.id,
      scheduleId: row.schedule_id,
      employeeId: row.employee_id,
      shiftDate: row.shift_date,
      shiftStart: row.shift_start,
      shiftEnd: row.shift_end,
      hoursWorked: parseFloat(row.hours_worked) || 0,
      overtimeHours: parseFloat(row.overtime_hours) || 0,
      shiftType: row.shift_type,
      breakMinutes: row.break_minutes,
      notes: row.notes,
      createdAt: row.created_at,
    })) || []) as ScheduleAssignment[];
  },

  async createScheduleAssignment(data: Omit<ScheduleAssignment, 'id' | 'createdAt'>): Promise<ScheduleAssignment> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data: result, error } = await supabase
      .from('schedule_assignments')
      .insert({
        schedule_id: data.scheduleId,
        employee_id: data.employeeId,
        shift_date: data.shiftDate,
        shift_start: data.shiftStart,
        shift_end: data.shiftEnd,
        overtime_hours: data.overtimeHours,
        shift_type: data.shiftType,
        break_minutes: data.breakMinutes,
        notes: data.notes,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create schedule assignment:', error);
      throw error;
    }

    return {
      id: result.id,
      scheduleId: result.schedule_id,
      employeeId: result.employee_id,
      shiftDate: result.shift_date,
      shiftStart: result.shift_start,
      shiftEnd: result.shift_end,
      hoursWorked: parseFloat(result.hours_worked) || 0,
      overtimeHours: parseFloat(result.overtime_hours) || 0,
      shiftType: result.shift_type,
      breakMinutes: result.break_minutes,
      notes: result.notes,
      createdAt: result.created_at,
    };
  },

  async updateScheduleAssignment(id: string, data: Partial<ScheduleAssignment>): Promise<ScheduleAssignment> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const updateData: Record<string, unknown> = {};
    if (data.employeeId !== undefined) updateData.employee_id = data.employeeId;
    if (data.shiftDate !== undefined) updateData.shift_date = data.shiftDate;
    if (data.shiftStart !== undefined) updateData.shift_start = data.shiftStart;
    if (data.shiftEnd !== undefined) updateData.shift_end = data.shiftEnd;
    if (data.overtimeHours !== undefined) updateData.overtime_hours = data.overtimeHours;
    if (data.shiftType !== undefined) updateData.shift_type = data.shiftType;
    if (data.breakMinutes !== undefined) updateData.break_minutes = data.breakMinutes;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: result, error } = await supabase
      .from('schedule_assignments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update schedule assignment:', error);
      throw error;
    }

    return {
      id: result.id,
      scheduleId: result.schedule_id,
      employeeId: result.employee_id,
      shiftDate: result.shift_date,
      shiftStart: result.shift_start,
      shiftEnd: result.shift_end,
      hoursWorked: parseFloat(result.hours_worked) || 0,
      overtimeHours: parseFloat(result.overtime_hours) || 0,
      shiftType: result.shift_type,
      breakMinutes: result.break_minutes,
      notes: result.notes,
      createdAt: result.created_at,
    };
  },

  async deleteScheduleAssignment(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { error } = await supabase
      .from('schedule_assignments')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Failed to delete schedule assignment:', error);
      throw error;
    }
  },

  // Labor Metrics
  async getLaborMetrics(organizationId: string, departmentId?: string, periodId?: string): Promise<LaborMetric[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    let query = supabase
      .from('labor_metrics')
      .select('*')
      .eq('organization_id', organizationId);

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }
    if (periodId) {
      query = query.eq('period_id', periodId);
    }

    const { data, error } = await query.order('metric_date', { ascending: false });

    if (error) {
      logger.error('Failed to fetch labor metrics:', error);
      throw error;
    }

    return (data?.map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      departmentId: row.department_id,
      periodId: row.period_id,
      metricDate: row.metric_date,
      productiveHours: parseFloat(row.productive_hours) || 0,
      nonProductiveHours: parseFloat(row.non_productive_hours) || 0,
      overtimeHours: parseFloat(row.overtime_hours) || 0,
      agencyHours: parseFloat(row.agency_hours) || 0,
      totalHours: parseFloat(row.total_hours) || 0,
      laborCost: parseFloat(row.labor_cost) || 0,
      patientDays: row.patient_days || 0,
      costPerPatientDay: row.cost_per_patient_day ? parseFloat(row.cost_per_patient_day) : undefined,
      hoursPerPatientDay: row.hours_per_patient_day ? parseFloat(row.hours_per_patient_day) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) || []) as LaborMetric[];
  },

  async getLaborMetric(id: string): Promise<LaborMetric | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('labor_metrics')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      logger.error('Failed to fetch labor metric:', error);
      throw error;
    }

    return {
      id: data.id,
      organizationId: data.organization_id,
      departmentId: data.department_id,
      periodId: data.period_id,
      metricDate: data.metric_date,
      productiveHours: parseFloat(data.productive_hours) || 0,
      nonProductiveHours: parseFloat(data.non_productive_hours) || 0,
      overtimeHours: parseFloat(data.overtime_hours) || 0,
      agencyHours: parseFloat(data.agency_hours) || 0,
      totalHours: parseFloat(data.total_hours) || 0,
      laborCost: parseFloat(data.labor_cost) || 0,
      patientDays: data.patient_days || 0,
      costPerPatientDay: data.cost_per_patient_day ? parseFloat(data.cost_per_patient_day) : undefined,
      hoursPerPatientDay: data.hours_per_patient_day ? parseFloat(data.hours_per_patient_day) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createLaborMetric(data: Omit<LaborMetric, 'id' | 'createdAt' | 'updatedAt'>): Promise<LaborMetric> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data: result, error } = await supabase
      .from('labor_metrics')
      .insert({
        organization_id: data.organizationId,
        department_id: data.departmentId,
        period_id: data.periodId,
        metric_date: data.metricDate,
        productive_hours: data.productiveHours,
        non_productive_hours: data.nonProductiveHours,
        overtime_hours: data.overtimeHours,
        agency_hours: data.agencyHours,
        labor_cost: data.laborCost,
        patient_days: data.patientDays,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create labor metric:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      departmentId: result.department_id,
      periodId: result.period_id,
      metricDate: result.metric_date,
      productiveHours: parseFloat(result.productive_hours) || 0,
      nonProductiveHours: parseFloat(result.non_productive_hours) || 0,
      overtimeHours: parseFloat(result.overtime_hours) || 0,
      agencyHours: parseFloat(result.agency_hours) || 0,
      totalHours: parseFloat(result.total_hours) || 0,
      laborCost: parseFloat(result.labor_cost) || 0,
      patientDays: result.patient_days || 0,
      costPerPatientDay: result.cost_per_patient_day ? parseFloat(result.cost_per_patient_day) : undefined,
      hoursPerPatientDay: result.hours_per_patient_day ? parseFloat(result.hours_per_patient_day) : undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  async updateLaborMetric(id: string, data: Partial<LaborMetric>): Promise<LaborMetric> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const updateData: Record<string, unknown> = {};
    if (data.departmentId !== undefined) updateData.department_id = data.departmentId;
    if (data.periodId !== undefined) updateData.period_id = data.periodId;
    if (data.metricDate !== undefined) updateData.metric_date = data.metricDate;
    if (data.productiveHours !== undefined) updateData.productive_hours = data.productiveHours;
    if (data.nonProductiveHours !== undefined) updateData.non_productive_hours = data.nonProductiveHours;
    if (data.overtimeHours !== undefined) updateData.overtime_hours = data.overtimeHours;
    if (data.agencyHours !== undefined) updateData.agency_hours = data.agencyHours;
    if (data.laborCost !== undefined) updateData.labor_cost = data.laborCost;
    if (data.patientDays !== undefined) updateData.patient_days = data.patientDays;

    const { data: result, error } = await supabase
      .from('labor_metrics')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update labor metric:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      departmentId: result.department_id,
      periodId: result.period_id,
      metricDate: result.metric_date,
      productiveHours: parseFloat(result.productive_hours) || 0,
      nonProductiveHours: parseFloat(result.non_productive_hours) || 0,
      overtimeHours: parseFloat(result.overtime_hours) || 0,
      agencyHours: parseFloat(result.agency_hours) || 0,
      totalHours: parseFloat(result.total_hours) || 0,
      laborCost: parseFloat(result.labor_cost) || 0,
      patientDays: result.patient_days || 0,
      costPerPatientDay: result.cost_per_patient_day ? parseFloat(result.cost_per_patient_day) : undefined,
      hoursPerPatientDay: result.hours_per_patient_day ? parseFloat(result.hours_per_patient_day) : undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  // Employee Sentiment
  async getEmployeeSentiment(organizationId: string, employeeId?: string): Promise<EmployeeSentiment[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    let query = supabase
      .from('employee_sentiment')
      .select('*')
      .eq('organization_id', organizationId);

    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }

    const { data, error } = await query.order('survey_date', { ascending: false });

    if (error) {
      logger.error('Failed to fetch employee sentiment:', error);
      throw error;
    }

    return (data?.map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      employeeId: row.employee_id,
      surveyDate: row.survey_date,
      burnoutScore: row.burnout_score,
      engagementScore: row.engagement_score,
      satisfactionScore: row.satisfaction_score,
      feedbackText: row.feedback_text,
      createdAt: row.created_at,
    })) || []) as EmployeeSentiment[];
  },

  async createEmployeeSentiment(data: Omit<EmployeeSentiment, 'id' | 'createdAt'>): Promise<EmployeeSentiment> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data: result, error } = await supabase
      .from('employee_sentiment')
      .insert({
        organization_id: data.organizationId,
        employee_id: data.employeeId,
        survey_date: data.surveyDate,
        burnout_score: data.burnoutScore,
        engagement_score: data.engagementScore,
        satisfaction_score: data.satisfactionScore,
        feedback_text: data.feedbackText,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create employee sentiment:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      employeeId: result.employee_id,
      surveyDate: result.survey_date,
      burnoutScore: result.burnout_score,
      engagementScore: result.engagement_score,
      satisfactionScore: result.satisfaction_score,
      feedbackText: result.feedback_text,
      createdAt: result.created_at,
    };
  },
};
