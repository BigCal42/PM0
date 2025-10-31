import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { useSchedules, useDepartments, useScheduleAssignments, useCreateSchedule } from '@/hooks/useWorkforce';
import { useToast } from '@/hooks/useToast';

// TODO: Get from auth context when available
const MOCK_ORG_ID = 'org-1';

export function Scheduling() {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | undefined>();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | undefined>();
  const toast = useToast();

  const { data: departments, isLoading: deptsLoading } = useDepartments(MOCK_ORG_ID);
  const { data: schedules, isLoading: schedulesLoading } = useSchedules(MOCK_ORG_ID, selectedDepartmentId);
  const { data: assignments, isLoading: assignmentsLoading } = useScheduleAssignments(
    selectedScheduleId || ''
  );
  const createSchedule = useCreateSchedule();

  const isLoading = deptsLoading || schedulesLoading;

  const handleCreateSchedule = async () => {
    if (!selectedDepartmentId) {
      toast.warning('Select a department', 'Please select a department first.');
      return;
    }

    // TODO: Open schedule creation form/modal
    toast.info('Schedule creation', 'Schedule creation form coming soon!');
  };

  const handleScheduleSelect = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId === selectedScheduleId ? undefined : scheduleId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Workforce Scheduling
        </h1>
        <p className="text-dark-text-muted text-lg">
          Manage staff schedules and assignments
        </p>
      </div>

      {/* Department Selector */}
      <Card title="Department" className="mb-6">
        {deptsLoading ? (
          <Loading message="Loading departments..." />
        ) : (
          <div className="flex gap-4 flex-wrap">
            <select
              value={selectedDepartmentId || ''}
              onChange={(e) => {
                setSelectedDepartmentId(e.target.value || undefined);
                setSelectedScheduleId(undefined); // Reset schedule selection
              }}
              className="px-4 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
            >
              <option value="">All Departments</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} {dept.code ? `(${dept.code})` : ''}
                </option>
              ))}
            </select>
            <Button onClick={handleCreateSchedule} disabled={!selectedDepartmentId}>
              + Create Schedule
            </Button>
          </div>
        )}
      </Card>

      {/* Schedules List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title={selectedDepartmentId ? "Schedules" : "Select a department to view schedules"}>
            {isLoading ? (
              <Loading message="Loading schedules..." />
            ) : schedules && schedules.length > 0 ? (
              <div className="space-y-3">
                {schedules.map((schedule) => {
                  const isSelected = schedule.id === selectedScheduleId;
                  const deptName = departments?.find(d => d.id === schedule.departmentId)?.name || 'Unknown';

                  return (
                    <div
                      key={schedule.id}
                      onClick={() => handleScheduleSelect(schedule.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-dark-border hover:border-purple-500/50 hover:bg-dark-surface/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-dark-text mb-1">{deptName}</h3>
                          <p className="text-sm text-dark-text-muted">
                            {formatDate(schedule.periodStart)} - {formatDate(schedule.periodEnd)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}>
                          {schedule.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-dark-text-muted mb-4">
                  {selectedDepartmentId ? 'No schedules found for this department.' : 'Select a department to view schedules.'}
                </p>
                {selectedDepartmentId && (
                  <Button onClick={handleCreateSchedule}>Create First Schedule</Button>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Schedule Details / Assignments */}
        <div>
          {selectedScheduleId ? (
            <Card title="Schedule Assignments">
              {assignmentsLoading ? (
                <Loading message="Loading assignments..." />
              ) : assignments && assignments.length > 0 ? (
                <div className="space-y-2">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-3 border border-dark-border rounded-lg bg-dark-surface/30"
                    >
                      <p className="text-sm font-medium text-dark-text">
                        {formatDate(assignment.shiftDate)}
                      </p>
                      <p className="text-xs text-dark-text-muted">
                        {assignment.shiftStart} - {assignment.shiftEnd}
                      </p>
                      <p className="text-xs text-dark-text-muted mt-1">
                        {assignment.hoursWorked.toFixed(1)}h
                        {assignment.overtimeHours > 0 && (
                          <span className="text-yellow-400 ml-1">({assignment.overtimeHours.toFixed(1)}h OT)</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-dark-text-muted text-sm mb-4">No assignments yet</p>
                  <Button size="sm" variant="secondary">
                    + Add Assignment
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <Card title="Select a Schedule">
              <p className="text-sm text-dark-text-muted">
                Click on a schedule to view its assignments and details.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
