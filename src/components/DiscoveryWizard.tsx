import { useState, useEffect } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Card } from './Card';
import { Button } from './Button';
import { Loading } from './Loading';
import { useToast } from '@/hooks/useToast';
import type { DiscoveryFormData, Domain } from '@/types/discovery';

interface DiscoveryWizardProps {
  onSubmit: (data: DiscoveryFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<DiscoveryFormData>;
  onDataChange?: (data: Partial<DiscoveryFormData>) => void; // For auto-save
}

const DOMAIN_OPTIONS: { value: Domain; label: string; description: string }[] = [
  { value: 'workday', label: 'Workday', description: 'HR & Finance transformation' },
  { value: 'epic', label: 'Epic', description: 'Healthcare EHR system' },
  { value: 'oracle-cloud', label: 'Oracle Cloud', description: 'ERP & HCM suite' },
  { value: 'sap', label: 'SAP', description: 'Enterprise resource planning' },
  { value: 'ukg', label: 'UKG', description: 'Human capital management' },
  { value: 'oracle-health', label: 'Oracle Health', description: 'Healthcare solutions' },
  { value: 'salesforce', label: 'Salesforce', description: 'CRM platform' },
  { value: 'servicenow', label: 'ServiceNow', description: 'ITSM & workflow automation' },
  { value: 'custom', label: 'Custom', description: 'Other system or transformation' },
];

const STEPS = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Tell us about your project',
  },
  {
    id: 'scope',
    title: 'Scope & Scale',
    description: 'Define the size and reach',
  },
  {
    id: 'timeline',
    title: 'Timeline & Constraints',
    description: 'Important dates and budget',
  },
  {
    id: 'requirements',
    title: 'Requirements',
    description: 'Must-haves and integrations',
  },
  {
    id: 'context',
    title: 'Organization Context',
    description: 'Current state and readiness',
  },
];

const validationSchema = Yup.object({
  projectName: Yup.string().required('Project name is required').min(3, 'Must be at least 3 characters'),
  description: Yup.string().required('Description is required').min(10, 'Must be at least 10 characters'),
  domain: Yup.string().required('Domain selection is required') as Yup.Schema<Domain>,
  userCount: Yup.number().required('User count is required').min(1, 'Must be at least 1'),
  geographicLocations: Yup.array().min(1, 'Select at least one location'),
  businessUnits: Yup.array().min(1, 'Select at least one business unit'),
  migrationType: Yup.string().required('Migration type is required'),
  changeManagementReadiness: Yup.string().required('Readiness level is required'),
});

export function DiscoveryWizard({ onSubmit, onCancel, initialData, onDataChange }: DiscoveryWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const initialValues: DiscoveryFormData = {
    projectName: initialData?.projectName || '',
    description: initialData?.description || '',
    domain: initialData?.domain || 'workday',
    userCount: initialData?.userCount || 100,
    geographicLocations: initialData?.geographicLocations || [],
    businessUnits: initialData?.businessUnits || [],
    targetGoLiveDate: initialData?.targetGoLiveDate || '',
    hardDeadlines: initialData?.hardDeadlines || [],
    budgetRange: initialData?.budgetRange || '',
    mustHaveFeatures: initialData?.mustHaveFeatures || [],
    niceToHaveFeatures: initialData?.niceToHaveFeatures || [],
    integrationRequirements: initialData?.integrationRequirements || [],
    currentSystem: initialData?.currentSystem || '',
    migrationType: initialData?.migrationType || 'new-implementation',
    changeManagementReadiness: initialData?.changeManagementReadiness || 'medium',
  };

  const handleSubmit = async (values: DiscoveryFormData, helpers: FormikHelpers<DiscoveryFormData>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast.success('Project created successfully!', 'Your discovery intake has been saved.');
    } catch (error) {
      toast.error('Failed to create project', error instanceof Error ? error.message : 'Unknown error');
      helpers.setSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async (validateForm: () => Promise<any>) => {
    const errors = await validateForm();
    const stepFields = getStepFields(currentStep);
    const hasStepErrors = stepFields.some((field) => errors[field]);
    
    if (!hasStepErrors && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 0:
        return ['projectName', 'description', 'domain'];
      case 1:
        return ['userCount', 'geographicLocations', 'businessUnits'];
      case 2:
        return [];
      case 3:
        return [];
      case 4:
        return ['migrationType', 'changeManagementReadiness'];
      default:
        return [];
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card title={`Step ${currentStep + 1} of ${STEPS.length}: ${STEPS[currentStep].title}`}>
        <p className="text-dark-text-muted mb-6">{STEPS[currentStep].description}</p>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-2 mx-1 rounded ${
                  index <= currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-dark-border'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-dark-text-muted">
            {STEPS.map((step) => (
              <span key={step.id}>{step.title}</span>
            ))}
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue, validateForm, isSubmitting: formSubmitting }) => {
            // Auto-save on value change (debounced)
            useEffect(() => {
              if (onDataChange) {
                const timer = setTimeout(() => {
                  onDataChange(values);
                }, 1000); // Debounce 1 second
                return () => clearTimeout(timer);
              }
            }, [values, onDataChange]);

            return (
            <Form>
              {/* Step 1: Basic Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-dark-text mb-1">
                      Project Name *
                    </label>
                    <input
                      id="projectName"
                      name="projectName"
                      type="text"
                      value={values.projectName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.projectName && touched.projectName
                          ? 'border-red-500'
                          : 'border-dark-border bg-dark-surface text-dark-text'
                      }`}
                      placeholder="e.g., Epic EHR Implementation"
                    />
                    {errors.projectName && touched.projectName && (
                      <p className="mt-1 text-sm text-red-400">{errors.projectName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-dark-text mb-1">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.description && touched.description
                          ? 'border-red-500'
                          : 'border-dark-border bg-dark-surface text-dark-text'
                      }`}
                      placeholder="Describe your transformation project..."
                    />
                    {errors.description && touched.description && (
                      <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-dark-text mb-1">
                      Domain / System *
                    </label>
                    <select
                      id="domain"
                      name="domain"
                      value={values.domain}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.domain && touched.domain ? 'border-red-500' : 'border-dark-border bg-dark-surface text-dark-text'
                      }`}
                    >
                      {DOMAIN_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} - {option.description}
                        </option>
                      ))}
                    </select>
                    {errors.domain && touched.domain && (
                      <p className="mt-1 text-sm text-red-400">{errors.domain}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Scope & Scale */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="userCount" className="block text-sm font-medium text-dark-text mb-1">
                      Estimated User Count *
                    </label>
                    <input
                      id="userCount"
                      name="userCount"
                      type="number"
                      min="1"
                      value={values.userCount}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.userCount && touched.userCount ? 'border-red-500' : 'border-dark-border bg-dark-surface text-dark-text'
                      }`}
                    />
                    {errors.userCount && touched.userCount && (
                      <p className="mt-1 text-sm text-red-400">{errors.userCount}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-1">
                      Geographic Locations *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter locations (comma-separated)"
                      value={values.geographicLocations.join(', ')}
                      onChange={(e) => {
                        const locations = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setFieldValue('geographicLocations', locations);
                      }}
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
                    />
                    {errors.geographicLocations && touched.geographicLocations && (
                      <p className="mt-1 text-sm text-red-400">{errors.geographicLocations}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-1">
                      Business Units *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter business units (comma-separated)"
                      value={values.businessUnits.join(', ')}
                      onChange={(e) => {
                        const units = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setFieldValue('businessUnits', units);
                      }}
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
                    />
                    {errors.businessUnits && touched.businessUnits && (
                      <p className="mt-1 text-sm text-red-400">{errors.businessUnits}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Timeline & Constraints */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="targetGoLiveDate" className="block text-sm font-medium text-dark-text mb-1">
                      Target Go-Live Date
                    </label>
                    <input
                      id="targetGoLiveDate"
                      name="targetGoLiveDate"
                      type="date"
                      value={values.targetGoLiveDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-1">
                      Hard Deadlines
                    </label>
                    <input
                      type="text"
                      placeholder="Enter deadlines (comma-separated)"
                      value={values.hardDeadlines.join(', ')}
                      onChange={(e) => {
                        const deadlines = e.target.value
                          .split(',')
                          .map((s: string) => s.trim())
                          .filter(Boolean);
                        setFieldValue('hardDeadlines', deadlines);
                      }}
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="budgetRange" className="block text-sm font-medium text-dark-text mb-1">
                      Budget Range
                    </label>
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      value={values.budgetRange}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-500k">Under $500K</option>
                      <option value="500k-1m">$500K - $1M</option>
                      <option value="1m-5m">$1M - $5M</option>
                      <option value="5m-10m">$5M - $10M</option>
                      <option value="over-10m">Over $10M</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4: Requirements */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-1">
                      Must-Have Features
                    </label>
                    <textarea
                      placeholder="Enter must-have features (one per line)"
                      value={values.mustHaveFeatures.join('\n')}
                      onChange={(e) => {
                        const features = e.target.value
                          .split('\n')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setFieldValue('mustHaveFeatures', features);
                      }}
                      rows={4}
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-1">
                      Nice-to-Have Features
                    </label>
                    <textarea
                      placeholder="Enter nice-to-have features (one per line)"
                      value={values.niceToHaveFeatures.join('\n')}
                      onChange={(e) => {
                        const features = e.target.value
                          .split('\n')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setFieldValue('niceToHaveFeatures', features);
                      }}
                      rows={4}
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-1">
                      Integration Requirements
                    </label>
                    <input
                      type="text"
                      placeholder="Enter integrations (comma-separated)"
                      value={values.integrationRequirements.join(', ')}
                      onChange={(e) => {
                        const integrations = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setFieldValue('integrationRequirements', integrations);
                      }}
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Organization Context */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentSystem" className="block text-sm font-medium text-dark-text mb-1">
                      Current System
                    </label>
                    <input
                      id="currentSystem"
                      name="currentSystem"
                      type="text"
                      value={values.currentSystem}
                      onChange={handleChange}
                      placeholder="e.g., Legacy Epic, On-premise SAP"
                      className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="migrationType" className="block text-sm font-medium text-dark-text mb-1">
                      Migration Type *
                    </label>
                    <select
                      id="migrationType"
                      name="migrationType"
                      value={values.migrationType}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.migrationType && touched.migrationType
                          ? 'border-red-500'
                          : 'border-dark-border bg-dark-surface text-dark-text'
                      }`}
                    >
                      <option value="new-implementation">New Implementation</option>
                      <option value="upgrade">Upgrade</option>
                      <option value="migration">Migration</option>
                      <option value="replacement">Replacement</option>
                    </select>
                    {errors.migrationType && touched.migrationType && (
                      <p className="mt-1 text-sm text-red-400">{errors.migrationType}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="changeManagementReadiness" className="block text-sm font-medium text-dark-text mb-1">
                      Change Management Readiness *
                    </label>
                    <select
                      id="changeManagementReadiness"
                      name="changeManagementReadiness"
                      value={values.changeManagementReadiness}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.changeManagementReadiness && touched.changeManagementReadiness
                          ? 'border-red-500'
                          : 'border-dark-border bg-dark-surface text-dark-text'
                      }`}
                    >
                      <option value="low">Low - Minimal change management experience</option>
                      <option value="medium">Medium - Some change management capabilities</option>
                      <option value="high">High - Strong change management maturity</option>
                    </select>
                    {errors.changeManagementReadiness && touched.changeManagementReadiness && (
                      <p className="mt-1 text-sm text-red-400">{errors.changeManagementReadiness}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <div>
                  {currentStep > 0 && (
                    <Button type="button" variant="secondary" onClick={handlePrevious}>
                      Previous
                    </Button>
                  )}
                  {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel} className="ml-2">
                      Cancel
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep < STEPS.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => handleNext(validateForm)}
                      disabled={formSubmitting || isSubmitting}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={formSubmitting || isSubmitting}>
                      {isSubmitting ? <Loading message="Creating project..." /> : 'Create Project'}
                    </Button>
                  )}
                </div>
              </div>
            </Form>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
}

